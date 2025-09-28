import { AgentLLMConfigManager } from './agent-llm-config';
import { IModelManager } from './model/types';

export class AgentModelSelector {
  private llmConfigManager: AgentLLMConfigManager;
  private modelManager: IModelManager;

  constructor(llmConfigManager: AgentLLMConfigManager, modelManager: IModelManager) {
    this.llmConfigManager = llmConfigManager;
    this.modelManager = modelManager;
  }

  /**
   * Get available models
   */
  public async getAvailableModels(): Promise<string[]> {
    const models = await this.modelManager.getEnabledModels();
    return models.map(model => model.key);
  }

  /**
   * Select the best model for the agent
   */
  public async selectBestModel(agentId: string, forceModel?: string): Promise<string> {
    if (forceModel) {
      return forceModel;
    }

    const availableModels = await this.getAvailableModels();
    if (availableModels.length === 0) {
      throw new Error('No available models found');
    }

    const selectedModelKey = await this.llmConfigManager.getBestLLMForAgent(agentId, availableModels);
    if (!selectedModelKey) {
      throw new Error(`No suitable model found for agent '${agentId}'`);
    }

    return selectedModelKey;
  }
}
