/**
 * Agent Registration System
 * Registers all built-in agents with the MCP server
 */

import {
  AgentRegistry,
  BuiltInAgents,
  createAgentRegistry,
  AgentLLMConfigManager,
  AgentExecutionManager,
  createModelManager,
  createLLMService
} from '@prompt-optimizer/core';
import * as logger from '../utils/logging.js';

/**
 * Register all built-in agents with the agent registry
 */
export async function registerBuiltInAgents(
  storageProvider: any,
  modelManager: any,
  llmService: any
): Promise<{
  registry: AgentRegistry;
  llmConfigManager: AgentLLMConfigManager;
  executionManager: AgentExecutionManager;
}> {
  logger.info('Registering built-in agents...');
  
  // Create agent registry instance
  const registry = createAgentRegistry();
  
  // Register all built-in agents using the factory method
  await BuiltInAgents.registerAllBuiltInAgents(registry);
  
  // Create LLM configuration manager
  const llmConfigManager = new AgentLLMConfigManager(storageProvider);
  await llmConfigManager.ensureInitialized();
  
  // Create agent execution manager
  const executionManager = new AgentExecutionManager(
    registry,
    llmConfigManager,
    modelManager,
    llmService
  );
  
  logger.info(`Successfully registered ${registry.listAgents().length} built-in agents with LLM assignment`);
  
  return {
    registry,
    llmConfigManager,
    executionManager
  };
}

/**
 * Get agent definitions for MCP server
 */
export function getMCPAgentDefinitions(registry: AgentRegistry): any[] {
  const agents = registry.listAgents();
  
  return agents.map(agent => ({
    name: agent.definition.id,
    description: agent.definition.description,
    inputSchema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "The task to execute"
        },
        parameters: {
          type: "object",
          description: "Parameters for the task",
          default: {}
        },
        options: {
          type: "object",
          description: "Execution options",
          properties: {
            forceModel: {
              type: "string",
              description: "Force using a specific model"
            },
            timeout: {
              type: "number",
              description: "Custom timeout in milliseconds"
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
              description: "Execution priority"
            },
            retryCount: {
              type: "number",
              description: "Number of retries on failure"
            },
            fallbackToDefault: {
              type: "boolean",
              description: "Use default model if assigned fails"
            }
          }
        }
      },
      required: ["task"]
    }
  }));
}

/**
 * Execute an agent using the execution manager
 */
export async function executeAgent(
  executionManager: AgentExecutionManager,
  agentId: string,
  task: string,
  parameters: Record<string, any>,
  sessionId: string,
  userId?: string,
  options?: any
): Promise<any> {
  const request = {
    agentId,
    task,
    parameters,
    sessionId,
    userId,
    options
  };
  
  const result = await executionManager.executeAgent(request);
  
  if (!result.success) {
    throw new Error(result.error || 'Agent execution failed');
  }
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(result.data, null, 2)
    }],
    metadata: {
      executionTime: result.executionTime,
      cost: result.cost,
      toolsUsed: result.metadata.toolsUsed
    }
  };
}

/**
 * Get agent LLM configuration
 */
export async function getAgentLLMConfig(
  llmConfigManager: AgentLLMConfigManager,
  agentId: string
): Promise<any> {
  const config = await llmConfigManager.getAgentLLMConfig(agentId);
  
  if (!config) {
    throw new Error(`No LLM configuration found for agent '${agentId}'`);
  }
  
  return config;
}

/**
 * Update agent LLM assignment
 */
export async function updateAgentLLMAssignment(
  executionManager: AgentExecutionManager,
  agentId: string,
  modelKey: string,
  config: any
): Promise<void> {
  await executionManager.updateAgentLLMAssignment(agentId, modelKey, config);
}

/**
 * Remove agent LLM assignment
 */
export async function removeAgentLLMAssignment(
  executionManager: AgentExecutionManager,
  agentId: string,
  modelKey: string
): Promise<void> {
  await executionManager.removeAgentLLMAssignment(agentId, modelKey);
}

/**
 * Get all agent LLM configurations
 */
export async function getAllAgentLLMConfigs(
  llmConfigManager: AgentLLMConfigManager
): Promise<any[]> {
  return await llmConfigManager.getAllAgentLLMConfigs();
}

/**
 * Test agent with specific model
 */
export async function testAgentWithModel(
  executionManager: AgentExecutionManager,
  agentId: string,
  task: string,
  parameters: Record<string, any>,
  modelKey: string
): Promise<any> {
  const result = await executionManager.testAgentWithModel(agentId, task, parameters, modelKey);
  
  if (!result.success) {
    throw new Error(result.error || 'Agent test failed');
  }
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(result.data, null, 2)
    }],
    metadata: {
      executionTime: result.executionTime,
      cost: result.cost,
      toolsUsed: result.metadata.toolsUsed
    }
  };
}

/**
 * Get agent performance statistics
 */
export async function getAgentPerformanceStats(
  executionManager: AgentExecutionManager,
  agentId: string
): Promise<any> {
  return await executionManager.getAgentPerformanceStats(agentId);
}