import { AgentRegistry } from './registry';
import { AgentExecutionContext, AgentExecutionResult, AgentInstance } from './types';

export class AgentExecutor {
  private agentRegistry: AgentRegistry;

  constructor(agentRegistry: AgentRegistry) {
    this.agentRegistry = agentRegistry;
  }

  public async executeAgent(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    const instance = this.agentRegistry.getAgent(context.agentId);
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
        this.agentRegistry.updateAgentMemory(instance.id, `session_${context.sessionId}`, {
            task: context.task,
            parameters: context.parameters,
            result: result.data,
            timestamp: Date.now()
        });
      }

      // Update metadata
      this.agentRegistry.updateAgentMetadata(instance.id, executionTime, result.cost, true);

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
      this.agentRegistry.updateAgentMetadata(instance.id, executionTime, 0, false);
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

  private async checkPermissions(instance: AgentInstance, context: AgentExecutionContext): Promise<void> {
    // Placeholder for permission checking
  }
}
