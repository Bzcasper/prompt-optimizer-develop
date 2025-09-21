/**
 * Agent Registry System
 * Comprehensive agent registration, specialization, and lifecycle management
 */

import { z } from 'zod';

// Agent Definition Schema
export const AgentCapabilitySchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.any()).optional(),
  cost: z.number().default(0),
  cooldown: z.number().default(0), // milliseconds
  maxUsage: z.number().optional()
});

export const AgentModelSchema = z.object({
  provider: z.string(),
  model: z.string(),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  maxTokens: z.number().default(4096),
  temperature: z.number().default(0.7),
  supportsStreaming: z.boolean().default(false),
  supportsVision: z.boolean().default(false)
});

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['orchestrator', 'specialist', 'utility', 'creative', 'analytical', 'communicator']),
  specialization: z.array(z.string()).default([]),
  model: AgentModelSchema,
  capabilities: z.array(AgentCapabilitySchema),
  version: z.string(),
  cost: z.number().default(0),
  timeout: z.number().default(300000), // 5 minutes default
  maxConcurrency: z.number().default(1),
  memory: z.object({
    type: z.enum(['none', 'session', 'persistent']),
    retention: z.number().default(3600000), // 1 hour default
    maxSize: z.number().default(10000) // tokens
  }).default({ type: 'session', retention: 3600000, maxSize: 10000 }),
  permissions: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['active', 'inactive', 'maintenance', 'deprecated']).default('active')
});

export type AgentCapability = z.infer<typeof AgentCapabilitySchema>;
export type AgentModel = z.infer<typeof AgentModelSchema>;
export type AgentDefinition = z.infer<typeof AgentSchema>;

// Agent Instance and Execution
export interface AgentInstance {
  id: string;
  definition: AgentDefinition;
  handler: AgentHandler;
  tools: string[]; // Tool IDs this agent can use
  metadata: {
    registeredAt: number;
    lastActive?: number;
    totalSessions: number;
    averageSessionTime: number;
    successRate: number;
    totalCost: number;
    currentStatus: 'idle' | 'busy' | 'error';
    lastError?: string;
  };
  state: {
    memory: Map<string, any>;
    activeSessions: Set<string>;
    cooldownUntil?: number;
  };
}

export interface AgentExecutionContext {
  agentId: string;
  task: string;
  parameters: Record<string, any>;
  sessionId: string;
  userId?: string;
  tools?: string[];
  timeout?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface AgentExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  cost: number;
  metadata: {
    agentId: string;
    sessionId: string;
    userId?: string;
    timestamp: number;
    toolsUsed: string[];
    tokensUsed?: number;
  };
}

export interface AgentHandler {
  execute(context: AgentExecutionContext): Promise<AgentExecutionResult>;
  validateTask(task: string, parameters: Record<string, any>): boolean;
  getCapabilities(): AgentCapabilities;
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
}

export interface AgentCapabilities {
  supportsMultiStep?: boolean;
  supportsCollaboration?: boolean;
  supportsToolUse?: boolean;
  maxSteps?: number;
  supportedTaskTypes?: string[];
  requiresSetup?: boolean;
  supportsMemory?: boolean;
}

// Agent Registry Class
export class AgentRegistry {
  private agents: Map<string, AgentInstance> = new Map();
  private types: Map<string, Set<string>> = new Map();
  private specializations: Map<string, Set<string>> = new Map();
  private tags: Map<string, Set<string>> = new Map();

  /**
   * Register a new agent
   */
  async registerAgent(definition: AgentDefinition, handler: AgentHandler, tools: string[] = []): Promise<string> {
    // Validate agent definition
    const validatedDefinition = AgentSchema.parse(definition);

    // Check for duplicate ID
    if (this.agents.has(validatedDefinition.id)) {
      throw new Error(`Agent with ID '${validatedDefinition.id}' already exists`);
    }

    // Validate dependencies (other agents)
    for (const depId of validatedDefinition.dependencies) {
      if (!this.agents.has(depId)) {
        throw new Error(`Agent dependency '${depId}' not found`);
      }
    }

    // Initialize agent handler
    await handler.initialize();

    // Create agent instance
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

    // Register agent
    this.agents.set(validatedDefinition.id, instance);

    // Update indices
    this.updateIndices(validatedDefinition);

    return validatedDefinition.id;
  }

  /**
   * Unregister an agent
   */
  async unregisterAgent(agentId: string): Promise<boolean> {
    const instance = this.agents.get(agentId);
    if (!instance) {
      return false;
    }

    // Check if agent is currently busy
    if (instance.metadata.currentStatus === 'busy') {
      throw new Error(`Cannot unregister agent '${agentId}' - currently busy`);
    }

    // Check for dependent agents
    const dependents = this.getDependentAgents(agentId);
    if (dependents.length > 0) {
      throw new Error(`Cannot unregister agent '${agentId}' - it has ${dependents.length} dependent agents`);
    }

    // Cleanup agent
    await instance.handler.cleanup();

    // Remove from indices
    this.removeFromIndices(instance.definition);

    // Remove agent
    this.agents.delete(agentId);
    return true;
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): AgentInstance | undefined {
    return this.agents.get(agentId);
  }

  /**
   * List all agents
   */
  listAgents(): AgentInstance[] {
    return Array.from(this.agents.values());
  }

  /**
   * List agents by type
   */
  listAgentsByType(type: string): AgentInstance[] {
    const agentIds = this.types.get(type);
    if (!agentIds) return [];

    return Array.from(agentIds)
      .map(id => this.agents.get(id))
      .filter((agent): agent is AgentInstance => agent !== undefined);
  }

  /**
   * List agents by specialization
   */
  listAgentsBySpecialization(specialization: string): AgentInstance[] {
    const agentIds = this.specializations.get(specialization);
    if (!agentIds) return [];

    return Array.from(agentIds)
      .map(id => this.agents.get(id))
      .filter((agent): agent is AgentInstance => agent !== undefined);
  }

  /**
   * Search agents by criteria
   */
  searchAgents(query: {
    type?: string;
    specializations?: string[];
    capabilities?: string[];
    tags?: string[];
    name?: string;
    status?: string;
  }): AgentInstance[] {
    let results = this.listAgents();

    if (query.type) {
      results = results.filter(agent => agent.definition.type === query.type);
    }

    if (query.specializations && query.specializations.length > 0) {
      results = results.filter(agent =>
        query.specializations!.some(spec => agent.definition.specialization.includes(spec))
      );
    }

    if (query.capabilities && query.capabilities.length > 0) {
      results = results.filter(agent => {
        const capabilities = agent.handler.getCapabilities();
        return query.capabilities!.some(cap =>
          capabilities.supportedTaskTypes && capabilities.supportedTaskTypes.includes(cap)
        );
      });
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(agent =>
        query.tags!.some(tag => agent.definition.tags.includes(tag))
      );
    }

    if (query.name) {
      const searchTerm = query.name.toLowerCase();
      results = results.filter(agent =>
        agent.definition.name.toLowerCase().includes(searchTerm) ||
        agent.definition.description.toLowerCase().includes(searchTerm)
      );
    }

    if (query.status) {
      results = results.filter(agent => agent.definition.status === query.status);
    }

    return results;
  }

  /**
   * Execute an agent
   */
  async executeAgent(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    const instance = this.agents.get(context.agentId);
    if (!instance) {
      throw new Error(`Agent '${context.agentId}' not found`);
    }

    // Check if agent is available
    if (instance.metadata.currentStatus !== 'idle') {
      throw new Error(`Agent '${context.agentId}' is currently ${instance.metadata.currentStatus}`);
    }

    // Check cooldown
    if (instance.state.cooldownUntil && Date.now() < instance.state.cooldownUntil) {
      throw new Error(`Agent '${context.agentId}' is in cooldown until ${new Date(instance.state.cooldownUntil)}`);
    }

    // Validate task
    if (!instance.handler.validateTask(context.task, context.parameters)) {
      throw new Error(`Invalid task or parameters for agent '${context.agentId}'`);
    }

    // Check permissions
    await this.checkPermissions(instance, context);

    // Update agent status
    instance.metadata.currentStatus = 'busy';
    instance.state.activeSessions.add(context.sessionId);

    const startTime = Date.now();

    try {
      // Execute agent
      const result = await instance.handler.execute(context);
      const executionTime = Date.now() - startTime;

      // Update memory if supported
      if (instance.definition.memory.type !== 'none') {
        this.updateAgentMemory(instance, context, result);
      }

      // Update metadata
      this.updateAgentMetadata(instance, executionTime, result.cost, true);

      return {
        ...result,
        executionTime,
        metadata: {
          ...result.metadata,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Update metadata
      this.updateAgentMetadata(instance, executionTime, 0, false);
      instance.metadata.lastError = error.message;

      return {
        success: false,
        error: error.message,
        executionTime,
        cost: 0,
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: []
        }
      };
    } finally {
      // Reset agent status
      instance.metadata.currentStatus = 'idle';
      instance.state.activeSessions.delete(context.sessionId);

      // Set cooldown if needed
      const capabilities = instance.handler.getCapabilities();
      if (capabilities.maxSteps) {
        const cooldownMs = instance.definition.capabilities.find(cap => cap.name === 'cooldown')?.cooldown;
        if (cooldownMs) {
          instance.state.cooldownUntil = Date.now() + cooldownMs;
        }
      }
    }
  }

  /**
   * Get agent memory
   */
  getAgentMemory(agentId: string, key?: string): any {
    const instance = this.agents.get(agentId);
    if (!instance) return null;

    if (key) {
      return instance.state.memory.get(key);
    }

    return Object.fromEntries(instance.state.memory);
  }


  /**
   * Get agent statistics
   */
  getAgentStatistics(agentId: string): AgentStatistics | null {
    const instance = this.agents.get(agentId);
    if (!instance) return null;

    return {
      agentId,
      totalSessions: instance.metadata.totalSessions,
      averageSessionTime: instance.metadata.averageSessionTime,
      successRate: instance.metadata.successRate,
      totalCost: instance.metadata.totalCost,
      lastActive: instance.metadata.lastActive,
      currentStatus: instance.metadata.currentStatus,
      registeredAt: instance.metadata.registeredAt
    };
  }

  /**
   * Get registry statistics
   */
  getRegistryStatistics(): AgentRegistryStatistics {
    const agents = this.listAgents();
    const stats = {
      totalAgents: agents.length,
      types: this.types.size,
      totalSessions: agents.reduce((sum, agent) => sum + agent.metadata.totalSessions, 0),
      averageSuccessRate: agents.length > 0
        ? agents.reduce((sum, agent) => sum + agent.metadata.successRate, 0) / agents.length
        : 1.0,
      mostActiveAgent: agents.length > 0 ? agents.reduce((prev, current) =>
        prev.metadata.totalSessions > current.metadata.totalSessions ? prev : current
      ) : null,
      activeAgents: agents.filter(agent => agent.metadata.currentStatus === 'busy').length
    };

    return stats;
  }

  // Private methods

  private updateIndices(definition: AgentDefinition): void {
    // Update type index
    if (!this.types.has(definition.type)) {
      this.types.set(definition.type, new Set());
    }
    this.types.get(definition.type)!.add(definition.id);

    // Update specialization indices
    for (const spec of definition.specialization) {
      if (!this.specializations.has(spec)) {
        this.specializations.set(spec, new Set());
      }
      this.specializations.get(spec)!.add(definition.id);
    }

    // Update tag indices
    for (const tag of definition.tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)!.add(definition.id);
    }
  }

  private removeFromIndices(definition: AgentDefinition): void {
    // Remove from type index
    const typeSet = this.types.get(definition.type);
    if (typeSet) {
      typeSet.delete(definition.id);
      if (typeSet.size === 0) {
        this.types.delete(definition.type);
      }
    }

    // Remove from specialization indices
    for (const spec of definition.specialization) {
      const specSet = this.specializations.get(spec);
      if (specSet) {
        specSet.delete(definition.id);
        if (specSet.size === 0) {
          this.specializations.delete(spec);
        }
      }
    }

    // Remove from tag indices
    for (const tag of definition.tags) {
      const tagSet = this.tags.get(tag);
      if (tagSet) {
        tagSet.delete(definition.id);
        if (tagSet.size === 0) {
          this.tags.delete(tag);
        }
      }
    }
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

  private async checkPermissions(instance: AgentInstance, context: AgentExecutionContext): Promise<void> {
    // Placeholder for permission checking
  }

  private updateAgentMemory(instance: AgentInstance, context: AgentExecutionContext, result: AgentExecutionResult): void {
    if (instance.definition.memory.type === 'none') return;

    // Store execution context and result in memory
    const memoryKey = `session_${context.sessionId}`;
    instance.state.memory.set(memoryKey, {
      task: context.task,
      parameters: context.parameters,
      result: result.data,
      timestamp: Date.now()
    });

    // Clean up old memory
    this.cleanupAgentMemory(instance);
  }

  private cleanupAgentMemory(instance: AgentInstance): void {
    const now = Date.now();
    const retentionMs = instance.definition.memory.retention;

    for (const [key, value] of instance.state.memory) {
      if (value.timestamp && (now - value.timestamp) > retentionMs) {
        instance.state.memory.delete(key);
      }
    }

    // Enforce memory size limit
    if (instance.state.memory.size > instance.definition.memory.maxSize) {
      // Remove oldest entries (simplified - in practice would use LRU)
      const entries = Array.from(instance.state.memory.entries());
      entries.sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));

      const toRemove = entries.slice(0, instance.state.memory.size - instance.definition.memory.maxSize);
      for (const [key] of toRemove) {
        instance.state.memory.delete(key);
      }
    }
  }

  private updateAgentMetadata(instance: AgentInstance, executionTime: number, cost: number, success: boolean): void {
    instance.metadata.lastActive = Date.now();
    instance.metadata.totalSessions++;
    instance.metadata.totalCost += cost;

    // Update average session time
    const totalTime = instance.metadata.averageSessionTime * (instance.metadata.totalSessions - 1) + executionTime;
    instance.metadata.averageSessionTime = totalTime / instance.metadata.totalSessions;

    // Update success rate
    const successCount = Math.round(instance.metadata.successRate * (instance.metadata.totalSessions - 1));
    const newSuccessCount = success ? successCount + 1 : successCount;
    instance.metadata.successRate = newSuccessCount / instance.metadata.totalSessions;
  }
}

// Statistics Interfaces
export interface AgentStatistics {
  agentId: string;
  totalSessions: number;
  averageSessionTime: number;
  successRate: number;
  totalCost: number;
  lastActive?: number;
  currentStatus: string;
  registeredAt: number;
}

export interface AgentRegistryStatistics {
  totalAgents: number;
  types: number;
  totalSessions: number;
  averageSuccessRate: number;
  mostActiveAgent: AgentInstance;
  activeAgents: number;
}

// Built-in Agent Types
export const AGENT_TYPES = {
  ORCHESTRATOR: 'orchestrator',
  SPECIALIST: 'specialist',
  UTILITY: 'utility',
  CREATIVE: 'creative',
  ANALYTICAL: 'analytical',
  COMMUNICATOR: 'communicator'
} as const;

// Common Agent Specializations
export const AGENT_SPECIALIZATIONS = {
  CODE_ANALYSIS: 'code-analysis',
  CONTENT_CREATION: 'content-creation',
  DATA_ANALYSIS: 'data-analysis',
  RESEARCH: 'research',
  BUSINESS_STRATEGY: 'business-strategy',
  COMMUNICATION: 'communication',
  CREATIVE_WRITING: 'creative-writing',
  TECHNICAL_WRITING: 'technical-writing',
  MARKETING: 'marketing',
  PROJECT_MANAGEMENT: 'project-management'
} as const;

// Factory function
export function createAgentRegistry(): AgentRegistry {
  return new AgentRegistry();
}