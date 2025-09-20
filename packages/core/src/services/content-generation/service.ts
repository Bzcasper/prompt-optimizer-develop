import { ILLMService, Message } from '../llm/types';
import { TemplateManager } from '../template/manager';
import { Template } from '../template/types';
import { Mustache } from '../template/minimal';
import {
  IContentGenerationService,
  ContentGenerationRequest,
  ContentGenerationResult,
  ContentTemplateInfo,
  ValidationResult,
  ContentIteration
} from './types';
import {
  ContentGenerationError,
  TemplateNotFoundError,
  InvalidVariablesError,
  LLMServiceError,
  ContentGenerationErrorCode
} from './errors';

export class ContentGenerationService implements IContentGenerationService {
  constructor(
    private llmService: ILLMService,
    private templateManager: TemplateManager
  ) {}

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
    const startTime = Date.now();

    try {
      // Validate request
      await this.validateRequest(request);

      // Get template
      const template = await this.templateManager.getTemplate(request.templateId);
      if (!template) {
        throw new TemplateNotFoundError(request.templateId);
      }

      // Validate variables
      const validation = await this.validateVariables(request.templateId, request.variables);
      if (!validation.isValid) {
        throw new InvalidVariablesError(validation.errors, validation.warnings);
      }

      // Process template with variables
      const processedContent = this.processTemplate(template, request.variables);

      // Generate content using LLM
      const messages: Message[] = this.buildMessages(processedContent, request.options?.systemPrompt);

      const llmResponse = await this.llmService.sendMessageStructured(messages, request.modelKey);

      const processingTime = Date.now() - startTime;

      return {
        content: llmResponse.content,
        metadata: {
          templateId: request.templateId,
          modelKey: request.modelKey,
          variables: request.variables,
          generatedAt: new Date(),
          tokensUsed: llmResponse.metadata?.tokens,
          processingTime
        }
      };
    } catch (error) {
      if (error instanceof ContentGenerationError) {
        throw error;
      }
      throw new LLMServiceError(error as Error);
    }
  }

  async generateWithIteration(
    request: ContentGenerationRequest,
    refinementPrompt: string,
    maxIterations: number = 3
  ): Promise<ContentGenerationResult> {
    const result = await this.generateContent(request);
    const iterations: ContentIteration[] = [{
      step: 1,
      content: result.content,
      timestamp: new Date()
    }];

    for (let i = 1; i < maxIterations; i++) {
      try {
        // Create refinement messages with context from previous iterations
        const refinementMessages: Message[] = this.buildIterativeRefinementMessages(
          result.content,
          refinementPrompt,
          iterations,
          i + 1
        );

        const refinementResponse = await this.llmService.sendMessageStructured(refinementMessages, request.modelKey);

        iterations.push({
          step: i + 1,
          content: refinementResponse.content,
          feedback: refinementPrompt,
          timestamp: new Date()
        });

        result.content = refinementResponse.content;
        result.metadata.processingTime += Date.now() - result.metadata.generatedAt.getTime();

        // Check if content has converged (similarity check could be added here)
        if (this.hasConverged(iterations.slice(-2))) {
          break;
        }

      } catch (error) {
        // Log error but continue with current result
        console.warn(`Iteration ${i + 1} failed:`, error);
        break;
      }
    }

    result.iterations = iterations;
    return result;
  }

  async generateWithInteractiveIteration(
    request: ContentGenerationRequest,
    feedbackProvider: (content: string, iteration: number) => Promise<string>
  ): Promise<ContentGenerationResult> {
    const result = await this.generateContent(request);
    const iterations: ContentIteration[] = [{
      step: 1,
      content: result.content,
      timestamp: new Date()
    }];

    const maxIterations = 5; // Allow more iterations for interactive mode

    for (let i = 1; i < maxIterations; i++) {
      try {
        // Get user feedback for this iteration
        const feedback = await feedbackProvider(result.content, i + 1);

        if (!feedback || feedback.toLowerCase().includes('stop')) {
          break; // User wants to stop iteration
        }

        // Generate refined content based on feedback
        const refinementMessages: Message[] = this.buildInteractiveRefinementMessages(
          result.content,
          feedback,
          iterations,
          i + 1
        );

        const refinementResponse = await this.llmService.sendMessageStructured(refinementMessages, request.modelKey);

        iterations.push({
          step: i + 1,
          content: refinementResponse.content,
          feedback,
          timestamp: new Date()
        });

        result.content = refinementResponse.content;
        result.metadata.processingTime += Date.now() - result.metadata.generatedAt.getTime();

      } catch (error) {
        console.warn(`Interactive iteration ${i + 1} failed:`, error);
        break;
      }
    }

    result.iterations = iterations;
    return result;
  }

  async validateVariables(templateId: string, variables: Record<string, any>): Promise<ValidationResult> {
    const template = await this.templateManager.getTemplate(templateId);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template '${templateId}' not found`],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Extract required variables from template content
    const requiredVars = this.extractRequiredVariables(template.content as string);

    // Check required variables
    for (const varName of requiredVars) {
      if (!(varName in variables) || variables[varName] === undefined || variables[varName] === '') {
        errors.push(`Missing required variable: ${varName}`);
      }
    }

    // Check variable types and values
    for (const [key, value] of Object.entries(variables)) {
      if (typeof value !== 'string' && typeof value !== 'number' && !Array.isArray(value)) {
        warnings.push(`Variable '${key}' should be string, number, or array`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async getAvailableTemplates(): Promise<ContentTemplateInfo[]> {
    // For now, we'll create a mock list since the template manager doesn't have content-generation type
    // In a real implementation, we'd add content-generation templates to the template system
    return this.getMockTemplates();
  }

  private async validateRequest(request: ContentGenerationRequest): Promise<void> {
    if (!request.templateId) {
      throw new ContentGenerationError(
        'Template ID is required',
        ContentGenerationErrorCode.INVALID_REQUEST
      );
    }

    if (!request.modelKey) {
      throw new ContentGenerationError(
        'Model key is required',
        ContentGenerationErrorCode.INVALID_REQUEST
      );
    }

    if (!request.variables || typeof request.variables !== 'object') {
      throw new ContentGenerationError(
        'Variables must be a valid object',
        ContentGenerationErrorCode.INVALID_REQUEST
      );
    }
  }

  private processTemplate(template: Template, variables: Record<string, any>): string {
    // Use Mustache to process template variables
    const content = typeof template.content === 'string' ? template.content : '';
    return Mustache.render(content, variables);
  }

  private buildMessages(content: string, systemPrompt?: string): Message[] {
    const messages: Message[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content });

    return messages;
  }



  private buildIterativeRefinementMessages(
    currentContent: string,
    refinementPrompt: string,
    previousIterations: ContentIteration[],
    iteration: number
  ): Message[] {
    const iterationHistory = previousIterations
      .map(iter => `Iteration ${iter.step}: ${iter.content.substring(0, 200)}...`)
      .join('\n');

    return [
      {
        role: 'system',
        content: `You are an expert content editor specializing in iterative refinement. This is iteration ${iteration} of the content improvement process. Review the iteration history and apply the refinement requirements intelligently.`
      },
      {
        role: 'user',
        content: `Iteration History:
${iterationHistory}

Current Content:
${currentContent}

Refinement Requirements:
${refinementPrompt}

Please provide an improved version of the content that builds upon previous iterations and addresses the current refinement requirements. Focus on quality improvements and avoid repeating previous mistakes.`
      }
    ];
  }

  private buildInteractiveRefinementMessages(
    currentContent: string,
    userFeedback: string,
    previousIterations: ContentIteration[],
    iteration: number
  ): Message[] {
    const context = previousIterations.length > 1 ?
      `\n\nPrevious iterations:\n${previousIterations.slice(0, -1).map(iter =>
        `Step ${iter.step}: ${iter.feedback ? `Feedback: ${iter.feedback}` : 'Initial generation'}`
      ).join('\n')}` : '';

    return [
      {
        role: 'system',
        content: `You are an expert content editor working on iterative content refinement. This is iteration ${iteration}. Pay close attention to the user's specific feedback and make targeted improvements.`
      },
      {
        role: 'user',
        content: `Current Content:
${currentContent}

User Feedback for Improvement:
${userFeedback}${context}

Please refine the content based on this specific feedback, maintaining the overall structure and quality while addressing the pointed issues.`
      }
    ];
  }

  private hasConverged(recentIterations: ContentIteration[]): boolean {
    if (recentIterations.length < 2) return false;

    // Simple convergence check: if the last two iterations are very similar
    const last = recentIterations[recentIterations.length - 1].content;
    const secondLast = recentIterations[recentIterations.length - 2].content;

    // Calculate simple similarity (could be enhanced with more sophisticated algorithms)
    const similarity = this.calculateSimilarity(last, secondLast);
    return similarity > 0.85; // 85% similarity threshold
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple word-based similarity calculation
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  private extractRequiredVariables(content: string): string[] {
    const variableRegex = /\{\{(\w+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = variableRegex.exec(content)) !== null) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  }



  private getMockTemplates(): ContentTemplateInfo[] {
    // Mock templates for now - in production, these would come from the template system
    return [
      {
        id: 'article-writer',
        name: 'Article Writer',
        description: 'Professional article writing template optimized for SEO and audience engagement',
        category: 'article',
        requiredVariables: ['topic', 'audience', 'wordCount', 'tone', 'keyPoints', 'primaryKeyword', 'secondaryKeywords'],
        optionalVariables: [],
        outputFormat: 'text'
      },
      {
        id: 'marketing-copy',
        name: 'Marketing Copy',
        description: 'Create compelling marketing copy for various campaigns and platforms',
        category: 'marketing',
        requiredVariables: ['product', 'targetAudience', 'keyBenefits', 'callToAction'],
        optionalVariables: ['tone', 'platform'],
        outputFormat: 'text'
      },
      {
        id: 'technical-doc',
        name: 'Technical Documentation',
        description: 'Generate clear and comprehensive technical documentation',
        category: 'technical',
        requiredVariables: ['topic', 'audience', 'complexity', 'keyPoints'],
        optionalVariables: ['codeExamples', 'prerequisites'],
        outputFormat: 'text'
      }
    ];
  }
}

export function createContentGenerationService(
  llmService: ILLMService,
  templateManager: TemplateManager
): IContentGenerationService {
  return new ContentGenerationService(llmService, templateManager);
}