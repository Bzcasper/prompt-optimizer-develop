export interface ContentGenerationRequest {
  templateId: string;
  variables: Record<string, any>;
  modelKey: string;
  options?: ContentGenerationOptions;
}

export interface ContentGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
  iterativeRefinement?: boolean;
  refinementSteps?: number;
}

export interface ContentGenerationResult {
  content: string;
  metadata: {
    templateId: string;
    modelKey: string;
    variables: Record<string, any>;
    generatedAt: Date;
    tokensUsed?: number;
    processingTime: number;
  };
  iterations?: ContentIteration[];
}

export interface ContentIteration {
  step: number;
  content: string;
  feedback?: string;
  timestamp: Date;
}

export interface IContentGenerationService {
  generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult>;
  generateWithIteration(
    request: ContentGenerationRequest,
    refinementPrompt: string,
    maxIterations?: number
  ): Promise<ContentGenerationResult>;
  generateWithInteractiveIteration(
    request: ContentGenerationRequest,
    feedbackProvider: (content: string, iteration: number) => Promise<string>
  ): Promise<ContentGenerationResult>;
  validateVariables(templateId: string, variables: Record<string, any>): Promise<ValidationResult>;
  getAvailableTemplates(): Promise<ContentTemplateInfo[]>;
}

export interface ContentTemplateInfo {
  id: string;
  name: string;
  description: string;
  category: ContentCategory;
  requiredVariables: string[];
  optionalVariables: string[];
  outputFormat: string;
  exampleVariables?: Record<string, any>;
}

export type ContentCategory =
  | 'article'
  | 'marketing'
  | 'technical'
  | 'creative'
  | 'educational'
  | 'business'
  | 'social-media'
  | 'code'
  | 'other';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ContentGenerationHistory {
  id: string;
  request: ContentGenerationRequest;
  result: ContentGenerationResult;
  createdAt: Date;
  updatedAt: Date;
}