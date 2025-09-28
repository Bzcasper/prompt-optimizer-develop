import { Template } from './template/types';

/**
 * Multi-Agent Orchestrator Service
 * Manages multiple AI agents, coordinates workflows, and handles complex interactions
 */

export class MultiAgentOrchestrator {
  private agents: Map<string, AgentConfiguration> = new Map();
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private activeSessions: Map<string, OrchestrationSession> = new Map();
  private systemStartTime: number;

  constructor() {
    this.systemStartTime = Date.now();
    this.initializeDefaultAgents();
    this.initializeDefaultWorkflows();
  }

  /**
   * Register a new agent with the orchestrator
   */
  registerAgent(config: AgentConfiguration): void {
    try {
      // Validate agent configuration
      if (!config.id || !config.name || !config.type) {
        throw new Error('Agent configuration must include id, name, and type');
      }

      if (this.agents.has(config.id)) {
        console.warn(`⚠️ Agent with ID ${config.id} already exists, overwriting`);
      }

      this.agents.set(config.id, config);
      console.log(`✅ Agent registered successfully: ${config.name} (${config.id})`);
    } catch (error) {
      console.error('❌ Failed to register agent:', error);
      throw error;
    }
  }

  /**
   * Create a new orchestration session
   */
  createSession(sessionConfig: SessionConfiguration): string {
    try {
      const sessionId = this.generateSessionId();
      const session: OrchestrationSession = {
        id: sessionId,
        config: sessionConfig,
        agents: new Map(),
        results: new Map(),
        status: 'initialized',
        createdAt: Date.now(),
        lastActivity: Date.now()
      };

      this.activeSessions.set(sessionId, session);
      console.log(`📝 Session created successfully: ${sessionId}`);
      return sessionId;
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      throw error;
    }
  }

  /**
   * Execute a workflow with multiple agents
   */
  async executeWorkflow(
    sessionId: string,
    workflowId: string,
    initialContext: any
  ): Promise<WorkflowResult> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    session.status = 'running';
    const results: WorkflowResult = {
      sessionId,
      workflowId,
      agentResults: new Map(),
      aggregatedResult: null,
      status: 'running',
      startedAt: Date.now(),
      completedAt: null,
      errors: []
    };

    try {
      console.log(`🚀 Executing workflow: ${workflowId} in session: ${sessionId}`);
      
      // Execute workflow steps
      for (const step of workflow.steps) {
        console.log(`🔄 Executing step: ${step.id} with agent: ${step.agentId}`);
        
        const stepResult = await this.executeWorkflowStep(session, step, initialContext, results);
        results.agentResults.set(step.agentId, stepResult);

        // Update session context
        initialContext = { ...initialContext, [step.id]: stepResult };

        // Check workflow termination conditions
        if (this.shouldTerminateWorkflow(workflow, results)) {
          console.log(`⏹️ Workflow terminated early due to conditions`);
          break;
        }
      }

      // Aggregate results
      results.aggregatedResult = await this.aggregateWorkflowResults(workflow, results);
      results.status = 'completed';
      results.completedAt = Date.now();
      session.status = 'completed';

      console.log(`✅ Workflow completed successfully: ${workflowId}`);

    } catch (error) {
      results.status = 'failed';
      results.errors.push(error instanceof Error ? error.message : String(error));
      results.completedAt = Date.now();
      session.status = 'failed';
      
      console.error(`❌ Workflow execution failed: ${workflowId}`, error);
    }

    return results;
  }

  /**
   * Get session status and progress
   */
  getSessionStatus(sessionId: string): SessionStatus {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    return {
      id: session.id,
      status: session.status,
      progress: this.calculateSessionProgress(session),
      agentCount: session.agents.size,
      lastActivity: session.lastActivity,
      resultsSummary: this.summarizeResults(session.results)
    };
  }

  /**
   * Add agent to existing session
   */
  addAgentToSession(sessionId: string, agentId: string): void {
    const session = this.activeSessions.get(sessionId);
    const agent = this.agents.get(agentId);

    if (!session || !agent) {
      throw new Error('Session or agent not found');
    }

    session.agents.set(agentId, agent);
    session.lastActivity = Date.now();
    
    console.log(`🤖 Added agent ${agentId} to session ${sessionId}`);
  }

  /**
   * Remove agent from session
   */
  removeAgentFromSession(sessionId: string, agentId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.agents.delete(agentId);
      session.lastActivity = Date.now();
      
      console.log(`🗑️ Removed agent ${agentId} from session ${sessionId}`);
    }
  }

  /**
   * List available agents
   */
  listAgents(): AgentConfiguration[] {
    return Array.from(this.agents.values());
  }

  /**
   * List available workflows
   */
  listWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Clean up completed sessions
   */
  cleanupSessions(maxAge: number = 24 * 60 * 60 * 1000): number {
    const cutoffTime = Date.now() - maxAge;
    let cleanedCount = 0;

    for (const [sessionId, session] of this.activeSessions) {
      if (session.lastActivity < cutoffTime &&
          (session.status === 'completed' || session.status === 'failed')) {
        this.activeSessions.delete(sessionId);
        cleanedCount++;
      }
    }

    console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
    return cleanedCount;
  }

  /**
   * Get system statistics
   */
  getSystemStatistics(): SystemStatistics {
    return {
      agents: {
        total: this.agents.size,
        byType: this.getAgentCountByType()
      },
      workflows: {
        total: this.workflows.size,
        byComplexity: this.getWorkflowCountByComplexity()
      },
      sessions: {
        active: this.activeSessions.size,
        byStatus: this.getSessionCountByStatus()
      },
      uptime: Date.now() - this.systemStartTime
    };
  }

  // Private methods

  private initializeDefaultAgents(): void {
    // Primary Orchestrator Agent
    this.registerAgent({
      id: 'primary-orchestrator',
      name: 'Primary Orchestrator',
      type: 'orchestrator',
      model: 'gpt-4-turbo',
      capabilities: ['coordination', 'planning', 'synthesis'],
      maxTokens: 4096,
      temperature: 0.7
    });

    // Code Review Agent
    this.registerAgent({
      id: 'code-reviewer',
      name: 'Code Reviewer',
      type: 'specialist',
      model: 'gpt-4',
      capabilities: ['code-analysis', 'security-review', 'performance-optimization'],
      maxTokens: 8192,
      temperature: 0.3
    });

    // Content Creation Agent
    this.registerAgent({
      id: 'content-creator',
      name: 'Content Creator',
      type: 'specialist',
      model: 'gpt-4-turbo',
      capabilities: ['writing', 'editing', 'content-strategy'],
      maxTokens: 6144,
      temperature: 0.8
    });

    // Research Agent
    this.registerAgent({
      id: 'research-analyst',
      name: 'Research Analyst',
      type: 'specialist',
      model: 'gpt-4',
      capabilities: ['research', 'data-analysis', 'insights'],
      maxTokens: 8192,
      temperature: 0.4
    });

    // Backup Agent
    this.registerAgent({
      id: 'backup-agent',
      name: 'Backup Agent',
      type: 'utility',
      model: 'gpt-3.5-turbo',
      capabilities: ['general-purpose', 'fallback'],
      maxTokens: 4096,
      temperature: 0.7
    });
  }

  private initializeDefaultWorkflows(): void {
    // Code Review Workflow
    this.workflows.set('code-review', {
      id: 'code-review',
      name: 'Code Review Workflow',
      description: 'Comprehensive code review with multiple specialized agents',
      steps: [
        {
          id: 'initial-analysis',
          agentId: 'code-reviewer',
          task: 'Analyze code structure, patterns, and potential issues',
          dependencies: [],
          timeout: 300
        },
        {
          id: 'security-review',
          agentId: 'code-reviewer',
          task: 'Review for security vulnerabilities and best practices',
          dependencies: ['initial-analysis'],
          timeout: 300
        },
        {
          id: 'performance-optimization',
          agentId: 'research-analyst',
          task: 'Identify performance bottlenecks and optimization opportunities',
          dependencies: ['initial-analysis'],
          timeout: 300
        },
        {
          id: 'final-synthesis',
          agentId: 'primary-orchestrator',
          task: 'Synthesize all findings into comprehensive recommendations',
          dependencies: ['security-review', 'performance-optimization'],
          timeout: 180
        }
      ],
      maxDuration: 1800,
      maxConcurrentAgents: 3
    });

    // Content Creation Workflow
    this.workflows.set('content-creation', {
      id: 'content-creation',
      name: 'Content Creation Workflow',
      description: 'End-to-end content creation with research and editing',
      steps: [
        {
          id: 'research',
          agentId: 'research-analyst',
          task: 'Research topic, gather data, and identify key insights',
          dependencies: [],
          timeout: 600
        },
        {
          id: 'outline',
          agentId: 'primary-orchestrator',
          task: 'Create detailed content outline and structure',
          dependencies: ['research'],
          timeout: 300
        },
        {
          id: 'draft',
          agentId: 'content-creator',
          task: 'Write comprehensive first draft',
          dependencies: ['outline'],
          timeout: 900
        },
        {
          id: 'edit',
          agentId: 'content-creator',
          task: 'Edit and polish content for clarity and engagement',
          dependencies: ['draft'],
          timeout: 600
        },
        {
          id: 'final-review',
          agentId: 'primary-orchestrator',
          task: 'Final review and quality assurance',
          dependencies: ['edit'],
          timeout: 300
        }
      ],
      maxDuration: 3600,
      maxConcurrentAgents: 2
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async executeWorkflowStep(
    session: OrchestrationSession,
    step: WorkflowStep,
    context: any,
    results: WorkflowResult
  ): Promise<any> {
    const agent = this.agents.get(step.agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${step.agentId}`);
    }

    // Prepare agent-specific context
    const agentContext = {
      ...context,
      stepId: step.id,
      task: step.task,
      sessionId: session.id,
      previousResults: Object.fromEntries(results.agentResults)
    };

    // Execute agent task (placeholder for actual implementation)
    const result = await this.executeAgentTask(agent, agentContext);

    session.lastActivity = Date.now();
    return result;
  }

  private async executeAgentTask(agent: AgentConfiguration, context: any): Promise<any> {
    // Placeholder for actual agent execution
    // In real implementation, this would call the appropriate AI service
    console.log(`🤖 Executing task with agent ${agent.id}: ${context.task}`);
    
    return {
      agentId: agent.id,
      result: `Executed task for ${agent.name}`,
      timestamp: Date.now(),
      confidence: 0.85
    };
  }

  private shouldTerminateWorkflow(workflow: WorkflowDefinition, results: WorkflowResult): boolean {
    // Check termination conditions
    // This could be based on error count, time limits, or specific result conditions
    return results.errors.length > 3; // Terminate if too many errors
  }

  private async aggregateWorkflowResults(workflow: WorkflowDefinition, results: WorkflowResult): Promise<any> {
    // Aggregate results from all agents
    console.log(`🔄 Aggregating results for workflow: ${workflow.id}`);
    
    return {
      workflowId: workflow.id,
      totalSteps: workflow.steps.length,
      completedSteps: results.agentResults.size,
      aggregatedInsights: 'Comprehensive analysis completed',
      timestamp: Date.now()
    };
  }

  private calculateSessionProgress(session: OrchestrationSession): number {
    // Calculate progress based on completed steps
    // This is a simplified implementation
    if (session.status === 'completed') return 1.0;
    if (session.status === 'failed') return 0.0;
    
    // For running sessions, estimate progress based on results
    return session.results.size > 0 ? Math.min(0.9, session.results.size / 5) : 0.1;
  }

  private summarizeResults(results: Map<string, any>): any {
    return {
      totalResults: results.size,
      completedResults: results.size
    };
  }

  private getAgentCountByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const agent of this.agents.values()) {
      counts[agent.type] = (counts[agent.type] || 0) + 1;
    }
    return counts;
  }

  private getWorkflowCountByComplexity(): Record<string, number> {
    const counts: Record<string, number> = {
      simple: 0,
      medium: 0,
      complex: 0
    };
    
    for (const workflow of this.workflows.values()) {
      if (workflow.steps.length <= 2) {
        counts.simple++;
      } else if (workflow.steps.length <= 4) {
        counts.medium++;
      } else {
        counts.complex++;
      }
    }
    
    return counts;
  }

  private getSessionCountByStatus(): Record<string, number> {
    const counts: Record<string, number> = {
      initialized: 0,
      running: 0,
      completed: 0,
      failed: 0
    };
    
    for (const session of this.activeSessions.values()) {
      counts[session.status]++;
    }
    
    return counts;
  }
}

// Type definitions

export interface AgentConfiguration {
  id: string;
  name: string;
  type: 'orchestrator' | 'specialist' | 'utility';
  model: string;
  capabilities: string[];
  maxTokens: number;
  temperature: number;
  apiKey?: string;
  baseUrl?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  maxDuration: number;
  maxConcurrentAgents: number;
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  task: string;
  dependencies: string[];
  timeout: number;
}

export interface SessionConfiguration {
  name: string;
  description?: string;
  maxDuration?: number;
  agentSelection?: 'manual' | 'automatic';
  resultAggregation?: 'consensus' | 'majority' | 'weighted';
}

export interface OrchestrationSession {
  id: string;
  config: SessionConfiguration;
  agents: Map<string, AgentConfiguration>;
  results: Map<string, any>;
  status: 'initialized' | 'running' | 'completed' | 'failed';
  createdAt: number;
  lastActivity: number;
}

export interface WorkflowResult {
  sessionId: string;
  workflowId: string;
  agentResults: Map<string, any>;
  aggregatedResult: any;
  status: 'running' | 'completed' | 'failed';
  startedAt: number;
  completedAt: number | null;
  errors: string[];
}

export interface SessionStatus {
  id: string;
  status: string;
  progress: number;
  agentCount: number;
  lastActivity: number;
  resultsSummary: any;
}

export interface SystemStatistics {
  agents: {
    total: number;
    byType: Record<string, number>;
  };
  workflows: {
    total: number;
    byComplexity: Record<string, number>;
  };
  sessions: {
    active: number;
    byStatus: Record<string, number>;
  };
  uptime: number;
}

/**
 * Factory function for creating multi-agent orchestrator
 */
export function createMultiAgentOrchestrator(): MultiAgentOrchestrator {
  return new MultiAgentOrchestrator();
}