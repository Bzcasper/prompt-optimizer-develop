import { AgentRegistry } from './agent/registry';
import { AgentExecutionContext, AgentExecutionResult } from './agent/types';

export class AgentExecutor {
  private agentRegistry: AgentRegistry;

  constructor(agentRegistry: AgentRegistry) {
    this.agentRegistry = agentRegistry;
  }

  /**
   * Execute agent with retry logic
   */
  public async executeWithRetry(
    context: AgentExecutionContext,
    retryCount: number
  ): Promise<AgentExecutionResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        return await this.agentRegistry.executeAgent(context);
      } catch (error) {
        lastError = error as Error;
        console.warn(`[AgentExecutor] Execution attempt ${attempt} failed for agent ${context.agentId}:`, error.message);

        if (attempt < retryCount) {
          // Wait before retry (exponential backoff)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Unknown error occurred during agent execution');
  }
}
