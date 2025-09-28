export class ContentGenerationError extends Error {
  constructor(
    message: string,
    public readonly code: ContentGenerationErrorCode,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'ContentGenerationError';
  }
}

export enum ContentGenerationErrorCode {
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  INVALID_VARIABLES = 'INVALID_VARIABLES',
  LLM_SERVICE_ERROR = 'LLM_SERVICE_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  ITERATION_LIMIT_EXCEEDED = 'ITERATION_LIMIT_EXCEEDED',
  PROCESSING_TIMEOUT = 'PROCESSING_TIMEOUT',
  INVALID_REQUEST = 'INVALID_REQUEST'
}

export class TemplateNotFoundError extends ContentGenerationError {
  constructor(templateId: string) {
    super(
      `Content generation template '${templateId}' not found`,
      ContentGenerationErrorCode.TEMPLATE_NOT_FOUND,
      { templateId }
    );
  }
}

export class InvalidVariablesError extends ContentGenerationError {
  constructor(errors: string[], warnings: string[]) {
    super(
      `Invalid variables provided: ${errors.join(', ')}`,
      ContentGenerationErrorCode.INVALID_VARIABLES,
      { errors, warnings }
    );
  }
}

export class LLMServiceError extends ContentGenerationError {
  constructor(originalError: Error) {
    super(
      `LLM service error: ${originalError.message}`,
      ContentGenerationErrorCode.LLM_SERVICE_ERROR,
      { originalError }
    );
  }
}

export class ValidationFailedError extends ContentGenerationError {
  constructor(validationResult: { errors: string[]; warnings: string[] }) {
    super(
      `Validation failed: ${validationResult.errors.join(', ')}`,
      ContentGenerationErrorCode.VALIDATION_FAILED,
      validationResult
    );
  }
}