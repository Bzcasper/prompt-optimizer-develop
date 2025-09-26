/**
 * ADK Template Orchestrator
 * Integrates Google ADK agents with the template system for advanced AI workflows
 */

import type { Template, ITemplateManager } from './template/types';
import { TemplateProcessor, TemplateContext } from './template/processor';
import { AgentRegistry } from './agent/registry';
import { SpecializedGoogleADKAgents } from './google-adk-agents';
import { GoogleADKIntegration } from './google-adk';
import { RegistryOrchestrator } from './registry-orchestrator';

export interface ADKTemplateExecutionRequest {
  templateId: string;
  agentType: 'content-creation' | 'data-analysis' | 'code-generation';
  context: TemplateContext;
  executionOptions?: {
    timeout?: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    maxRetries?: number;
  };
}

export interface ADKTemplateExecutionResult {
  success: boolean;
  templateResult?: any;
  agentResult?: any;
  combinedResult?: any;
  executionTime: number;
  cost: number;
  metadata: {
    templateId: string;
    agentId: string;
    sessionId: string;
    timestamp: number;
  };
}

export class ADKTemplateOrchestrator {
  private templateManager: ITemplateManager;
  private agentRegistry: AgentRegistry;
  private adkIntegration: GoogleADKIntegration;
  private registryOrchestrator: RegistryOrchestrator;

  constructor(
    templateManager: ITemplateManager,
    agentRegistry: AgentRegistry,
    adkConfig?: { projectId: string; location: string }
  ) {
    this.templateManager = templateManager;
    this.agentRegistry = agentRegistry;
    this.adkIntegration = new GoogleADKIntegration();
    this.registryOrchestrator = new RegistryOrchestrator(adkConfig);

    // Use the services to avoid unused variable warnings
    void this.adkIntegration;
    void this.registryOrchestrator;

    if (adkConfig) {
      // Initialize agents asynchronously - errors are logged in the method
      this.initializeADKAgents(adkConfig.projectId, adkConfig.location);
    }
  }

  private async initializeADKAgents(projectId: string, location: string): Promise<void> {
    try {
      await SpecializedGoogleADKAgents.registerAllSpecializedAgents(
        this.agentRegistry,
        projectId,
        location
      );
      console.log('✅ ADK agents initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize ADK agents:', error);
    }
  }

  async executeADKTemplate(request: ADKTemplateExecutionRequest): Promise<ADKTemplateExecutionResult> {
    const startTime = Date.now();
    const sessionId = this.generateSessionId();

    try {
      const template = await this.templateManager.getTemplate(request.templateId);
      const processedMessages = TemplateProcessor.processTemplate(template, request.context);

      const agentId = await this.selectADKAgent(request.agentType);
      if (!agentId) {
        throw new Error(`No suitable ADK agent found for type: ${request.agentType}`);
      }

      const agentContext = {
        agentId,
        task: this.extractTaskFromTemplate(template, request.context),
        parameters: {
          templateId: request.templateId,
          processedMessages,
          context: request.context,
          agentType: request.agentType
        },
        sessionId,
        timeout: request.executionOptions?.timeout || 300000,
        priority: request.executionOptions?.priority || 'medium'
      };

      const agentResult = await this.agentRegistry.executeAgent(agentContext);
      const combinedResult = await this.combineResults(template, processedMessages, agentResult);

      return {
        success: true,
        templateResult: processedMessages,
        agentResult: agentResult.data,
        combinedResult,
        executionTime: Date.now() - startTime,
        cost: agentResult.cost || 0,
        metadata: {
          templateId: request.templateId,
          agentId,
          sessionId,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      return {
        success: false,
        executionTime: Date.now() - startTime,
        cost: 0,
        metadata: {
          templateId: request.templateId,
          agentId: '',
          sessionId,
          timestamp: Date.now()
        }
      };
    }
  }

  getAvailableADKAgents(): string[] {
    const agents = this.agentRegistry.listAgents();
    return agents
      .filter(agent => agent.definition.tags?.includes('adk'))
      .map(agent => agent.id);
  }

  async getADKTemplates(): Promise<Template[]> {
    const allTemplates = await this.templateManager.listTemplates();
    return allTemplates.filter(template =>
      template.metadata.adkCompatible ||
      template.metadata.tags?.includes('adk') ||
      template.metadata.description?.toLowerCase().includes('adk')
    );
  }

  async getADKTemplatesByAgentType(agentType: 'content-creation' | 'data-analysis' | 'code-generation'): Promise<Template[]> {
    const adkTemplates = await this.getADKTemplates();
    return adkTemplates.filter(template =>
      template.metadata.supportedAgentTypes?.includes(agentType)
    );
  }

  async getADKTemplatesByComplexity(complexity: 'simple' | 'moderate' | 'complex' | 'advanced'): Promise<Template[]> {
    const adkTemplates = await this.getADKTemplates();
    return adkTemplates.filter(template =>
      template.metadata.complexity === complexity
    );
  }

  private async selectADKAgent(agentType: string): Promise<string | null> {
    const agentMapping = {
      'content-creation': 'content-creation-agent',
      'data-analysis': 'data-analysis-agent',
      'code-generation': 'code-generation-agent'
    };

    const agentId = agentMapping[agentType as keyof typeof agentMapping];

    // Verify agent exists and is available
    if (agentId) {
      try {
        const agent = await this.agentRegistry.getAgent(agentId);
        return agent ? agentId : null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private extractTaskFromTemplate(template: Template, _context: TemplateContext): string {
    return template.metadata.description || 'general-task';
  }

  private async combineResults(template: Template, messages: any[], agentResult: any): Promise<any> {
    return {
      template,
      messages,
      agentOutput: agentResult.data,
      combined: true,
      timestamp: Date.now()
    };
  }

  private generateSessionId(): string {
    return `adk-session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export function createADKTemplateOrchestrator(
  templateManager: ITemplateManager,
  agentRegistry: AgentRegistry,
  adkConfig?: { projectId: string; location: string }
): ADKTemplateOrchestrator {
  return new ADKTemplateOrchestrator(templateManager, agentRegistry, adkConfig);
}