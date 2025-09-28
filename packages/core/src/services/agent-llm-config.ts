/**
 * Agent LLM Configuration Management
 * 
 * This module handles the assignment of LLMs to agents,
 * allowing for flexible configuration of which models
 * are used by which agents.
 */

import { IStorageProvider } from './storage/types';
import { StorageAdapter } from './storage/adapter';
import { CORE_SERVICE_KEYS } from '../constants/storage-keys';

export interface AgentLLMConfig {
  agentId: string;
  modelKey: string;
  priority: number; // Higher number = higher priority
  enabled: boolean;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  // Agent-specific parameters
  agentParams?: Record<string, any>;
}

export interface AgentLLMAssignment {
  agentId: string;
  assignments: AgentLLMConfig[];
  fallbackModel?: string; // Fallback model if primary fails
}

export class AgentLLMConfigManager {
  private readonly storageKey = CORE_SERVICE_KEYS.AGENT_LLM_CONFIGS;
  private readonly storage: IStorageProvider;
  private initPromise: Promise<void>;
  private configs: Map<string, AgentLLMAssignment> = new Map();

  constructor(storageProvider: IStorageProvider) {
    this.storage = new StorageAdapter(storageProvider);
    this.initPromise = this.init().catch(err => {
      console.error('AgentLLMConfigManager initialization failed:', err);
      throw err;
    });
  }

  /**
   * Ensure initialization is complete
   */
  public async ensureInitialized(): Promise<void> {
    await this.initPromise;
  }

  /**
   * Initialize the configuration manager
   */
  private async init(): Promise<void> {
    try {
      console.log('[AgentLLMConfigManager] Initializing...');
      
      // Load existing configurations
      const storedData = await this.storage.getItem(this.storageKey);
      
      if (storedData) {
        try {
          const parsedConfigs = JSON.parse(storedData);
          this.configs = new Map(Object.entries(parsedConfigs));
          console.log(`[AgentLLMConfigManager] Loaded configurations for ${this.configs.size} agents`);
        } catch (error) {
          console.error('[AgentLLMConfigManager] Failed to parse stored configurations:', error);
          await this.initializeDefaultConfigs();
        }
      } else {
        console.log('[AgentLLMConfigManager] No existing configurations found, initializing with defaults');
        await this.initializeDefaultConfigs();
      }
      
      console.log('[AgentLLMConfigManager] Initialization completed');
    } catch (error) {
      console.error('[AgentLLMConfigManager] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize default configurations
   */
  private async initializeDefaultConfigs(): Promise<void> {
    const defaultConfigs: Record<string, AgentLLMAssignment> = {
      'code-reviewer': {
        agentId: 'code-reviewer',
        assignments: [
          {
            agentId: 'code-reviewer',
            modelKey: 'gpt-4',
            priority: 10,
            enabled: true,
            maxTokens: 4000,
            temperature: 0.3,
            agentParams: {
              focusOnSecurity: true,
              focusOnPerformance: true
            }
          }
        ],
        fallbackModel: 'gpt-3.5-turbo'
      },
      'content-creator': {
        agentId: 'content-creator',
        assignments: [
          {
            agentId: 'content-creator',
            modelKey: 'gpt-4',
            priority: 10,
            enabled: true,
            maxTokens: 4000,
            temperature: 0.7,
            agentParams: {
              creativityLevel: 'high',
              style: 'professional'
            }
          }
        ],
        fallbackModel: 'claude-3-sonnet'
      },
      'research-analyst': {
        agentId: 'research-analyst',
        assignments: [
          {
            agentId: 'research-analyst',
            modelKey: 'gpt-4',
            priority: 10,
            enabled: true,
            maxTokens: 4000,
            temperature: 0.5,
            agentParams: {
              depth: 'comprehensive',
              includeSources: true
            }
          }
        ],
        fallbackModel: 'claude-3-sonnet'
      },
      'data-visualization': {
        agentId: 'data-visualization',
        assignments: [
          {
            agentId: 'data-visualization',
            modelKey: 'gpt-4',
            priority: 10,
            enabled: true,
            maxTokens: 4000,
            temperature: 0.3,
            agentParams: {
              visualizationType: 'auto',
              detailLevel: 'medium'
            }
          }
        ],
        fallbackModel: 'gpt-3.5-turbo'
      },
      'ux-ui-designer': {
        agentId: 'ux-ui-designer',
        assignments: [
          {
            agentId: 'ux-ui-designer',
            modelKey: 'gpt-4',
            priority: 10,
            enabled: true,
            maxTokens: 4000,
            temperature: 0.8,
            agentParams: {
              designTrend: 'modern',
              accessibilityFocus: true
            }
          }
        ],
        fallbackModel: 'claude-3-sonnet'
      },
      'project-manager': {
        agentId: 'project-manager',
        assignments: [
          {
            agentId: 'project-manager',
            modelKey: 'gpt-4',
            priority: 10,
            enabled: true,
            maxTokens: 4000,
            temperature: 0.4,
            agentParams: {
              methodology: 'agile',
              riskTolerance: 'medium'
            }
          }
        ],
        fallbackModel: 'gpt-3.5-turbo'
      }
    };

    this.configs = new Map(Object.entries(defaultConfigs));
    await this.saveConfigs();
  }

  /**
   * Save configurations to storage
   */
  private async saveConfigs(): Promise<void> {
    const configsObject = Object.fromEntries(this.configs);
    await this.storage.setItem(this.storageKey, JSON.stringify(configsObject));
  }

  /**
   * Get LLM configuration for an agent
   */
  public async getAgentLLMConfig(agentId: string): Promise<AgentLLMAssignment | undefined> {
    await this.ensureInitialized();
    return this.configs.get(agentId);
  }

  /**
   * Get all agent LLM configurations
   */
  public async getAllAgentLLMConfigs(): Promise<AgentLLMAssignment[]> {
    await this.ensureInitialized();
    return Array.from(this.configs.values());
  }

  /**
   * Set LLM configuration for an agent
   */
  public async setAgentLLMConfig(config: AgentLLMAssignment): Promise<void> {
    await this.ensureInitialized();
    
    // Validate configuration
    if (!config.agentId) {
      throw new Error('Agent ID is required');
    }
    
    if (!config.assignments || config.assignments.length === 0) {
      throw new Error('At least one assignment is required');
    }
    
    // Validate assignments
    for (const assignment of config.assignments) {
      if (!assignment.modelKey) {
        throw new Error('Model key is required for each assignment');
      }
      if (!assignment.agentId) {
        assignment.agentId = config.agentId;
      }
    }
    
    // Sort assignments by priority
    config.assignments.sort((a, b) => b.priority - a.priority);
    
    this.configs.set(config.agentId, config);
    await this.saveConfigs();
    
    console.log(`[AgentLLMConfigManager] Updated configuration for agent ${config.agentId}`);
  }

  /**
   * Add or update an LLM assignment for an agent
   */
  public async updateLLMAssignment(agentId: string, assignment: AgentLLMConfig): Promise<void> {
    await this.ensureInitialized();
    
    let config = this.configs.get(agentId);
    if (!config) {
      config = {
        agentId,
        assignments: []
      };
      this.configs.set(agentId, config);
    }
    
    // Update or add the assignment
    const existingIndex = config.assignments.findIndex(a => a.modelKey === assignment.modelKey);
    if (existingIndex >= 0) {
      config.assignments[existingIndex] = { ...assignment, agentId };
    } else {
      config.assignments.push({ ...assignment, agentId });
    }
    
    // Sort by priority
    config.assignments.sort((a, b) => b.priority - a.priority);
    
    await this.saveConfigs();
    
    console.log(`[AgentLLMConfigManager] Updated LLM assignment for agent ${agentId}: ${assignment.modelKey}`);
  }

  /**
   * Remove an LLM assignment for an agent
   */
  public async removeLLMAssignment(agentId: string, modelKey: string): Promise<void> {
    await this.ensureInitialized();
    
    const config = this.configs.get(agentId);
    if (!config) {
      throw new Error(`No configuration found for agent ${agentId}`);
    }
    
    const initialLength = config.assignments.length;
    config.assignments = config.assignments.filter(a => a.modelKey !== modelKey);
    
    if (config.assignments.length === initialLength) {
      throw new Error(`Assignment for model ${modelKey} not found for agent ${agentId}`);
    }
    
    if (config.assignments.length === 0) {
      this.configs.delete(agentId);
    }
    
    await this.saveConfigs();
    
    console.log(`[AgentLLMConfigManager] Removed LLM assignment for agent ${agentId}: ${modelKey}`);
  }

  /**
   * Get the best LLM for an agent
   */
  public async getBestLLMForAgent(agentId: string, availableModels: string[]): Promise<string | null> {
    await this.ensureInitialized();
    
    const config = this.configs.get(agentId);
    if (!config) {
      console.warn(`[AgentLLMConfigManager] No configuration found for agent ${agentId}`);
      return null;
    }
    
    // Find the first enabled assignment with an available model
    for (const assignment of config.assignments) {
      if (assignment.enabled && availableModels.includes(assignment.modelKey)) {
        console.log(`[AgentLLMConfigManager] Selected model ${assignment.modelKey} for agent ${agentId}`);
        return assignment.modelKey;
      }
    }
    
    // If no primary model is available, try fallback
    if (config.fallbackModel && availableModels.includes(config.fallbackModel)) {
      console.log(`[AgentLLMConfigManager] Using fallback model ${config.fallbackModel} for agent ${agentId}`);
      return config.fallbackModel;
    }
    
    console.warn(`[AgentLLMConfigManager] No suitable model found for agent ${agentId}`);
    return null;
  }

  /**
   * Get LLM parameters for an agent and model
   */
  public async getLLMParamsForAgent(agentId: string, modelKey: string): Promise<Record<string, any> | null> {
    await this.ensureInitialized();
    
    const config = this.configs.get(agentId);
    if (!config) {
      return null;
    }
    
    const assignment = config.assignments.find(a => a.modelKey === modelKey);
    if (!assignment) {
      return null;
    }
    
    const params: Record<string, any> = {};
    
    // Add standard LLM parameters
    if (assignment.maxTokens !== undefined) params.max_tokens = assignment.maxTokens;
    if (assignment.temperature !== undefined) params.temperature = assignment.temperature;
    if (assignment.topP !== undefined) params.top_p = assignment.topP;
    if (assignment.topK !== undefined) params.top_k = assignment.topK;
    if (assignment.stopSequences !== undefined) params.stop = assignment.stopSequences;
    
    // Add agent-specific parameters
    if (assignment.agentParams) {
      params.agent_params = assignment.agentParams;
    }
    
    return params;
  }

  /**
   * Export all configurations
   */
  public async exportData(): Promise<AgentLLMAssignment[]> {
    await this.ensureInitialized();
    return Array.from(this.configs.values());
  }

  /**
   * Import configurations
   */
  public async importData(data: AgentLLMAssignment[]): Promise<void> {
    await this.ensureInitialized();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: expected array of AgentLLMAssignment');
    }
    
    for (const config of data) {
      // Validate configuration
      if (!config.agentId || !config.assignments || config.assignments.length === 0) {
        console.warn(`[AgentLLMConfigManager] Skipping invalid configuration for agent ${config.agentId}`);
        continue;
      }
      
      // Ensure each assignment has the correct agentId
      config.assignments.forEach(assignment => {
        assignment.agentId = config.agentId;
      });
      
      // Sort by priority
      config.assignments.sort((a, b) => b.priority - a.priority);
      
      this.configs.set(config.agentId, config);
    }
    
    await this.saveConfigs();
    console.log(`[AgentLLMConfigManager] Imported ${data.length} agent configurations`);
  }
}