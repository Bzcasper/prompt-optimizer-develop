/**
 * Agent Execution Manager
 * 
 * Enhanced agent execution system that handles LLM assignment,
 * model selection, and parameter configuration for agents.
 */

import { AgentRegistry, AgentExecutionContext, AgentExecutionResult } from './agent-registry';
import { AgentLLMConfigManager, AgentLLMAssignment } from './agent-llm-config';
import { IModelManager, ModelConfig } from './model/types';
import { ILLMService } from './llm/types';
import { createSuccessResponse, createErrorResponse } from '../utils/response';

export interface AgentExecutionOptions {
  forceModel?: string; // Override the assigned model
  timeout?: number; // Custom timeout
  priority?: 'low' | 'medium' | 'high' | 'critical';
  retryCount?: number; // Number of retries on failure
  fallbackToDefault?: boolean; // Use default model if assigned fails
}

export interface AgentExecutionRequest {
  agentId: string;
  task: string;
  parameters: Record<string, any>;
  sessionId: string;
  userId?: string;
  options?: AgentExecutionOptions;
}

export class AgentExecutionManager {
  private agentRegistry: AgentRegistry;
  private llmConfigManager: AgentLLMConfigManager;
  private modelManager: IModelManager;
  private llmService: ILLMService;
  private executionHistory: Map<string, AgentExecutionResult[]> = new Map();

  constructor(
    agentRegistry: AgentRegistry,
    llmConfigManager: AgentLLMConfigManager,
    modelManager: IModelManager,
    llmService: ILLMService
  ) {
    this.agentRegistry = agentRegistry;
    this.llmConfigManager = llmConfigManager;
    this.modelManager = modelManager;
    this.llmService = llmService;
  }

  /**
   * Execute an agent with automatic LLM assignment
   */
  async executeAgent(request: AgentExecutionRequest): Promise<AgentExecutionResult> {
    const { agentId, task, parameters, sessionId, userId, options = {} } = request;

    try {
      // Get agent instance
      const agent = this.agentRegistry.getAgent(agentId);
      if (!agent) {
        throw new Error(`Agent '${agentId}' not found`);
      }

      // Get LLM configuration for the agent
      const llmConfig = await this.llmConfigManager.getAgentLLMConfig(agentId);
      if (!llmConfig) {
        throw new Error(`No LLM configuration found for agent '${agentId}'`);
      }

      // Get available models
      const availableModels = await this.getAvailableModels();
      if (availableModels.length === 0) {
        throw new Error('No available models found');
      }

      // Select the best model for the agent
      let selectedModelKey = options.forceModel;
      if (!selectedModelKey) {
        selectedModelKey = await this.llmConfigManager.getBestLLMForAgent(agentId, availableModels);
      }

      if (!selectedModelKey) {
        throw new Error(`No suitable model found for agent '${agentId}'`);
      }

      // Get model configuration
      const modelConfig = await this.modelManager.getModel(selectedModelKey);
      if (!modelConfig) {
        throw new Error(`Model configuration not found for '${selectedModelKey}'`);
      }

      // Get LLM parameters for the agent and model
      const llmParams = await this.llmConfigManager.getLLMParamsForAgent(agentId, selectedModelKey);
      if (!llmParams) {
        throw new Error(`No LLM parameters found for agent '${agentId}' and model '${selectedModelKey}'`);
      }

      // Prepare execution context with LLM information
      const context: AgentExecutionContext = {
        agentId,
        task,
        parameters: {
          ...parameters,
          _llm: {
            modelKey: selectedModelKey,
            modelConfig,
            llmParams
          }
        },
        sessionId,
        userId,
        timeout: options.timeout || agent.definition.timeout,
        priority: options.priority || 'medium'
      };

      // Execute the agent
      const result = await this.executeWithRetry(context, options.retryCount || 1);

      // Store execution history
      this.storeExecutionHistory(agentId, result);

      return result;
    } catch (error) {
      console.error(`[AgentExecutionManager] Failed to execute agent ${agentId}:`, error);
      
      const errorResult: AgentExecutionResult = {
        success: false,
        error: error.message,
        executionTime: 0,
        cost: 0,
        metadata: {
          agentId,
          sessionId,
          userId,
          timestamp: Date.now(),
          toolsUsed: []
        }
      };

      this.storeExecutionHistory(agentId, errorResult);
      return errorResult;
    }
  }

  /**
   * Execute agent with retry logic
   */
  private async executeWithRetry(
    context: AgentExecutionContext,
    retryCount: number
  ): Promise<AgentExecutionResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        return await this.agentRegistry.executeAgent(context);
      } catch (error) {
        lastError = error as Error;
        console.warn(`[AgentExecutionManager] Execution attempt ${attempt} failed for agent ${context.agentId}:`, error.message);
        
        if (attempt < retryCount) {
          // Wait before retry (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Unknown error occurred during agent execution');
  }

  /**
   * Get available models
   */
  private async getAvailableModels(): Promise<string[]> {
    const models = await this.modelManager.getEnabledModels();
    return models.map(model => model.key);
  }

  /**
   * Store execution history
   */
  private storeExecutionHistory(agentId: string, result: AgentExecutionResult): void {
    if (!this.executionHistory.has(agentId)) {
      this.executionHistory.set(agentId, []);
    }

    const history = this.executionHistory.get(agentId)!;
    history.push(result);

    // Keep only the last 100 executions
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Get execution history for an agent
   */
  getExecutionHistory(agentId: string): AgentExecutionResult[] {
    return this.executionHistory.get(agentId) || [];
  }

  /**
   * Get agent performance statistics
   */
  async getAgentPerformanceStats(agentId: string): Promise<{
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    averageCost: number;
    lastExecution?: AgentExecutionResult;
  }> {
    const history = this.getExecutionHistory(agentId);
    
    if (history.length === 0) {
      return {
        totalExecutions: 0,
        successRate: 1.0,
        averageExecutionTime: 0,
        averageCost: 0
      };
    }

    const successfulExecutions = history.filter(r => r.success);
    const totalExecutionTime = history.reduce((sum, r) => sum + r.executionTime, 0);
    const totalCost = history.reduce((sum, r) => sum + r.cost, 0);

    return {
      totalExecutions: history.length,
      successRate: successfulExecutions.length / history.length,
      averageExecutionTime: totalExecutionTime / history.length,
      averageCost: totalCost / history.length,
      lastExecution: history[history.length - 1]
    };
  }

  /**
   * Update LLM assignment for an agent
   */
  async updateAgentLLMAssignment(
    agentId: string,
    modelKey: string,
    config: {
      priority?: number;
      enabled?: boolean;
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      topK?: number;
      stopSequences?: string[];
      agentParams?: Record<string, any>;
    }
  ): Promise<void> {
    await this.llmConfigManager.updateLLMAssignment(agentId, {
      agentId,
      modelKey,
      priority: config.priority || 1,
      enabled: config.enabled !== false,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      topP: config.topP,
      topK: config.topK,
      stopSequences: config.stopSequences,
      agentParams: config.agentParams
    });
  }

  /**
   * Remove LLM assignment for an agent
   */
  async removeAgentLLMAssignment(agentId: string, modelKey: string): Promise<void> {
    await this.llmConfigManager.removeLLMAssignment(agentId, modelKey);
  }

  /**
   * Get all agent LLM configurations
   */
  async getAllAgentLLMConfigs(): Promise<AgentLLMAssignment[]> {
    return await this.llmConfigManager.getAllAgentLLMConfigs();
  }

  /**
   * Set fallback model for an agent
   */
  async setAgentFallbackModel(agentId: string, fallbackModel: string): Promise<void> {
    const config = await this.llmConfigManager.getAgentLLMConfig(agentId);
    if (!config) {
      throw new Error(`No LLM configuration found for agent '${agentId}'`);
    }

    config.fallbackModel = fallbackModel;
    await this.llmConfigManager.setAgentLLMConfig(config);
  }

  /**
   * Test agent execution with a specific model
   */
  async testAgentWithModel(
    agentId: string,
    task: string,
    parameters: Record<string, any>,
    modelKey: string
  ): Promise<AgentExecutionResult> {
    const sessionId = `test-${Date.now()}`;
    
    return await this.executeAgent({
      agentId,
      task,
      parameters,
      sessionId,
      options: {
        forceModel: modelKey,
        retryCount: 1
      }
    });
  }

  /**
   * Get recommended models for an agent based on task type
   */
  async getRecommendedModelsForAgent(agentId: string, taskType: string): Promise<string[]> {
    const agent = this.agentRegistry.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent '${agentId}' not found`);
    }

    // Get agent capabilities
    const capabilities = agent.handler.getCapabilities();
    
    // Get all available models
    const availableModels = await this.getAvailableModels();
    
    // Filter models based on task type and agent capabilities
    const recommendedModels: string[] = [];
    
    for (const modelKey of availableModels) {
      const modelConfig = await this.modelManager.getModel(modelKey);
      if (!modelConfig) continue;
      
      // Simple recommendation logic based on model capabilities and task type
      let isRecommended = false;
      
      switch (taskType) {
        case 'creative':
        case 'content-generation':
          // Models with higher temperature are better for creative tasks
          isRecommended = (modelConfig.llmParams?.temperature || 0.7) >= 0.7;
          break;
          
        case 'analytical':
        case 'code-review':
        case 'data-analysis':
          // Models with lower temperature are better for analytical tasks
          isRecommended = (modelConfig.llmParams?.temperature || 0.7) <= 0.5;
          break;
          
        case 'conversation':
        case 'chat':
          // Models with balanced temperature are good for conversations
          isRecommended = (modelConfig.llmParams?.temperature || 0.7) >= 0.5 && 
                         (modelConfig.llmParams?.temperature || 0.7) <= 0.8;
          break;
          
        default:
          // Default recommendation based on model capabilities
          isRecommended = true;
      }
      
      if (isRecommended) {
        recommendedModels.push(modelKey);
      }
    }
    
    return recommendedModels;
  }
}