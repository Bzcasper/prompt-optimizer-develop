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
    mostActiveAgent: AgentInstance | null;
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
