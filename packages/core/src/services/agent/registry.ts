import { AgentDefinition, AgentHandler, AgentInstance, AgentExecutionContext, AgentExecutionResult, AgentStatistics, AgentRegistryStatistics, AgentSchema } from './types';
import { AgentExecutor } from './executor';
import { AgentIndexer } from './indexer';
import { AgentStateManager } from './state-manager';
import { AgentStatisticsCollector } from './statistics';

export class AgentRegistry {
  private agents: Map<string, AgentInstance> = new Map();
  private executor: AgentExecutor;
  private indexer: AgentIndexer;
  private stateManager: AgentStateManager;
  private statisticsCollector: AgentStatisticsCollector;

  constructor() {
    this.executor = new AgentExecutor(this);
    this.indexer = new AgentIndexer(this.agents);
    this.stateManager = new AgentStateManager();
    this.statisticsCollector = new AgentStatisticsCollector();
  }

  public async registerAgent(definition: AgentDefinition, handler: AgentHandler, tools: string[] = []): Promise<string> {
    const validatedDefinition = AgentSchema.parse(definition);

    if (this.agents.has(validatedDefinition.id)) {
      throw new Error(`Agent with ID '${validatedDefinition.id}' already exists`);
    }

    for (const depId of validatedDefinition.dependencies) {
      if (!this.agents.has(depId)) {
        throw new Error(`Agent dependency '${depId}' not found`);
      }
    }

    await handler.initialize();

    const instance: AgentInstance = {
      id: validatedDefinition.id,
      definition: validatedDefinition,
      handler,
      tools,
      metadata: {
        registeredAt: Date.now(),
        totalSessions: 0,
        averageSessionTime: 0,
        successRate: 1.0,
        totalCost: 0,
        currentStatus: 'idle'
      },
      state: {
        memory: new Map(),
        activeSessions: new Set()
      }
    };

    this.agents.set(validatedDefinition.id, instance);
    this.indexer.updateIndices(validatedDefinition);
    return validatedDefinition.id;
  }

  public async unregisterAgent(agentId: string): Promise<boolean> {
    const instance = this.agents.get(agentId);
    if (!instance) {
      return false;
    }

    if (instance.metadata.currentStatus === 'busy') {
      throw new Error(`Cannot unregister agent '${agentId}' - currently busy`);
    }

    const dependents = this.getDependentAgents(agentId);
    if (dependents.length > 0) {
      throw new Error(`Cannot unregister agent '${agentId}' - it has ${dependents.length} dependent agents`);
    }

    await instance.handler.cleanup();
    this.indexer.removeFromIndices(instance.definition);
    this.agents.delete(agentId);
    return true;
  }

  public getAgent(agentId: string): AgentInstance | undefined {
    return this.agents.get(agentId);
  }

  public listAgents(): AgentInstance[] {
    return Array.from(this.agents.values());
  }

  public listAgentsByType(type: string): AgentInstance[] {
    return this.indexer.listAgentsByType(type);
  }

  public listAgentsBySpecialization(specialization: string): AgentInstance[] {
    return this.indexer.listAgentsBySpecialization(specialization);
  }

  public searchAgents(query: any): AgentInstance[] {
    return this.indexer.searchAgents(query);
  }

  public async executeAgent(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    return this.executor.executeAgent(context);
  }

  public getAgentMemory(agentId: string, key?: string): any {
    const instance = this.getAgent(agentId);
    if (!instance) return null;
    return this.stateManager.getAgentMemory(instance, key);
  }

  public updateAgentMemory(agentId: string, key: string, value: any): void {
    const instance = this.getAgent(agentId);
    if (!instance) return;
    this.stateManager.updateAgentMemory(instance, key, value);
  }

  public updateAgentMetadata(agentId: string, executionTime: number, cost: number, success: boolean): void {
    const instance = this.getAgent(agentId);
    if (!instance) return;
    this.statisticsCollector.updateAgentMetadata(instance, executionTime, cost, success);
  }

  public getAgentStatistics(agentId: string): AgentStatistics | null {
    const instance = this.getAgent(agentId);
    if (!instance) return null;
    return this.statisticsCollector.getAgentStatistics(instance);
  }

  public getRegistryStatistics(): AgentRegistryStatistics {
    const agents = this.listAgents();
    return this.statisticsCollector.getRegistryStatistics(agents);
  }

  private getDependentAgents(agentId: string): string[] {
    const dependents: string[] = [];
    for (const instance of this.agents.values()) {
      if (instance.definition.dependencies.includes(agentId)) {
        dependents.push(instance.id);
      }
    }
    return dependents;
  }
}

export function createAgentRegistry(): AgentRegistry {
  return new AgentRegistry();
}
