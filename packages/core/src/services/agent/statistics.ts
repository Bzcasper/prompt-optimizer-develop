import { AgentInstance, AgentStatistics, AgentRegistryStatistics } from './types';

export class AgentStatisticsCollector {
    public getAgentStatistics(instance: AgentInstance): AgentStatistics | null {
        if (!instance) return null;

        return {
            agentId: instance.id,
            totalSessions: instance.metadata.totalSessions,
            averageSessionTime: instance.metadata.averageSessionTime,
            successRate: instance.metadata.successRate,
            totalCost: instance.metadata.totalCost,
            lastActive: instance.metadata.lastActive,
            currentStatus: instance.metadata.currentStatus,
            registeredAt: instance.metadata.registeredAt
        };
    }

    public getRegistryStatistics(agents: AgentInstance[]): AgentRegistryStatistics {
        const stats = {
            totalAgents: agents.length,
            types: new Set(agents.map(a => a.definition.type)).size,
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

    public updateAgentMetadata(instance: AgentInstance, executionTime: number, cost: number, success: boolean): void {
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
