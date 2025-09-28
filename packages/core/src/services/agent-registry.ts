export interface AgentCapabilities {
  [key: string]: any;
}

export interface AgentExecutionContext {
  agentId: string;
  task: string;
  parameters: Record<string, any>;
  sessionId: string;
}

export interface AgentExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  cost?: number;
  metadata: {
    agentId: string;
    sessionId: string;
    timestamp: number;
    toolsUsed: string[];
  };
}

export interface AgentHandler {
  execute(context: AgentExecutionContext): Promise<AgentExecutionResult>;
  validateTask(task: string, parameters: Record<string, any>): boolean;
  getCapabilities(): AgentCapabilities;
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
}

export interface AgentSchema {
  id: string;
  name: string;
  description: string;
  type: 'utility' | 'specialist' | 'orchestrator';
  specialization?: string[];
  tags?: string[];
  model: {
    provider: string;
    model: string;
  };
  capabilities: string[];
  version: string;
  dependencies?: string[];
}

export interface AgentMetadata {
  totalSessions: number;
  successRate: number;
  averageExecutionTime: number;
  totalCost: number;
  lastUsed?: number;
  createdAt: number;
}

export interface AgentStatistics {
  agentId: string;
  totalSessions: number;
  successfulSessions: number;
  failedSessions: number;
  successRate: number;
  averageExecutionTime: number;
  totalCost: number;
  lastUsed?: number;
  createdAt: number;
}

export interface RegistryStatistics {
  totalAgents: number;
  types: number;
  totalSessions: number;
  averageSuccessRate: number;
  totalCost: number;
}

export interface RegisteredAgent {
  id: string;
  definition: AgentSchema;
  handler: AgentHandler;
  metadata: AgentMetadata;
  memory: Record<string, any>;
}

export interface AgentSearchCriteria {
  name?: string;
  type?: string;
  specializations?: string[];
  tags?: string[];
}

export class AgentRegistry {
  private agents: Map<string, RegisteredAgent> = new Map();

  async registerAgent(definition: AgentSchema, handler: AgentHandler): Promise<string> {
    if (this.agents.has(definition.id)) {
      throw new Error(`Agent with ID '${definition.id}' already exists`);
    }

    // Check dependencies
    if (definition.dependencies) {
      for (const depId of definition.dependencies) {
        if (!this.agents.has(depId)) {
          throw new Error(`Agent dependency '${depId}' not found`);
        }
      }
    }

    await handler.initialize();

    const registeredAgent: RegisteredAgent = {
      id: definition.id,
      definition,
      handler,
      metadata: {
        totalSessions: 0,
        successRate: 0,
        averageExecutionTime: 0,
        totalCost: 0,
        createdAt: Date.now(),
      },
      memory: {},
    };

    this.agents.set(definition.id, registeredAgent);
    return definition.id;
  }

  getAgent(agentId: string): RegisteredAgent | undefined {
    return this.agents.get(agentId);
  }

  listAgents(): RegisteredAgent[] {
    return Array.from(this.agents.values());
  }

  async unregisterAgent(agentId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }

    await agent.handler.cleanup();
    this.agents.delete(agentId);
    return true;
  }

  listAgentsByType(type: string): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter(agent => agent.definition.type === type);
  }

  listAgentsBySpecialization(specialization: string): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter(agent =>
      agent.definition.specialization?.includes(specialization)
    );
  }

  searchAgents(criteria: AgentSearchCriteria): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter(agent => {
      if (criteria.name && !agent.definition.name.toLowerCase().includes(criteria.name.toLowerCase())) {
        return false;
      }
      if (criteria.type && agent.definition.type !== criteria.type) {
        return false;
      }
      if (criteria.specializations && !criteria.specializations.some(spec =>
        agent.definition.specialization?.includes(spec)
      )) {
        return false;
      }
      if (criteria.tags && !criteria.tags.some(tag =>
        agent.definition.tags?.includes(tag)
      )) {
        return false;
      }
      return true;
    });
  }

  async executeAgent(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    const agent = this.agents.get(context.agentId);
    if (!agent) {
      throw new Error(`Agent with ID '${context.agentId}' not found`);
    }

    const startTime = Date.now();
    const result = await agent.handler.execute(context);
    const executionTime = Date.now() - startTime;

    // Update metadata
    agent.metadata.totalSessions++;
    const successfulSessions = agent.metadata.successRate * (agent.metadata.totalSessions - 1) + (result.success ? 1 : 0);
    agent.metadata.successRate = successfulSessions / agent.metadata.totalSessions;

    const totalTime = agent.metadata.averageExecutionTime * (agent.metadata.totalSessions - 1) + executionTime;
    agent.metadata.averageExecutionTime = totalTime / agent.metadata.totalSessions;

    if (result.cost) {
      agent.metadata.totalCost += result.cost;
    }
    agent.metadata.lastUsed = Date.now();

    // Store execution in memory
    agent.memory[`session_${context.sessionId}`] = {
      task: context.task,
      parameters: context.parameters,
      result,
      timestamp: Date.now(),
    };

    return result;
  }

  getAgentMemory(agentId: string): Record<string, any> | undefined {
    const agent = this.agents.get(agentId);
    return agent?.memory;
  }

  getAgentStatistics(agentId: string): AgentStatistics | undefined {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return undefined;
    }

    const successfulSessions = Math.round(agent.metadata.successRate * agent.metadata.totalSessions);
    const failedSessions = agent.metadata.totalSessions - successfulSessions;

    return {
      agentId: agent.id,
      totalSessions: agent.metadata.totalSessions,
      successfulSessions,
      failedSessions,
      successRate: agent.metadata.successRate,
      averageExecutionTime: agent.metadata.averageExecutionTime,
      totalCost: agent.metadata.totalCost,
      lastUsed: agent.metadata.lastUsed,
      createdAt: agent.metadata.createdAt,
    };
  }

  getRegistryStatistics(): RegistryStatistics {
    const agents = Array.from(this.agents.values());
    const totalSessions = agents.reduce((sum, agent) => sum + agent.metadata.totalSessions, 0);
    const averageSuccessRate = agents.length > 0
      ? agents.reduce((sum, agent) => sum + agent.metadata.successRate, 0) / agents.length
      : 0;
    const totalCost = agents.reduce((sum, agent) => sum + agent.metadata.totalCost, 0);
    const uniqueTypes = new Set(agents.map(agent => agent.definition.type));

    return {
      totalAgents: agents.length,
      types: uniqueTypes.size,
      totalSessions,
      averageSuccessRate,
      totalCost,
    };
  }
}