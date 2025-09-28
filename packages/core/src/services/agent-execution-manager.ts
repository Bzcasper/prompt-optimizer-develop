/**
 * Agent Execution Manager
 * 
 * Enhanced agent execution system that handles LLM assignment,
 * model selection, and parameter configuration for agents.
 */

import { AgentRegistry } from './agent/registry';
import { AgentExecutionContext, AgentExecutionResult } from './agent/types';
import { AgentLLMConfigManager, AgentLLMAssignment } from './agent-llm-config';
import { IModelManager, ModelConfig } from './model/types';
import { ILLMService } from './llm/types';
import { AgentExecutor } from './agent-executor';
import { AgentExecutionHistory } from './agent-execution-history';
import { AgentConfigurator } from './agent-configurator';
import { AgentModelSelector } from './agent-model-selector';
import { AgentModelRecommender } from './agent-model-recommender';

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

  private executor: AgentExecutor;
  private history: AgentExecutionHistory;
  private configurator: AgentConfigurator;
  private modelSelector: AgentModelSelector;
  private modelRecommender: AgentModelRecommender;

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

    this.executor = new AgentExecutor(agentRegistry);
    this.history = new AgentExecutionHistory();
    this.configurator = new AgentConfigurator(llmConfigManager);
    this.modelSelector = new AgentModelSelector(llmConfigManager, modelManager);
    this.modelRecommender = new AgentModelRecommender(agentRegistry, modelManager);
  }

  /**
   * Execute an agent with automatic LLM assignment
   */
  async executeAgent(request: AgentExecutionRequest): Promise<AgentExecutionResult> {
    const { agentId, task, parameters, sessionId, userId, options = {} } = request;

    try {
      const agent = this.agentRegistry.getAgent(agentId);
      if (!agent) {
        throw new Error(`Agent '${agentId}' not found`);
      }

      const selectedModelKey = await this.modelSelector.selectBestModel(agentId, options.forceModel);

      const modelConfig = await this.modelManager.getModel(selectedModelKey);
      if (!modelConfig) {
        throw new Error(`Model configuration not found for '${selectedModelKey}'`);
      }

      const llmParams = await this.llmConfigManager.getLLMParamsForAgent(agentId, selectedModelKey);
      if (!llmParams) {
        throw new Error(`No LLM parameters found for agent '${agentId}' and model '${selectedModelKey}'`);
      }

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

      const result = await this.executor.executeWithRetry(context, options.retryCount || 1);
      this.history.storeExecutionHistory(agentId, result);
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
      this.history.storeExecutionHistory(agentId, errorResult);
      return errorResult;
    }
  }

  getExecutionHistory(agentId: string): AgentExecutionResult[] {
    return this.history.getExecutionHistory(agentId);
  }

  async getAgentPerformanceStats(agentId: string) {
    return this.history.getAgentPerformanceStats(agentId);
  }

  async updateAgentLLMAssignment(agentId: string, modelKey: string, config: any) {
    return this.configurator.updateAgentLLMAssignment(agentId, modelKey, config);
  }

  async removeAgentLLMAssignment(agentId: string, modelKey: string) {
    return this.configurator.removeAgentLLMAssignment(agentId, modelKey);
  }

  async getAllAgentLLMConfigs(): Promise<AgentLLMAssignment[]> {
    return this.configurator.getAllAgentLLMConfigs();
  }

  async setAgentFallbackModel(agentId: string, fallbackModel: string) {
    return this.configurator.setAgentFallbackModel(agentId, fallbackModel);
  }

  async testAgentWithModel(
    agentId: string,
    task: string,
    parameters: Record<string, any>,
    modelKey: string
  ): Promise<AgentExecutionResult> {
    const sessionId = `test-${Date.now()}`;
    return this.executeAgent({
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

  async getRecommendedModelsForAgent(agentId: string, taskType: string): Promise<string[]> {
    return this.modelRecommender.getRecommendedModelsForAgent(agentId, taskType);
  }
}