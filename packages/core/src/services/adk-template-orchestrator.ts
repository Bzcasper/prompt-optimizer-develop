/**
 * ADK Template Orchestrator
 * Integrates Google ADK agents with the template system for advanced AI workflows
 */

import { Template, ITemplateManager } from './template/types';
import { TemplateProcessor, TemplateContext } from './template/processor';
import { AgentRegistry } from './agent-registry';
import { SpecializedGoogleADKAgents } from './google-adk-agents';
import { GoogleADKConfig, GoogleADKIntegration } from './google-adk';
import { RegistryOrchestrator } from './registry-orchestrator';

export interface ADKTemplateExecutionRequest {
  templateId: string;
  agentType: 'content-creation' | 'data-analysis' | 'code-generation';
  context: TemplateContext;
  executionOptions?: {
    timeout?: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    maxRetries?: number;
  };
}

export interface ADKTemplateExecutionResult {
  success: boolean;
  templateResult?: any;
  agentResult?: any;
  combinedResult?: any;
  executionTime: number;
  cost: number;
  metadata: {
    templateId: string;
    agentId: string;
    sessionId: string;
    timestamp: number;
  };
}

export class ADKTemplateOrchestrator {
  private templateManager: ITemplateManager;
  private agentRegistry: AgentRegistry;
  private adkIntegration: GoogleADKIntegration;
  private registryOrchestrator: RegistryOrchestrator;

  constructor(
    templateManager: ITemplateManager,
    agentRegistry: AgentRegistry,
    adkConfig?: { projectId: string; location: string }
  ) {
    this.templateManager = templateManager;
    this.agentRegistry = agentRegistry;
    this.adkIntegration = new GoogleADKIntegration();
    this.registryOrchestrator = new RegistryOrchestrator(adkConfig);

    if (adkConfig) {
      this.initializeADKAgents(adkConfig.projectId, adkConfig.location);
    }
  }

  /**
   * Initialize ADK agents with the orchestrator
   */
  private async initializeADKAgents(projectId: string, location: string): Promise<void> {
    try {
      SpecializedGoogleADKAgents.registerAllSpecializedAgents(
        this.agentRegistry,
        projectId,
        location
      );
      console.log('✅ ADK agents initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize ADK agents:', error);
    }
  }

  /**
   * Execute template with ADK agent integration
   */
  async executeADKTemplate(request: ADKTemplateExecutionRequest): Promise<ADKTemplateExecutionResult> {
    const startTime = Date.now();
    const sessionId = this.generateSessionId();

    try {
      // Get the template
      const template = await this.templateManager.getTemplate(request.templateId);

      // Process template with context
      const processedMessages = TemplateProcessor.processTemplate(template, request.context);

      // Select appropriate ADK agent
      const agentId = await this.selectADKAgent(request.agentType);

      if (!agentId) {
        throw new Error(`No suitable ADK agent found for type: ${request.agentType}`);
      }

      // Prepare agent execution context
      const agentContext = {
        agentId,
        task: this.extractTaskFromTemplate(template, request.context),
        parameters: {
          templateId: request.templateId,
          processedMessages,
          context: request.context,
          agentType: request.agentType
        },
        sessionId,
        timeout: request.executionOptions?.timeout || 300000,
        priority: request.executionOptions?.priority || 'medium'
      };

      // Execute with agent
      const agentResult = await this.agentRegistry.executeAgent(agentContext);

      // Combine template and agent results
      const combinedResult = await this.combineResults(template, processedMessages, agentResult);

      return {
        success: true,
        templateResult: processedMessages,
        agentResult: agentResult.data,
        combinedResult,
        executionTime: Date.now() - startTime,
        cost: agentResult.cost,
        metadata: {
          templateId: request.templateId,
          agentId,
          sessionId,
          timestamp: Date.now()
        }
      };

    } catch (error) {
      return {
        success: false,
        executionTime: Date.now() - startTime,
        cost: 0,
        metadata: {
          templateId: request.templateId,
          agentId: '',
          sessionId,
          timestamp: Date.now()
        }
      };
    }
  }

  /**
   * Get available ADK agents
   */
  getAvailableADKAgents(): string[] {
    const agents = this.agentRegistry.listAgents();
    return agents
      .filter(agent => agent.definition.tags?.includes('adk'))
      .map(agent => agent.id);
  }

  /**
   * Get ADK templates
   */
  async getADKTemplates(): Promise<Template[]> {
    const allTemplates = await this.templateManager.listTemplates();
    return allTemplates.filter(template =>
      template.metadata.tags?.includes('adk') ||
      template.metadata.description?.toLowerCase().includes('adk')
    );
  }

  /**
   * Create ADK-enhanced template
   */
  async createADKTemplate(
    baseTemplate: Template,
    agentType: string,
    enhancements: any
  ): Promise<Template> {
    const adkTemplate: Template = {
      ...baseTemplate,
      id: `adk-${baseTemplate.id}-${agentType}`,
      name: `ADK Enhanced: ${baseTemplate.name}`,
      metadata: {
        ...baseTemplate.metadata,
        lastModified: Date.now(),
        author: 'ADK Integration',
        description: `ADK-enhanced template for ${agentType} tasks`,
        tags: [...(baseTemplate.metadata.tags || []), 'adk', agentType],
        templateType: baseTemplate.metadata.templateType
      }
    };

    // Add ADK-specific enhancements to content
    if (typeof adkTemplate.content === 'string') {
      adkTemplate.content = this.enhanceTemplateContent(adkTemplate.content, agentType, enhancements);
    } else if (Array.isArray(adkTemplate.content)) {
      adkTemplate.content = adkTemplate.content.map(msg => ({
        ...msg,
        content: this.enhanceTemplateContent(msg.content, agentType, enhancements)
      }));
    }

    await this.templateManager.saveTemplate(adkTemplate);
    return adkTemplate;
  }

  // Private helper methods

  private selectADKAgent(agentType: string): Promise<string | null> {
    const agentMapping = {
      'content-creation': 'content-creation-agent',
      'data-analysis': 'data-analysis-agent',
      'code-generation': 'code-generation-agent'
    };

    const agentId = agentMapping[agentType as keyof typeof agentMapping];
    return Promise.resolve(agentId || null);
  }

  private extractTaskFromTemplate(template: Template, context: TemplateContext): string {
    // Extract task from template metadata or context
    return template.metadata.description || 'general-task';
  }

  private async combineResults(
    template: Template,
    messages: any[],
    agentResult: any
  ): Promise<any> {
    return {
      template,
      messages,
      agentOutput: agentResult.data,
      combined: true,
      timestamp: Date.now()
    };
  }

  private enhanceTemplateContent(content: string, agentType: string, enhancements: any): string {
    // Add ADK-specific instructions to template content
    const adkInstructions = {
      'content-creation': '\n\nADK Enhancement: Leverage Google ADK for advanced content generation with multi-modal capabilities.',
      'data-analysis': '\n\nADK Enhancement: Utilize Google ADK for sophisticated data analysis and visualization.',
      'code-generation': '\n\nADK Enhancement: Employ Google ADK for intelligent code generation across multiple languages.'
    };

    return content + (adkInstructions[agentType as keyof typeof adkInstructions] || '');
  }

  private generateSessionId(): string {
    return `adk-session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Factory function for creating ADK Template Orchestrator
 */
export function createADKTemplateOrchestrator(
  templateManager: ITemplateManager,
  agentRegistry: AgentRegistry,
  adkConfig?: { projectId: string; location: string }
): ADKTemplateOrchestrator {
  return new ADKTemplateOrchestrator(templateManager, agentRegistry, adkConfig);
}