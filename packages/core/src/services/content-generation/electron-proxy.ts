import {
  IContentGenerationService,
  ContentGenerationRequest,
  ContentGenerationResult,
  ContentTemplateInfo,
  ValidationResult
} from './types';

export class ElectronContentGenerationServiceProxy implements IContentGenerationService {
  constructor(private electronAPI: any) {}

  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
    return this.electronAPI.generateContent(request);
  }

  async generateWithIteration(
    request: ContentGenerationRequest,
    refinementPrompt: string,
    maxIterations?: number
  ): Promise<ContentGenerationResult> {
    return this.electronAPI.generateContentWithIteration(request, refinementPrompt, maxIterations);
  }

  async generateWithInteractiveIteration(
    request: ContentGenerationRequest,
    feedbackProvider: (content: string, iteration: number) => Promise<string>
  ): Promise<ContentGenerationResult> {
    return this.electronAPI.generateContentWithInteractiveIteration(request, feedbackProvider);
  }

  async validateVariables(templateId: string, variables: Record<string, any>): Promise<ValidationResult> {
    return this.electronAPI.validateContentVariables(templateId, variables);
  }

  async getAvailableTemplates(): Promise<ContentTemplateInfo[]> {
    return this.electronAPI.getContentTemplates();
  }
}