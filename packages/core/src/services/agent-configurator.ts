import { AgentLLMConfigManager, AgentLLMAssignment } from './agent-llm-config';

export class AgentConfigurator {
  private llmConfigManager: AgentLLMConfigManager;

  constructor(llmConfigManager: AgentLLMConfigManager) {
    this.llmConfigManager = llmConfigManager;
  }

  /**
   * Update LLM assignment for an agent
   */
  public async updateAgentLLMAssignment(
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
  public async removeAgentLLMAssignment(agentId: string, modelKey: string): Promise<void> {
    await this.llmConfigManager.removeLLMAssignment(agentId, modelKey);
  }

  /**
   * Get all agent LLM configurations
   */
  public async getAllAgentLLMConfigs(): Promise<AgentLLMAssignment[]> {
    return await this.llmConfigManager.getAllAgentLLMConfigs();
  }

  /**
   * Set fallback model for an agent
   */
  public async setAgentFallbackModel(agentId: string, fallbackModel: string): Promise<void> {
    const config = await this.llmConfigManager.getAgentLLMConfig(agentId);
    if (!config) {
      throw new Error(`No LLM configuration found for agent '${agentId}'`);
    }

    config.fallbackModel = fallbackModel;
    await this.llmConfigManager.setAgentLLMConfig(config);
  }
}
