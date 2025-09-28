/**
 * Tool Registration System
 * Registers all built-in tools with the MCP server
 */

import { 
  ToolRegistry, 
  BuiltInTools,
  createToolRegistry 
} from '@prompt-optimizer/core';
import * as logger from '../utils/logging.js';

/**
 * Register all built-in tools with the tool registry
 */
export function registerBuiltInTools(): ToolRegistry {
  logger.info('Registering built-in tools...');
  
  // Create tool registry instance
  const registry = createToolRegistry();
  
  // Register all built-in tools using the factory method
  BuiltInTools.registerAllBuiltInTools(registry);
  
  logger.info(`Successfully registered ${registry.listTools().length} built-in tools`);
  
  return registry;
}

/**
 * Get tool definitions for MCP server
 */
export function getMCPToolDefinitions(registry: ToolRegistry): any[] {
  const tools = registry.listTools();
  
  return tools.map(tool => ({
    name: tool.definition.id,
    description: tool.definition.description,
    inputSchema: {
      type: "object",
      properties: tool.definition.parameters.reduce((acc, param) => {
        acc[param.name] = {
          type: param.type,
          description: param.description,
          ...(param.defaultValue !== undefined && { default: param.defaultValue })
        };
        return acc;
      }, {} as Record<string, any>),
      required: tool.definition.parameters
        .filter(param => param.required)
        .map(param => param.name)
    }
  }));
}

/**
 * Execute a tool using the registry
 */
export async function executeTool(
  registry: ToolRegistry,
  toolId: string,
  parameters: Record<string, any>,
  sessionId: string,
  agentId: string
): Promise<any> {
  const tool = registry.getTool(toolId);
  
  if (!tool) {
    throw new Error(`Tool '${toolId}' not found`);
  }
  
  const context = {
    toolId,
    parameters,
    sessionId,
    agentId
  };
  
  const result = await registry.executeTool(context);
  
  if (!result.success) {
    throw new Error(result.error || 'Tool execution failed');
  }
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(result.data, null, 2)
    }]
  };
}