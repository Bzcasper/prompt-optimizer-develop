import { AgentExecutionResult } from './agent/types';

export class AgentExecutionHistory {
  private executionHistory: Map<string, AgentExecutionResult[]> = new Map();

  /**
   * Store execution history
   */
  public storeExecutionHistory(agentId: string, result: AgentExecutionResult): void {
    if (!this.executionHistory.has(agentId)) {
      this.executionHistory.set(agentId, []);
    }

    const history = this.executionHistory.get(agentId)!;
    history.push(result);

    // Keep only the last 100 executions
    if (history.length > 100) {
      history.shift();
    }
  }

  /**
   * Get execution history for an agent
   */
  public getExecutionHistory(agentId: string): AgentExecutionResult[] {
    return this.executionHistory.get(agentId) || [];
  }

  /**
   * Get agent performance statistics
   */
  public async getAgentPerformanceStats(agentId: string): Promise<{
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    averageCost: number;
    lastExecution?: AgentExecutionResult;
  }> {
    const history = this.getExecutionHistory(agentId);

    if (history.length === 0) {
      return {
        totalExecutions: 0,
        successRate: 1.0,
        averageExecutionTime: 0,
        averageCost: 0
      };
    }

    const successfulExecutions = history.filter(r => r.success);
    const totalExecutionTime = history.reduce((sum, r) => sum + r.executionTime, 0);
    const totalCost = history.reduce((sum, r) => sum + r.cost, 0);

    return {
      totalExecutions: history.length,
      successRate: successfulExecutions.length / history.length,
      averageExecutionTime: totalExecutionTime / history.length,
      averageCost: totalCost / history.length,
      lastExecution: history[history.length - 1]
    };
  }
}
