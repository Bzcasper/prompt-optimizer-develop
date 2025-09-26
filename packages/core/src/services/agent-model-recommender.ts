import { AgentRegistry } from './agent/registry';
import { IModelManager } from './model/types';

export class AgentModelRecommender {
  private agentRegistry: AgentRegistry;
  private modelManager: IModelManager;

  constructor(agentRegistry: AgentRegistry, modelManager: IModelManager) {
    this.agentRegistry = agentRegistry;
    this.modelManager = modelManager;
  }

  /**
   * Get recommended models for an agent based on task type
   */
  public async getRecommendedModelsForAgent(agentId: string, taskType: string): Promise<string[]> {
    const agent = this.agentRegistry.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent '${agentId}' not found`);
    }

    // Get agent capabilities
    const capabilities = agent.handler.getCapabilities();

    // Get all available models
    const models = await this.modelManager.getEnabledModels();
    const availableModels = models.map(model => model.key);

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
