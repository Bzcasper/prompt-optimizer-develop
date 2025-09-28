import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentRegistry, AgentSchema, AgentHandler, AgentExecutionContext, AgentExecutionResult, AgentCapabilities } from '../../src/services/agent-registry';

// Mock AgentHandler
class MockAgentHandler implements AgentHandler {
  async execute(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    return {
      success: true,
      data: 'mock execution result',
      executionTime: 100,
      cost: 0.01,
      metadata: {
        agentId: context.agentId,
        sessionId: context.sessionId,
        timestamp: Date.now(),
        toolsUsed: [],
      },
    };
  }

  validateTask(task: string, parameters: Record<string, any>): boolean {
    return true;
  }

  getCapabilities(): AgentCapabilities {
    return {};
  }

  async initialize(): Promise<void> {}
  async cleanup(): Promise<void> {}
}

describe('AgentRegistry', () => {
  let registry: AgentRegistry;
  let mockHandler: AgentHandler;

  beforeEach(() => {
    registry = new AgentRegistry();
    mockHandler = new MockAgentHandler();
  });

  describe('registerAgent', () => {
    it('should register a valid agent', async () => {
      const agentDef = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'An agent for testing',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      const agentId = await registry.registerAgent(agentDef, mockHandler);
      expect(agentId).toBe('test-agent');

      const agent = registry.getAgent('test-agent');
      expect(agent).toBeDefined();
      expect(agent?.definition.name).toBe('Test Agent');
    });

    it('should throw an error if an agent with the same ID is already registered', async () => {
      const agentDef = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'An agent for testing',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef, mockHandler);

      await expect(registry.registerAgent(agentDef, mockHandler)).rejects.toThrow(
        "Agent with ID 'test-agent' already exists"
      );
    });

    it('should throw an error if a dependency is not registered', async () => {
      const agentDef = {
        id: 'test-agent-with-dep',
        name: 'Test Agent with Dependency',
        description: 'An agent that depends on another',
        type: 'orchestrator' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
        dependencies: ['non-existent-agent'],
      };

      await expect(registry.registerAgent(agentDef, mockHandler)).rejects.toThrow(
        "Agent dependency 'non-existent-agent' not found"
      );
    });
  });

  describe('getAgent', () => {
    it('should return a registered agent', async () => {
      const agentDef = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'An agent for testing',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef, mockHandler);
      const agent = registry.getAgent('test-agent');
      expect(agent).toBeDefined();
      expect(agent?.id).toBe('test-agent');
    });

    it('should return undefined for a non-existent agent', () => {
      const agent = registry.getAgent('non-existent-agent');
      expect(agent).toBeUndefined();
    });
  });

  describe('listAgents', () => {
    it('should return all registered agents', async () => {
      const agentDef1 = {
        id: 'test-agent-1',
        name: 'Test Agent 1',
        description: 'First agent',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };
      const agentDef2 = {
        id: 'test-agent-2',
        name: 'Test Agent 2',
        description: 'Second agent',
        type: 'specialist' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef1, mockHandler);
      await registry.registerAgent(agentDef2, mockHandler);

      const agents = registry.listAgents();
      expect(agents).toHaveLength(2);
      expect(agents.map(a => a.id)).toContain('test-agent-1');
      expect(agents.map(a => a.id)).toContain('test-agent-2');
    });
  });

  describe('unregisterAgent', () => {
    it('should unregister an agent', async () => {
      const agentDef = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'An agent for testing',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef, mockHandler);
      const unregistered = await registry.unregisterAgent('test-agent');
      expect(unregistered).toBe(true);

      const agent = registry.getAgent('test-agent');
      expect(agent).toBeUndefined();
    });

    it('should return false if agent to unregister does not exist', async () => {
      const unregistered = await registry.unregisterAgent('non-existent-agent');
      expect(unregistered).toBe(false);
    });
  });

  describe('listAgentsByType', () => {
    it('should return agents of a specific type', async () => {
      const agentDef1 = {
        id: 'test-agent-1',
        name: 'Test Agent 1',
        description: 'First agent',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };
      const agentDef2 = {
        id: 'test-agent-2',
        name: 'Test Agent 2',
        description: 'Second agent',
        type: 'specialist' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef1, mockHandler);
      await registry.registerAgent(agentDef2, mockHandler);

      const utilityAgents = registry.listAgentsByType('utility');
      expect(utilityAgents).toHaveLength(1);
      expect(utilityAgents[0].id).toBe('test-agent-1');

      const specialistAgents = registry.listAgentsByType('specialist');
      expect(specialistAgents).toHaveLength(1);
      expect(specialistAgents[0].id).toBe('test-agent-2');
    });
  });

  describe('listAgentsBySpecialization', () => {
    it('should return agents with a specific specialization', async () => {
      const agentDef1 = {
        id: 'test-agent-1',
        name: 'Test Agent 1',
        description: 'First agent',
        type: 'specialist' as const,
        specialization: ['coding'],
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };
      const agentDef2 = {
        id: 'test-agent-2',
        name: 'Test Agent 2',
        description: 'Second agent',
        type: 'specialist' as const,
        specialization: ['writing'],
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef1, mockHandler);
      await registry.registerAgent(agentDef2, mockHandler);

      const codingAgents = registry.listAgentsBySpecialization('coding');
      expect(codingAgents).toHaveLength(1);
      expect(codingAgents[0].id).toBe('test-agent-1');
    });
  });

  describe('searchAgents', () => {
    it('should search agents by name', async () => {
      const agentDef1 = {
        id: 'test-agent-1',
        name: 'Test Agent 1',
        description: 'First agent',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };
      const agentDef2 = {
        id: 'test-agent-2',
        name: 'Another Agent',
        description: 'Second agent',
        type: 'specialist' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef1, mockHandler);
      await registry.registerAgent(agentDef2, mockHandler);

      const searchResults = registry.searchAgents({ name: 'Test' });
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].id).toBe('test-agent-1');
    });

    it('should search agents by multiple criteria', async () => {
      const agentDef1 = {
        id: 'test-agent-1',
        name: 'Test Agent 1',
        description: 'First agent',
        type: 'utility' as const,
        specialization: ['coding'],
        tags: ['backend'],
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };
      const agentDef2 = {
        id: 'test-agent-2',
        name: 'Another Agent',
        description: 'Second agent',
        type: 'specialist' as const,
        specialization: ['writing'],
        tags: ['frontend'],
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef1, mockHandler);
      await registry.registerAgent(agentDef2, mockHandler);

      const searchResults = registry.searchAgents({
        type: 'utility',
        specializations: ['coding'],
        tags: ['backend'],
      });
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].id).toBe('test-agent-1');
    });
  });

  describe('executeAgent', () => {
    it('should execute an agent and update metadata', async () => {
      const agentDef = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'An agent for testing',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef, mockHandler);

      const context: AgentExecutionContext = {
        agentId: 'test-agent',
        task: 'test task',
        parameters: {},
        sessionId: 'test-session',
      };

      const result = await registry.executeAgent(context);
      expect(result.success).toBe(true);
      expect(result.data).toBe('mock execution result');

      const agent = registry.getAgent('test-agent');
      expect(agent?.metadata.totalSessions).toBe(1);
      expect(agent?.metadata.successRate).toBe(1);
    });
  });

  describe('getAgentMemory', () => {
    it('should get agent memory after execution', async () => {
      const agentDef = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'An agent for testing',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef, mockHandler);

      const context: AgentExecutionContext = {
        agentId: 'test-agent',
        task: 'test task',
        parameters: {},
        sessionId: 'test-session',
      };

      await registry.executeAgent(context);

      const memory = registry.getAgentMemory('test-agent');
      expect(memory).toHaveProperty('session_test-session');
    });
  });

  describe('getAgentStatistics', () => {
    it('should return statistics for a registered agent after execution', async () => {
      const agentDef = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'An agent for testing',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef, mockHandler);

      const context: AgentExecutionContext = {
        agentId: 'test-agent',
        task: 'test task',
        parameters: {},
        sessionId: 'test-session',
      };

      await registry.executeAgent(context);

      const stats = registry.getAgentStatistics('test-agent');
      expect(stats).toBeDefined();
      expect(stats?.agentId).toBe('test-agent');
      expect(stats?.totalSessions).toBe(1);
    });
  });

  describe('getRegistryStatistics', () => {
    it('should return statistics for the entire registry', async () => {
      const agentDef1 = {
        id: 'test-agent-1',
        name: 'Test Agent 1',
        description: 'First agent',
        type: 'utility' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };
      const agentDef2 = {
        id: 'test-agent-2',
        name: 'Test Agent 2',
        description: 'Second agent',
        type: 'specialist' as const,
        model: {
          provider: 'test',
          model: 'test-model',
        },
        capabilities: [],
        version: '1.0.0',
      };

      await registry.registerAgent(agentDef1, mockHandler);
      await registry.registerAgent(agentDef2, mockHandler);

      const stats = registry.getRegistryStatistics();
      expect(stats.totalAgents).toBe(2);
      expect(stats.types).toBe(2);
    });
  });
});
