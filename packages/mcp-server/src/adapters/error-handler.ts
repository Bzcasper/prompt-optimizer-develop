/**
 * 错误处理适配器
 * 
 * 将 Core 模块的错误转换为 MCP 协议兼容的错误格式
 */

import { McpError } from '@modelcontextprotocol/sdk/types.js';

// 定义 MCP 错误代码
export const MCP_ERROR_CODES = {
  INTERNAL_ERROR: -32000,
  PROMPT_OPTIMIZATION_FAILED: -32001,
  INVALID_PARAMS: -32602,
  METHOD_NOT_FOUND: -32601,
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  MODEL_NOT_CONFIGURED: -32002,
  TEMPLATE_NOT_FOUND: -32003,
  CONTENT_GENERATION_FAILED: -32004,
  RATE_LIMIT_EXCEEDED: -32005,
  NETWORK_ERROR: -32006,
  VALIDATION_ERROR: -32007
} as const;

export class MCPErrorHandler {
  /**
   * 转换 Core 模块错误为 MCP 错误
   */
  static convertCoreError(error: Error): McpError {
    // 优化相关错误
    if (error.name.includes('OptimizationError') || error.name.includes('IterationError') || error.name.includes('TestError')) {
      return new McpError(
        MCP_ERROR_CODES.PROMPT_OPTIMIZATION_FAILED,
        `提示词优化失败: ${error.message}`,
        { originalError: error.name }
      );
    }

    // 模型配置错误
    if (error.message.includes('模型未配置') || error.message.includes('Model') || error.message.includes('API key')) {
      return new McpError(
        MCP_ERROR_CODES.MODEL_NOT_CONFIGURED,
        `模型配置错误: ${error.message}`,
        { originalError: error.name }
      );
    }

    // 模板相关错误
    if (error.message.includes('模板') || error.message.includes('Template') || error.name.includes('TemplateError')) {
      return new McpError(
        MCP_ERROR_CODES.TEMPLATE_NOT_FOUND,
        `模板错误: ${error.message}`,
        { originalError: error.name }
      );
    }

    // 内容生成错误
    if (error.name.includes('ContentGenerationError') || error.message.includes('内容生成')) {
      return new McpError(
        MCP_ERROR_CODES.CONTENT_GENERATION_FAILED,
        `内容生成失败: ${error.message}`,
        { originalError: error.name }
      );
    }

    // 网络错误
    if (error.name.includes('NetworkError') || error.message.includes('网络') || error.code === 'ENOTFOUND') {
      return new McpError(
        MCP_ERROR_CODES.NETWORK_ERROR,
        `网络错误: ${error.message}`,
        { originalError: error.name }
      );
    }

    // 速率限制错误
    if (error.message.includes('rate limit') || error.message.includes('速率限制') || error.status === 429) {
      return new McpError(
        MCP_ERROR_CODES.RATE_LIMIT_EXCEEDED,
        `请求速率限制: ${error.message}`,
        { originalError: error.name }
      );
    }

    // 参数验证错误
    if (error.message.includes('必须是') || error.message.includes('不能为空') || error.message.includes('过长') || error.name.includes('ValidationError')) {
      return new McpError(
        MCP_ERROR_CODES.VALIDATION_ERROR,
        `验证错误: ${error.message}`,
        { originalError: error.name }
      );
    }

    // 默认内部错误
    return new McpError(
      MCP_ERROR_CODES.INTERNAL_ERROR,
      `内部错误: ${error.message}`,
      { originalError: error.name }
    );
  }

  /**
   * 创建参数验证错误
   */
  static createValidationError(message: string): McpError {
    return new McpError(MCP_ERROR_CODES.VALIDATION_ERROR, `参数验证失败: ${message}`);
  }

  /**
   * 创建模型配置错误
   */
  static createModelConfigurationError(message: string): McpError {
    return new McpError(MCP_ERROR_CODES.MODEL_NOT_CONFIGURED, `模型配置错误: ${message}`);
  }

  /**
   * 创建模板错误
   */
  static createTemplateError(message: string): McpError {
    return new McpError(MCP_ERROR_CODES.TEMPLATE_NOT_FOUND, `模板错误: ${message}`);
  }

  /**
   * 创建内容生成错误
   */
  static createContentGenerationError(message: string): McpError {
    return new McpError(MCP_ERROR_CODES.CONTENT_GENERATION_FAILED, `内容生成失败: ${message}`);
  }

  /**
   * 创建网络错误
   */
  static createNetworkError(message: string): McpError {
    return new McpError(MCP_ERROR_CODES.NETWORK_ERROR, `网络错误: ${message}`);
  }

  /**
   * 创建速率限制错误
   */
  static createRateLimitError(message: string): McpError {
    return new McpError(MCP_ERROR_CODES.RATE_LIMIT_EXCEEDED, `请求速率限制: ${message}`);
  }

  /**
   * 创建内部错误
   */
  static createInternalError(message: string): McpError {
    return new McpError(MCP_ERROR_CODES.INTERNAL_ERROR, message);
  }
}