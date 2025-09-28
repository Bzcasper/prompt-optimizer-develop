import { AgentInstance } from './types';

export class AgentStateManager {
    public getAgentMemory(instance: AgentInstance, key?: string): any {
        if (!instance) return null;

        if (key) {
            return instance.state.memory.get(key);
        }

        return Object.fromEntries(instance.state.memory);
    }

    public updateAgentMemory(instance: AgentInstance, key: string, value: any): void {
        if (!instance) return;

        instance.state.memory.set(key, value);

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
}
