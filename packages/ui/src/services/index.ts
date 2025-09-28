/**
 * 服务层统一导出
 */

// 现有服务
export { VariableManager } from './VariableManager'

// 新增的数据处理服务
export { PromptDataConverter } from './PromptDataConverter'
export { SmartVariableExtractor } from './SmartVariableExtractor'
export { DataImportExportManager } from './DataImportExportManager'
export { EnhancedTemplateProcessor } from './EnhancedTemplateProcessor'

// MCP 客户端服务
export { MCPClientService, mcpClient } from './mcp-client'
export type { MCPOptimizeRequest, MCPIterateRequest, MCPContentRequest, MCPResponse } from './mcp-client'