import { AgentInstance, AgentDefinition } from './types';

export class AgentIndexer {
  private agents: Map<string, AgentInstance>;
  private types: Map<string, Set<string>> = new Map();
  private specializations: Map<string, Set<string>> = new Map();
  private tags: Map<string, Set<string>> = new Map();

  constructor(agents: Map<string, AgentInstance>) {
    this.agents = agents;
  }

  public updateIndices(definition: AgentDefinition): void {
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

  public removeFromIndices(definition: AgentDefinition): void {
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

  public listAgentsByType(type: string): AgentInstance[] {
    const agentIds = this.types.get(type);
    if (!agentIds) return [];

    return Array.from(agentIds)
      .map(id => this.agents.get(id))
      .filter((agent): agent is AgentInstance => agent !== undefined);
  }

  public listAgentsBySpecialization(specialization: string): AgentInstance[] {
    const agentIds = this.specializations.get(specialization);
    if (!agentIds) return [];

    return Array.from(agentIds)
      .map(id => this.agents.get(id))
      .filter((agent): agent is AgentInstance => agent !== undefined);
  }

  public searchAgents(query: {
    type?: string;
    specializations?: string[];
    capabilities?: string[];
    tags?: string[];
    name?: string;
    status?: string;
  }): AgentInstance[] {
    let results = Array.from(this.agents.values());

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
}
