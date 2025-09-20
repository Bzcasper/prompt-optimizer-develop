/**
 * Built-in Tool Implementations
 * Ready-to-use tools for common operations
 */

import {
  ToolDefinition,
  ToolHandler,
  ToolExecutionContext,
  ToolExecutionResult,
  ToolCapabilities,
  TOOL_CATEGORIES
} from './tool-registry';

// File System Tools
export class FileReadTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { filePath, encoding = 'utf8' } = context.parameters;

      // In a real implementation, this would read the actual file
      // For now, return mock data
      const mockContent = `Mock content for file: ${filePath}`;

      return {
        success: true,
        data: {
          content: mockContent,
          encoding,
          size: mockContent.length
        },
        executionTime: 0,
        cost: 0.001,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.filePath === 'string' && parameters.filePath.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: false,
      supportsRetry: true,
      maxConcurrency: 5,
      requiresAuthentication: false,
      supportedFormats: ['text', 'json', 'csv', 'xml']
    };
  }
}

export class FileWriteTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { filePath, content, encoding = 'utf8', overwrite = false } = context.parameters;

      // In a real implementation, this would write to the actual file
      // For now, just simulate the operation

      return {
        success: true,
        data: {
          filePath,
          bytesWritten: content.length,
          encoding,
          overwrite
        },
        executionTime: 0,
        cost: 0.002,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.filePath === 'string' &&
           typeof parameters.content === 'string' &&
           parameters.filePath.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: true,
      supportsCancellation: true,
      supportsRetry: false,
      maxConcurrency: 3,
      requiresAuthentication: false,
      supportedFormats: ['text', 'json', 'csv', 'xml', 'binary']
    };
  }
}

// API Tools
export class HttpRequestTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const {
        url,
        method = 'GET',
        headers = {},
        body,
        timeout = 10000
      } = context.parameters;

      // In a real implementation, this would make an actual HTTP request
      // For now, return mock response
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: { message: 'Mock API response', url, method }
      };

      return {
        success: true,
        data: mockResponse,
        executionTime: 0,
        cost: 0.005,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.url === 'string' &&
           ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(parameters.method || 'GET');
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: true,
      maxConcurrency: 10,
      requiresAuthentication: false,
      supportedFormats: ['json', 'xml', 'text', 'html']
    };
  }
}

// Data Processing Tools
export class DataAnalysisTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { data, operation, parameters = {} } = context.parameters;

      // In a real implementation, this would perform actual data analysis
      // For now, return mock analysis results
      const mockAnalysis = {
        operation,
        inputSize: Array.isArray(data) ? data.length : 1,
        result: `Mock analysis result for ${operation}`,
        statistics: {
          count: 100,
          mean: 50,
          median: 45,
          std: 15
        }
      };

      return {
        success: true,
        data: mockAnalysis,
        executionTime: 0,
        cost: 0.01,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return parameters.data !== undefined &&
           typeof parameters.operation === 'string';
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: true,
      maxConcurrency: 5,
      requiresAuthentication: false,
      supportedFormats: ['json', 'csv', 'xml', 'text']
    };
  }
}

// Communication Tools
export class EmailTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const {
        to,
        subject,
        body,
        from,
        attachments = []
      } = context.parameters;

      // In a real implementation, this would send an actual email
      // For now, simulate the operation
      const mockResult = {
        messageId: `mock_${Date.now()}`,
        to,
        subject,
        sent: true,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.003,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.to === 'string' &&
           typeof parameters.subject === 'string' &&
           typeof parameters.body === 'string';
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: false,
      supportsRetry: true,
      maxConcurrency: 3,
      requiresAuthentication: true,
      supportedFormats: ['text', 'html']
    };
  }
}

// Database Tools
export class DatabaseQueryTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { query, databaseType, connectionString, maxRows } = context.parameters;

      // Mock database query result
      const mockResult = {
        query,
        databaseType,
        rowCount: Math.floor(Math.random() * maxRows),
        columns: ['id', 'name', 'value', 'created_at'],
        executionTime: Math.random() * 1000,
        success: true
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.015,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.query === 'string' &&
           typeof parameters.connectionString === 'string' &&
           parameters.query.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: true,
      maxConcurrency: 3,
      requiresAuthentication: true,
      supportedFormats: ['sql', 'json', 'csv']
    };
  }
}

// Image Processing Tools
export class ImageProcessingTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { imageUrl, operation, parameters } = context.parameters;

      // Mock image processing result
      const mockResult = {
        imageUrl,
        operation,
        processed: true,
        dimensions: { width: 1920, height: 1080 },
        format: 'jpeg',
        size: 245760,
        metadata: {
          processedAt: new Date().toISOString(),
          operations: [operation]
        }
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.025,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.imageUrl === 'string' &&
           typeof parameters.operation === 'string' &&
           parameters.imageUrl.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: false,
      maxConcurrency: 2,
      requiresAuthentication: false,
      supportedFormats: ['jpeg', 'png', 'gif', 'webp', 'svg']
    };
  }
}

// Text Analysis Tools
export class TextAnalysisTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { text, analysisType, language, maxLength } = context.parameters;

      // Mock text analysis result
      const mockResult = {
        textLength: text.length,
        language: language || 'en',
        analysisType,
        results: {
          sentiment: analysisType === 'sentiment' ? { score: 0.75, label: 'positive' } : null,
          entities: analysisType === 'entities' ? [
            { text: 'John Doe', type: 'PERSON', confidence: 0.95 },
            { text: 'New York', type: 'LOCATION', confidence: 0.88 }
          ] : null,
          keywords: analysisType === 'keywords' ? [
            { word: 'artificial', score: 0.85 },
            { word: 'intelligence', score: 0.82 },
            { word: 'technology', score: 0.78 }
          ] : null,
          summary: analysisType === 'summary' ? 'This text discusses artificial intelligence and its applications in technology.' : null
        },
        processingTime: Math.random() * 2000
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.01,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.text === 'string' &&
           typeof parameters.analysisType === 'string' &&
           parameters.text.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: true,
      supportsCancellation: true,
      supportsRetry: true,
      maxConcurrency: 5,
      requiresAuthentication: false,
      supportedFormats: ['text', 'html', 'markdown']
    };
  }
}

// Web Scraping Tools
export class WebScrapingTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { url, selectors, maxItems, respectRobotsTxt } = context.parameters;

      // Mock web scraping result
      const mockResult = {
        url,
        scrapedAt: new Date().toISOString(),
        itemsFound: Math.floor(Math.random() * maxItems),
        selectors: Object.keys(selectors),
        data: [
          {
            title: 'Sample Title 1',
            description: 'Sample description for the first item',
            url: `${url}/item1`,
            extractedAt: new Date().toISOString()
          },
          {
            title: 'Sample Title 2',
            description: 'Sample description for the second item',
            url: `${url}/item2`,
            extractedAt: new Date().toISOString()
          }
        ],
        robotsTxtRespected: respectRobotsTxt,
        responseTime: Math.random() * 5000
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.008,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.url === 'string' &&
           typeof parameters.selectors === 'object' &&
           parameters.url.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: true,
      maxConcurrency: 3,
      requiresAuthentication: false,
      supportedFormats: ['html', 'json', 'xml']
    };
  }
}

// Notification Tools
export class NotificationTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { channel, recipient, message, priority, template } = context.parameters;

      // Mock notification result
      const mockResult = {
        channel,
        recipient,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        priority: priority || 'normal',
        template: template || 'default',
        sentAt: new Date().toISOString(),
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'delivered',
        deliveryTime: Math.random() * 2000
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.005,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.channel === 'string' &&
           typeof parameters.recipient === 'string' &&
           typeof parameters.message === 'string';
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: false,
      supportsRetry: true,
      maxConcurrency: 10,
      requiresAuthentication: true,
      supportedFormats: ['text', 'html', 'markdown']
    };
  }
}

// Utility Tools
export class CodeExecutionTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { code, language, timeout = 5000 } = context.parameters;

      // In a real implementation, this would execute code in a sandbox
      // For now, return mock execution result
      const mockResult = {
        language,
        executed: true,
        output: `Mock execution result for ${language} code`,
        executionTime: Math.random() * 1000,
        success: true
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.02,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.code === 'string' &&
           typeof parameters.language === 'string' &&
           parameters.code.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: false,
      maxConcurrency: 2,
      requiresAuthentication: false,
      supportedFormats: ['javascript', 'python', 'ruby', 'java', 'cpp', 'go']
    };
  }
}

// Video Processing Tools
export class VideoProcessingTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { videoUrl, operation, parameters } = context.parameters;

      // Mock video processing result
      const mockResult = {
        videoUrl,
        operation,
        processed: true,
        duration: 180, // seconds
        format: 'mp4',
        resolution: { width: 1920, height: 1080 },
        frameRate: 30,
        size: 52428800, // 50MB
        metadata: {
          processedAt: new Date().toISOString(),
          operations: [operation],
          codec: 'h264',
          bitrate: '4000k'
        }
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.05,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.videoUrl === 'string' &&
           typeof parameters.operation === 'string' &&
           parameters.videoUrl.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: false,
      maxConcurrency: 1,
      requiresAuthentication: false,
      supportedFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm']
    };
  }
}

// Speech Recognition Tools
export class SpeechRecognitionTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const { audioUrl, language, model, enableTimestamps } = context.parameters;

      // Mock speech recognition result
      const mockResult = {
        audioUrl,
        language: language || 'en',
        model: model || 'whisper-large',
        transcription: 'This is a mock transcription of the audio content. In a real implementation, this would contain the actual transcribed text from the speech recognition model.',
        confidence: 0.95,
        duration: 120, // seconds
        segments: enableTimestamps ? [
          {
            start: 0,
            end: 5.2,
            text: 'This is a mock transcription',
            confidence: 0.96
          },
          {
            start: 5.2,
            end: 10.8,
            text: 'of the audio content.',
            confidence: 0.94
          }
        ] : [],
        processedAt: new Date().toISOString(),
        processingTime: Math.random() * 10000
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.03,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return typeof parameters.audioUrl === 'string' &&
           parameters.audioUrl.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: true,
      supportsCancellation: true,
      supportsRetry: true,
      maxConcurrency: 2,
      requiresAuthentication: false,
      supportedFormats: ['mp3', 'wav', 'flac', 'm4a', 'ogg']
    };
  }
}

// Machine Learning Tools
export class MLModelTrainingTool implements ToolHandler {
  async execute(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    try {
      const {
        trainingData,
        modelType,
        hyperparameters = {},
        validationSplit = 0.2,
        epochs = 10
      } = context.parameters;

      // Mock ML model training result
      const mockResult = {
        modelType,
        trainingCompleted: true,
        trainingMetrics: {
          loss: [0.8, 0.6, 0.45, 0.35, 0.28, 0.23, 0.19, 0.16, 0.14, 0.12],
          accuracy: [0.65, 0.75, 0.82, 0.87, 0.90, 0.92, 0.93, 0.94, 0.95, 0.96],
          validationLoss: [0.85, 0.68, 0.52, 0.42, 0.35, 0.30, 0.26, 0.23, 0.21, 0.20],
          validationAccuracy: [0.62, 0.72, 0.79, 0.84, 0.87, 0.89, 0.91, 0.92, 0.93, 0.94]
        },
        hyperparameters: {
          learningRate: hyperparameters.learningRate || 0.001,
          batchSize: hyperparameters.batchSize || 32,
          optimizer: hyperparameters.optimizer || 'adam',
          dropout: hyperparameters.dropout || 0.2
        },
        modelInfo: {
          totalParameters: 12345678,
          trainableParameters: 12300000,
          modelSize: '47.2MB',
          trainingTime: 3600, // seconds
          epochsCompleted: epochs,
          bestEpoch: 8,
          earlyStopped: false
        },
        modelPath: `/models/${modelType}_${Date.now()}.pkl`,
        trainedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: mockResult,
        executionTime: 0,
        cost: 0.1,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  validateParameters(parameters: Record<string, any>): boolean {
    return parameters.trainingData !== undefined &&
           typeof parameters.modelType === 'string' &&
           parameters.modelType.length > 0;
  }

  getCapabilities(): ToolCapabilities {
    return {
      supportsStreaming: false,
      supportsCancellation: true,
      supportsRetry: false,
      maxConcurrency: 1,
      requiresAuthentication: false,
      supportedFormats: ['json', 'csv', 'parquet', 'npy']
    };
  }
}

// Tool Factory and Registry Helper
export class BuiltInTools {
  static createFileReadTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'file-read',
        name: 'File Reader',
        description: 'Read content from files on the local filesystem',
        category: TOOL_CATEGORIES.FILE,
        version: '1.0.0',
        parameters: [
          {
            name: 'filePath',
            type: 'string',
            description: 'Path to the file to read',
            required: true
          },
          {
            name: 'encoding',
            type: 'string',
            description: 'File encoding (default: utf8)',
            required: false,
            defaultValue: 'utf8'
          }
        ],
        cost: 0.001,
        timeout: 30000,
        tags: ['file', 'read', 'filesystem']
      },
      handler: new FileReadTool()
    };
  }

  static createFileWriteTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'file-write',
        name: 'File Writer',
        description: 'Write content to files on the local filesystem',
        category: TOOL_CATEGORIES.FILE,
        version: '1.0.0',
        parameters: [
          {
            name: 'filePath',
            type: 'string',
            description: 'Path to the file to write',
            required: true
          },
          {
            name: 'content',
            type: 'string',
            description: 'Content to write to the file',
            required: true
          },
          {
            name: 'encoding',
            type: 'string',
            description: 'File encoding (default: utf8)',
            required: false,
            defaultValue: 'utf8'
          },
          {
            name: 'overwrite',
            type: 'boolean',
            description: 'Whether to overwrite existing file (default: false)',
            required: false,
            defaultValue: false
          }
        ],
        cost: 0.002,
        timeout: 30000,
        tags: ['file', 'write', 'filesystem']
      },
      handler: new FileWriteTool()
    };
  }

  static createHttpRequestTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'http-request',
        name: 'HTTP Request',
        description: 'Make HTTP requests to external APIs and services',
        category: TOOL_CATEGORIES.API,
        version: '1.0.0',
        parameters: [
          {
            name: 'url',
            type: 'string',
            description: 'URL to make the request to',
            required: true
          },
          {
            name: 'method',
            type: 'string',
            description: 'HTTP method (GET, POST, PUT, DELETE, PATCH)',
            required: false,
            defaultValue: 'GET'
          },
          {
            name: 'headers',
            type: 'object',
            description: 'HTTP headers as key-value pairs',
            required: false,
            defaultValue: {}
          },
          {
            name: 'body',
            type: 'string',
            description: 'Request body for POST/PUT/PATCH requests',
            required: false
          },
          {
            name: 'timeout',
            type: 'number',
            description: 'Request timeout in milliseconds (default: 10000)',
            required: false,
            defaultValue: 10000
          }
        ],
        cost: 0.005,
        timeout: 30000,
        rateLimit: { requests: 100, period: 60000 }, // 100 requests per minute
        tags: ['api', 'http', 'request', 'network']
      },
      handler: new HttpRequestTool()
    };
  }

  static createDataAnalysisTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'Analyze and process data with statistical methods',
        category: TOOL_CATEGORIES.DATA,
        version: '1.0.0',
        parameters: [
          {
            name: 'data',
            type: 'array',
            description: 'Data to analyze',
            required: true
          },
          {
            name: 'operation',
            type: 'string',
            description: 'Analysis operation to perform',
            required: true
          },
          {
            name: 'parameters',
            type: 'object',
            description: 'Additional parameters for the analysis',
            required: false,
            defaultValue: {}
          }
        ],
        cost: 0.01,
        timeout: 60000,
        tags: ['data', 'analysis', 'statistics', 'processing']
      },
      handler: new DataAnalysisTool()
    };
  }

  static createEmailTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'email-send',
        name: 'Email Sender',
        description: 'Send emails through configured SMTP service',
        category: TOOL_CATEGORIES.COMMUNICATION,
        version: '1.0.0',
        parameters: [
          {
            name: 'to',
            type: 'string',
            description: 'Recipient email address',
            required: true
          },
          {
            name: 'subject',
            type: 'string',
            description: 'Email subject line',
            required: true
          },
          {
            name: 'body',
            type: 'string',
            description: 'Email body content',
            required: true
          },
          {
            name: 'from',
            type: 'string',
            description: 'Sender email address (optional)',
            required: false
          },
          {
            name: 'attachments',
            type: 'array',
            description: 'File attachments as array of file paths',
            required: false,
            defaultValue: []
          }
        ],
        cost: 0.003,
        timeout: 30000,
        permissions: ['email.send'],
        tags: ['communication', 'email', 'smtp', 'notification']
      },
      handler: new EmailTool()
    };
  }

  static createCodeExecutionTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'code-execution',
        name: 'Code Executor',
        description: 'Execute code in multiple programming languages',
        category: TOOL_CATEGORIES.UTILITY,
        version: '1.0.0',
        parameters: [
          {
            name: 'code',
            type: 'string',
            description: 'Code to execute',
            required: true
          },
          {
            name: 'language',
            type: 'string',
            description: 'Programming language',
            required: true
          },
          {
            name: 'timeout',
            type: 'number',
            description: 'Execution timeout in milliseconds (default: 5000)',
            required: false,
            defaultValue: 5000
          }
        ],
        cost: 0.02,
        timeout: 30000,
        tags: ['code', 'execution', 'programming', 'utility']
      },
      handler: new CodeExecutionTool()
    };
  }

  static createDatabaseQueryTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'database-query',
        name: 'Database Query Tool',
        description: 'Execute database queries and retrieve results',
        category: TOOL_CATEGORIES.DATA,
        version: '1.0.0',
        parameters: [
          {
            name: 'query',
            type: 'string',
            description: 'SQL query to execute',
            required: true
          },
          {
            name: 'databaseType',
            type: 'string',
            description: 'Database type (mysql, postgresql, sqlite, mongodb)',
            required: false,
            defaultValue: 'postgresql'
          },
          {
            name: 'connectionString',
            type: 'string',
            description: 'Database connection string',
            required: true
          },
          {
            name: 'maxRows',
            type: 'number',
            description: 'Maximum number of rows to return (default: 1000)',
            required: false,
            defaultValue: 1000
          }
        ],
        cost: 0.015,
        timeout: 60000,
        permissions: ['database.read'],
        tags: ['database', 'query', 'sql', 'data']
      },
      handler: new DatabaseQueryTool()
    };
  }

  static createImageProcessingTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'image-processing',
        name: 'Image Processing Tool',
        description: 'Process and analyze images with computer vision capabilities',
        category: TOOL_CATEGORIES.ANALYSIS,
        version: '1.0.0',
        parameters: [
          {
            name: 'imageUrl',
            type: 'string',
            description: 'URL or path to the image file',
            required: true
          },
          {
            name: 'operation',
            type: 'string',
            description: 'Operation to perform (analyze, resize, convert, detect-objects)',
            required: true
          },
          {
            name: 'parameters',
            type: 'object',
            description: 'Additional parameters for the operation',
            required: false,
            defaultValue: {}
          }
        ],
        cost: 0.025,
        timeout: 90000,
        tags: ['image', 'processing', 'computer-vision', 'analysis']
      },
      handler: new ImageProcessingTool()
    };
  }

  static createTextAnalysisTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'text-analysis',
        name: 'Text Analysis Tool',
        description: 'Analyze text content with NLP capabilities',
        category: TOOL_CATEGORIES.ANALYSIS,
        version: '1.0.0',
        parameters: [
          {
            name: 'text',
            type: 'string',
            description: 'Text content to analyze',
            required: true
          },
          {
            name: 'analysisType',
            type: 'string',
            description: 'Type of analysis (sentiment, entities, keywords, summary)',
            required: true
          },
          {
            name: 'language',
            type: 'string',
            description: 'Language of the text (default: en)',
            required: false,
            defaultValue: 'en'
          },
          {
            name: 'maxLength',
            type: 'number',
            description: 'Maximum text length to process (default: 10000)',
            required: false,
            defaultValue: 10000
          }
        ],
        cost: 0.01,
        timeout: 30000,
        tags: ['text', 'analysis', 'nlp', 'sentiment', 'entities']
      },
      handler: new TextAnalysisTool()
    };
  }

  static createWebScrapingTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'web-scraping',
        name: 'Web Scraping Tool',
        description: 'Extract data from websites with structured scraping',
        category: TOOL_CATEGORIES.DATA,
        version: '1.0.0',
        parameters: [
          {
            name: 'url',
            type: 'string',
            description: 'Website URL to scrape',
            required: true
          },
          {
            name: 'selectors',
            type: 'object',
            description: 'CSS selectors for data extraction',
            required: true
          },
          {
            name: 'maxItems',
            type: 'number',
            description: 'Maximum number of items to extract (default: 100)',
            required: false,
            defaultValue: 100
          },
          {
            name: 'respectRobotsTxt',
            type: 'boolean',
            description: 'Respect robots.txt file (default: true)',
            required: false,
            defaultValue: true
          }
        ],
        cost: 0.008,
        timeout: 45000,
        rateLimit: { requests: 10, period: 60000 }, // 10 requests per minute
        tags: ['web', 'scraping', 'data-extraction', 'automation']
      },
      handler: new WebScrapingTool()
    };
  }

  static createNotificationTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'notification-service',
        name: 'Notification Service',
        description: 'Send notifications via email, SMS, or webhooks',
        category: TOOL_CATEGORIES.COMMUNICATION,
        version: '1.0.0',
        parameters: [
          {
            name: 'channel',
            type: 'string',
            description: 'Notification channel (email, sms, webhook, slack)',
            required: true
          },
          {
            name: 'recipient',
            type: 'string',
            description: 'Recipient identifier (email, phone, webhook URL)',
            required: true
          },
          {
            name: 'message',
            type: 'string',
            description: 'Notification message content',
            required: true
          },
          {
            name: 'priority',
            type: 'string',
            description: 'Message priority (low, normal, high, urgent)',
            required: false,
            defaultValue: 'normal'
          },
          {
            name: 'template',
            type: 'string',
            description: 'Message template to use',
            required: false
          }
        ],
        cost: 0.005,
        timeout: 20000,
        permissions: ['notification.send'],
        tags: ['notification', 'communication', 'alerts', 'messaging']
      },
      handler: new NotificationTool()
    };
  }

  static createVideoProcessingTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'video-processing',
        name: 'Video Processing Tool',
        description: 'Process and analyze videos with computer vision capabilities',
        category: TOOL_CATEGORIES.ANALYSIS,
        version: '1.0.0',
        parameters: [
          {
            name: 'videoUrl',
            type: 'string',
            description: 'URL or path to the video file',
            required: true
          },
          {
            name: 'operation',
            type: 'string',
            description: 'Operation to perform (analyze, transcribe, extract-frames, detect-objects)',
            required: true
          },
          {
            name: 'parameters',
            type: 'object',
            description: 'Additional parameters for the operation',
            required: false,
            defaultValue: {}
          }
        ],
        cost: 0.05,
        timeout: 120000,
        tags: ['video', 'processing', 'computer-vision', 'analysis']
      },
      handler: new VideoProcessingTool()
    };
  }

  static createSpeechRecognitionTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'speech-recognition',
        name: 'Speech Recognition Tool',
        description: 'Convert speech audio to text using advanced speech recognition models',
        category: TOOL_CATEGORIES.ANALYSIS,
        version: '1.0.0',
        parameters: [
          {
            name: 'audioUrl',
            type: 'string',
            description: 'URL or path to the audio file',
            required: true
          },
          {
            name: 'language',
            type: 'string',
            description: 'Language code for the speech (default: en)',
            required: false,
            defaultValue: 'en'
          },
          {
            name: 'model',
            type: 'string',
            description: 'Speech recognition model to use (default: whisper-large)',
            required: false,
            defaultValue: 'whisper-large'
          },
          {
            name: 'enableTimestamps',
            type: 'boolean',
            description: 'Include timestamps in the transcription (default: false)',
            required: false,
            defaultValue: false
          }
        ],
        cost: 0.03,
        timeout: 60000,
        tags: ['speech', 'recognition', 'transcription', 'audio', 'nlp']
      },
      handler: new SpeechRecognitionTool()
    };
  }

  static createMLModelTrainingTool(): { definition: ToolDefinition; handler: ToolHandler } {
    return {
      definition: {
        id: 'ml-model-training',
        name: 'Machine Learning Model Training Tool',
        description: 'Train custom machine learning models with various algorithms and hyperparameters',
        category: TOOL_CATEGORIES.COMPUTATION,
        version: '1.0.0',
        parameters: [
          {
            name: 'trainingData',
            type: 'array',
            description: 'Training data as array of samples',
            required: true
          },
          {
            name: 'modelType',
            type: 'string',
            description: 'Type of model to train (neural-network, random-forest, svm, logistic-regression)',
            required: true
          },
          {
            name: 'hyperparameters',
            type: 'object',
            description: 'Model hyperparameters (learning rate, batch size, etc.)',
            required: false,
            defaultValue: {}
          },
          {
            name: 'validationSplit',
            type: 'number',
            description: 'Fraction of data to use for validation (default: 0.2)',
            required: false,
            defaultValue: 0.2
          },
          {
            name: 'epochs',
            type: 'number',
            description: 'Number of training epochs (default: 10)',
            required: false,
            defaultValue: 10
          }
        ],
        cost: 0.1,
        timeout: 3600000, // 1 hour
        tags: ['machine-learning', 'training', 'model', 'ai', 'computation']
      },
      handler: new MLModelTrainingTool()
    };
  }

  /**
   * Register all built-in tools with a tool registry
   */
  static registerAllBuiltInTools(registry: any): void {
    const tools = [
      this.createFileReadTool(),
      this.createFileWriteTool(),
      this.createHttpRequestTool(),
      this.createDataAnalysisTool(),
      this.createEmailTool(),
      this.createCodeExecutionTool(),
      this.createDatabaseQueryTool(),
      this.createImageProcessingTool(),
      this.createTextAnalysisTool(),
      this.createWebScrapingTool(),
      this.createNotificationTool(),
      this.createVideoProcessingTool(),
      this.createSpeechRecognitionTool(),
      this.createMLModelTrainingTool()
    ];

    for (const tool of tools) {
      registry.registerTool(tool.definition, tool.handler);
    }
  }
}