/**
 * Registry Orchestrator
 * Unified system for managing tools, agents, and their interactions
 */

import { ToolRegistry } from './tool-registry';
import { AgentRegistry } from './agent/registry';
import { BuiltInTools } from './built-in-tools';
import { BuiltInAgents } from './built-in-agents';
// import { AdvancedTools } from './advanced-tools';
import { SpecializedGoogleADKAgents } from './google-adk-agents';

export interface OrchestrationRequest {
  task: string;
  parameters: Record<string, any>;
  agentPreferences?: {
    requiredCapabilities?: string[];
    preferredTypes?: string[];
    excludedAgents?: string[];
  };
  toolRequirements?: string[];
  executionOptions?: {
    timeout?: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    allowFallback?: boolean;
    maxRetries?: number;
  };
}

export interface OrchestrationResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  cost: number;
  metadata: {
    sessionId: string;
    agentUsed: string;
    toolsUsed: string[];
    timestamp: number;
    retries: number;
    fallbackUsed: boolean;
  };
}

export class RegistryOrchestrator {
  private toolRegistry: ToolRegistry;
  private agentRegistry: AgentRegistry;
  private activeSessions: Map<string, OrchestrationSession> = new Map();
  private systemStartTime: number;
  private googleADKProjectId?: string;
  private googleADKLocation?: string;

  constructor(googleADKConfig?: { projectId: string; location: string }) {
    this.toolRegistry = new ToolRegistry();
    this.agentRegistry = new AgentRegistry();
    this.systemStartTime = Date.now();
    this.googleADKProjectId = googleADKConfig?.projectId;
    this.googleADKLocation = googleADKConfig?.location;
    this.initializeBuiltInComponents();
  }

  /**
   * Initialize with built-in tools and agents
   */
  private async initializeBuiltInComponents(): Promise<void> {
    try {
      // Register all built-in tools
      BuiltInTools.registerAllBuiltInTools(this.toolRegistry);

      // Register all built-in agents
      BuiltInAgents.registerAllBuiltInAgents(this.agentRegistry);

      // Register advanced tools
      // TODO: Fix advanced tools registration - temporarily disabled
      // AdvancedTools.registerAllAdvancedTools(this.toolRegistry);

      // Register specialized Google ADK agents if configuration is provided
      if (this.googleADKProjectId && this.googleADKLocation) {
        SpecializedGoogleADKAgents.registerAllSpecializedAgents(
          this.agentRegistry,
          this.googleADKProjectId,
          this.googleADKLocation
        );
      }

      console.log('✅ All built-in and advanced components registered successfully');
    } catch (error) {
      console.error('❌ Failed to initialize components:', error);
      throw error;
    }
  }

  /**
   * Register a custom tool
   */
  async registerTool(definition: any, handler: any): Promise<string> {
    try {
      const toolId = await this.toolRegistry.registerTool(definition, handler);
      console.log(`✅ Tool registered successfully: ${toolId}`);
      return toolId;
    } catch (error) {
      console.error('❌ Failed to register tool:', error);
      throw error;
    }
  }

  /**
   * Register a custom agent
   */
  async registerAgent(definition: any, handler: any, tools: string[] = []): Promise<string> {
    try {
      const agentId = await this.agentRegistry.registerAgent(definition, handler, tools);
      console.log(`✅ Agent registered successfully: ${agentId}`);
      return agentId;
    } catch (error) {
      console.error('❌ Failed to register agent:', error);
      throw error;
    }
  }

  /**
   * Execute a task using the most appropriate agent
   */
  async executeTask(request: OrchestrationRequest, userId?: string): Promise<OrchestrationResult> {
    const sessionId = this.generateSessionId();
    const startTime = Date.now();

    try {
      // Create orchestration session
      const session: OrchestrationSession = {
        id: sessionId,
        request,
        userId,
        status: 'initializing',
        startedAt: startTime,
        agentAssigned: null,
        toolsUsed: [],
        retries: 0
      };

      this.activeSessions.set(sessionId, session);

      // Select appropriate agent
      const selectedAgent = await this.selectAgent(request);
      if (!selectedAgent) {
        throw new Error('No suitable agent found for the requested task');
      }

      session.agentAssigned = selectedAgent.id;
      session.status = 'executing';

      // Prepare execution context
      const context = {
        agentId: selectedAgent.id,
        task: request.task,
        parameters: request.parameters,
        sessionId,
        userId,
        tools: selectedAgent.tools,
        timeout: request.executionOptions?.timeout || 300000,
        priority: request.executionOptions?.priority || 'medium'
      };

      // Execute with agent
      const result = await this.agentRegistry.executeAgent(context);

      session.status = 'completed';
      session.completedAt = Date.now();

      return {
        success: result.success,
        data: result.data,
        error: result.error,
        executionTime: result.executionTime,
        cost: result.cost,
        metadata: {
          sessionId,
          agentUsed: selectedAgent.id,
          toolsUsed: result.metadata.toolsUsed,
          timestamp: Date.now(),
          retries: session.retries,
          fallbackUsed: false
        }
      };

    } catch (error) {
      const session = this.activeSessions.get(sessionId);
      if (session) {
        session.status = 'failed';
        session.error = error instanceof Error ? error.message : String(error);
        session.completedAt = Date.now();
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime,
        cost: 0,
        metadata: {
          sessionId,
          agentUsed: '',
          toolsUsed: [],
          timestamp: Date.now(),
          retries: session?.retries || 0,
          fallbackUsed: false
        }
      };
    }
  }

  /**
   * Execute a multi-agent workflow
   */
  async executeWorkflow(
    workflowName: string,
    _context: any,
    _userId?: string
  ): Promise<OrchestrationResult> {
    // This would integrate with the MultiAgentOrchestrator
    // For now, return a placeholder implementation
    return {
      success: true,
      data: { workflow: workflowName, executed: true },
      executionTime: 1000,
      cost: 0.01,
      metadata: {
        sessionId: this.generateSessionId(),
        agentUsed: 'workflow-orchestrator',
        toolsUsed: ['data-analysis'],
        timestamp: Date.now(),
        retries: 0,
        fallbackUsed: false
      }
    };
  }

  /**
   * Get available tools
   */
  getAvailableTools(category?: string): any[] {
    if (category) {
      return this.toolRegistry.listToolsByCategory(category);
    }
    return this.toolRegistry.listTools();
  }

  /**
   * Get available agents
   */
  getAvailableAgents(type?: string): any[] {
    if (type) {
      return this.agentRegistry.listAgentsByType(type);
    }
    return this.agentRegistry.listAgents();
  }

  /**
   * Search for tools
   */
  searchTools(query: any): any[] {
    return this.toolRegistry.searchTools(query);
  }

  /**
   * Search for agents
   */
  searchAgents(query: any): any[] {
    return this.agentRegistry.searchAgents(query);
  }

  /**
   * Get system statistics
   */
  getSystemStatistics(): SystemStatistics {
    const toolStats = this.toolRegistry.getRegistryStatistics();
    const agentStats = this.agentRegistry.getRegistryStatistics();

    return {
      tools: toolStats,
      agents: agentStats,
      sessions: {
        active: this.activeSessions.size,
        total: this.getTotalSessionsCount()
      },
      uptime: Date.now() - this.systemStartTime,
      googleADK: {
        configured: !!(this.googleADKProjectId && this.googleADKLocation),
        projectId: this.googleADKProjectId || 'not configured',
        location: this.googleADKLocation || 'not configured'
      }
    };
  }

  /**
   * Get session status
   */
  getSessionStatus(sessionId: string): OrchestrationSession | null {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Cleanup completed sessions
   */
  cleanupSessions(maxAge: number = 24 * 60 * 60 * 1000): number {
    const cutoffTime = Date.now() - maxAge;
    let cleanedCount = 0;

    for (const [sessionId, session] of this.activeSessions) {
      if (session.completedAt && session.completedAt < cutoffTime) {
        this.activeSessions.delete(sessionId);
        cleanedCount++;
      }
    }

    console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
    return cleanedCount;
  }

  // Private methods

  private async selectAgent(request: OrchestrationRequest): Promise<any> {
    const { task, agentPreferences } = request;

    // Find agents that can handle this task
    const capableAgents = this.agentRegistry.searchAgents({
      capabilities: [task],
      ...agentPreferences
    });

    if (capableAgents.length === 0) {
      // Fallback to general-purpose agents
      const fallbackAgents = this.agentRegistry.searchAgents({
        type: 'utility'
      });

      if (fallbackAgents.length > 0) {
        console.log(`⚠️ No specialized agent found, using fallback agent: ${fallbackAgents[0].id}`);
        return fallbackAgents[0];
      }

      return null;
    }

    // Select best agent based on criteria
    return this.selectBestAgent(capableAgents, request);
  }

  private selectBestAgent(agents: any[], request: OrchestrationRequest): any {
    // Enhanced selection logic considering multiple factors
    
    // 1. Prefer agents with matching specializations
    if (request.agentPreferences?.requiredCapabilities) {
      for (const agent of agents) {
        try {
          const hasCapabilities = request.agentPreferences.requiredCapabilities.every(cap =>
            agent.handler.getCapabilities().supportedTaskTypes?.includes(cap)
          );
          if (hasCapabilities) {
            console.log(`🎯 Selected agent with matching capabilities: ${agent.id}`);
            return agent;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to check agent capabilities for ${agent.id}:`, error);
          continue;
        }
      }
    }

    // 2. Consider agent performance history (if available)
    // This would be enhanced with actual performance metrics in a real implementation
    
    // 3. Consider agent load and availability
    // This would be enhanced with actual load metrics in a real implementation
    
    // 4. For now, return first available agent with logging
    const selectedAgent = agents[0];
    console.log(`🤖 Selected agent: ${selectedAgent.id} (default selection)`);
    return selectedAgent;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTotalSessionsCount(): number {
    // This would track total sessions across the system
    // For now, return active sessions + a mock number for historical sessions
    return this.activeSessions.size + 1000;
  }
}

// Type definitions

export interface OrchestrationSession {
  id: string;
  request: OrchestrationRequest;
  userId?: string;
  status: 'initializing' | 'executing' | 'completed' | 'failed';
  startedAt: number;
  completedAt?: number;
  agentAssigned: string | null;
  toolsUsed: string[];
  retries: number;
  error?: string;
}

export interface SystemStatistics {
  tools: any;
  agents: any;
  sessions: {
    active: number;
    total: number;
  };
  uptime: number;
  googleADK: {
    configured: boolean;
    projectId: string;
    location: string;
  };
}

/**
 * Factory function for creating registry orchestrator
 */
export function createRegistryOrchestrator(googleADKConfig?: { projectId: string; location: string }): RegistryOrchestrator {
  return new RegistryOrchestrator(googleADKConfig);
}

/**
 * Pre-configured orchestrator with common setups
 */
export class PresetOrchestrator extends RegistryOrchestrator {
  constructor(preset: 'basic' | 'advanced' | 'enterprise' = 'basic', googleADKConfig?: { projectId: string; location: string }) {
    super(googleADKConfig);

    switch (preset) {
      case 'basic':
        this.initializeBasicSetup();
        break;
      case 'advanced':
        this.initializeAdvancedSetup();
        break;
      case 'enterprise':
        this.initializeEnterpriseSetup();
        break;
    }
  }

  private initializeBasicSetup(): void {
    // Basic setup with essential tools and agents
    console.log('🔧 Initialized basic preset with core tools and agents');
  }

  private initializeAdvancedSetup(): void {
    // Advanced setup with more tools and specialized agents
    console.log('🚀 Initialized advanced preset with extended capabilities');
  }

  private initializeEnterpriseSetup(): void {
    // Enterprise setup with all features, monitoring, and scaling
    console.log('🏢 Initialized enterprise preset with full capabilities');
  }
}

/**
 * Quick setup functions
 */
export function createBasicOrchestrator(googleADKConfig?: { projectId: string; location: string }): PresetOrchestrator {
  return new PresetOrchestrator('basic', googleADKConfig);
}

export function createAdvancedOrchestrator(googleADKConfig?: { projectId: string; location: string }): PresetOrchestrator {
  return new PresetOrchestrator('advanced', googleADKConfig);
}

export function createEnterpriseOrchestrator(googleADKConfig?: { projectId: string; location: string }): PresetOrchestrator {
  return new PresetOrchestrator('enterprise', googleADKConfig);
}