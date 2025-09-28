/**
 * Demo Script: Tool and Agent Registry Usage
 * Comprehensive demonstration of the registry orchestration system
 */

import { createRegistryOrchestrator, createBasicOrchestrator } from './registry-orchestrator';
import { ToolRegistry } from './tool-registry';
import { AgentRegistry } from './agent/registry';
import { BuiltInTools } from './built-in-tools';
import { BuiltInAgents } from './built-in-agents';

/**
 * Main demo function showcasing all registry capabilities
 */
async function runRegistryDemo(): Promise<void> {
  console.log('🚀 Starting Tool and Agent Registry Demo\n');

  // Initialize orchestrator
  const orchestrator = createBasicOrchestrator();
  console.log('✅ Registry Orchestrator initialized');

  // Demo 1: List available tools and agents
  await demoSystemInventory(orchestrator);

  // Demo 2: Execute simple tasks
  await demoTaskExecution(orchestrator);

  // Demo 3: Search and filter capabilities
  await demoSearchCapabilities(orchestrator);

  // Demo 4: Multi-agent workflow
  await demoWorkflowExecution(orchestrator);

  // Demo 5: System statistics and monitoring
  await demoSystemMonitoring(orchestrator);

  // Demo 6: Custom tool registration
  await demoCustomToolRegistration(orchestrator);

  // Demo 7: Custom agent registration
  await demoCustomAgentRegistration(orchestrator);

  // Demo 8: Error handling and fallback
  await demoErrorHandling(orchestrator);

  console.log('\n🎉 Demo completed successfully!');
}

/**
 * Demo: System inventory and discovery
 */
async function demoSystemInventory(orchestrator: any): Promise<void> {
  console.log('\n📋 Demo 1: System Inventory');

  // List all tools
  const allTools = orchestrator.getAvailableTools();
  console.log(`📚 Available Tools: ${allTools.length}`);
  allTools.forEach(tool => {
    console.log(`  • ${tool.definition.name} (${tool.definition.category})`);
  });

  // List all agents
  const allAgents = orchestrator.getAvailableAgents();
  console.log(`🤖 Available Agents: ${allAgents.length}`);
  allAgents.forEach(agent => {
    console.log(`  • ${agent.definition.name} (${agent.definition.type})`);
  });

  // List tools by category
  const fileTools = orchestrator.getAvailableTools('file');
  console.log(`📁 File Tools: ${fileTools.length}`);

  const apiTools = orchestrator.getAvailableTools('api');
  console.log(`🌐 API Tools: ${apiTools.length}`);
}

/**
 * Demo: Task execution with different agents
 */
async function demoTaskExecution(orchestrator: any): Promise<void> {
  console.log('\n⚡ Demo 2: Task Execution');

  // Execute code review task
  console.log('🔍 Executing code review task...');
  const codeReviewResult = await orchestrator.executeTask({
    task: 'code-review',
    parameters: {
      code: 'function calculateSum(a, b) { return a + b; }',
      language: 'javascript'
    }
  });

  if (codeReviewResult.success) {
    console.log('✅ Code review completed');
    console.log(`   Execution time: ${codeReviewResult.executionTime}ms`);
    console.log(`   Cost: $${codeReviewResult.cost}`);
  } else {
    console.log('❌ Code review failed:', codeReviewResult.error);
  }

  // Execute content creation task
  console.log('\n✍️ Executing content creation task...');
  const contentResult = await orchestrator.executeTask({
    task: 'article-writing',
    parameters: {
      topic: 'Artificial Intelligence',
      audience: 'developers',
      wordCount: 1500,
      tone: 'professional'
    }
  });

  if (contentResult.success) {
    console.log('✅ Content creation completed');
    console.log(`   Generated ${contentResult.data?.wordCount || 0} words`);
  } else {
    console.log('❌ Content creation failed:', contentResult.error);
  }

  // Execute research task
  console.log('\n🔬 Executing research task...');
  const researchResult = await orchestrator.executeTask({
    task: 'market-research',
    parameters: {
      topic: 'AI in Healthcare',
      industry: 'healthcare',
      geography: 'global'
    }
  });

  if (researchResult.success) {
    console.log('✅ Research completed');
    console.log(`   Market size: ${researchResult.data?.marketSize?.current || 'N/A'}`);
  } else {
    console.log('❌ Research failed:', researchResult.error);
  }
}

/**
 * Demo: Search and filtering capabilities
 */
async function demoSearchCapabilities(orchestrator: any): Promise<void> {
  console.log('\n🔍 Demo 3: Search and Filtering');

  // Search for analysis tools
  console.log('Searching for analysis tools...');
  const analysisTools = orchestrator.searchTools({
    category: 'data',
    tags: ['analysis']
  });
  console.log(`Found ${analysisTools.length} analysis tools`);

  // Search for creative agents
  console.log('Searching for creative agents...');
  const creativeAgents = orchestrator.searchAgents({
    type: 'creative',
    specializations: ['content-creation']
  });
  console.log(`Found ${creativeAgents.length} creative agents`);

  // Search tools by capability
  console.log('Searching for tools with streaming support...');
  const streamingTools = orchestrator.searchTools({
    capability: 'streaming'
  });
  console.log(`Found ${streamingTools.length} streaming-capable tools`);
}

/**
 * Demo: Multi-agent workflow execution
 */
async function demoWorkflowExecution(orchestrator: any): Promise<void> {
  console.log('\n🔄 Demo 4: Multi-Agent Workflow');

  console.log('Executing content creation workflow...');
  const workflowResult = await orchestrator.executeWorkflow(
    'content-creation',
    {
      topic: 'Sustainable Technology',
      targetAudience: 'business-leaders',
      contentType: 'comprehensive-article'
    }
  );

  if (workflowResult.success) {
    console.log('✅ Workflow completed successfully');
    console.log(`   Workflow: ${workflowResult.data?.workflow || 'N/A'}`);
    console.log(`   Execution time: ${workflowResult.executionTime}ms`);
  } else {
    console.log('❌ Workflow failed:', workflowResult.error);
  }
}

/**
 * Demo: System monitoring and statistics
 */
async function demoSystemMonitoring(orchestrator: any): Promise<void> {
  console.log('\n📊 Demo 5: System Monitoring');

  const stats = orchestrator.getSystemStatistics();

  console.log('System Statistics:');
  console.log(`  📚 Tools: ${stats.tools.totalTools} total`);
  console.log(`  🤖 Agents: ${stats.agents.totalAgents} total`);
  console.log(`  📈 Sessions: ${stats.sessions.active} active, ${stats.sessions.total} total`);
  console.log(`  ⏱️ Uptime: ${Math.round(stats.uptime / 1000 / 60)} minutes`);

  console.log('\nMost used tools:');
  if (stats.tools.mostUsedTool) {
    console.log(`  🏆 ${stats.tools.mostUsedTool.definition.name} (${stats.tools.mostUsedTool.metadata.usageCount} uses)`);
  }

  console.log('\nMost active agents:');
  if (stats.agents.mostActiveAgent) {
    console.log(`  🏆 ${stats.agents.mostActiveAgent.definition.name} (${stats.agents.mostActiveAgent.metadata.totalSessions} sessions)`);
  }
}

/**
 * Demo: Custom tool registration
 */
async function demoCustomToolRegistration(orchestrator: any): Promise<void> {
  console.log('\n🛠️ Demo 6: Custom Tool Registration');

  // Create a custom tool definition
  const customToolDefinition = {
    id: 'custom-logger',
    name: 'Custom Logger',
    description: 'Advanced logging tool with multiple output formats',
    category: 'utility',
    version: '1.0.0',
    parameters: [
      {
        name: 'message',
        type: 'string',
        description: 'Log message to record',
        required: true
      },
      {
        name: 'level',
        type: 'string',
        description: 'Log level (info, warn, error)',
        required: false,
        defaultValue: 'info'
      },
      {
        name: 'format',
        type: 'string',
        description: 'Output format (json, text, csv)',
        required: false,
        defaultValue: 'json'
      }
    ],
    cost: 0.001,
    timeout: 5000,
    tags: ['logging', 'utility', 'custom']
  };

  // Create custom tool handler
  const customToolHandler = {
    execute: async (context: any) => {
      const { message, level = 'info', format = 'json' } = context.parameters;

      const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        sessionId: context.sessionId
      };

      let output: string;
      switch (format) {
        case 'json':
          output = JSON.stringify(logEntry, null, 2);
          break;
        case 'csv':
          output = `timestamp,level,message,sessionId\n${logEntry.timestamp},${level},"${message}",${context.sessionId}`;
          break;
        default:
          output = `[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`;
      }

      console.log('📝 Custom log:', output);

      return {
        success: true,
        data: { logged: true, format, output },
        executionTime: 50,
        cost: 0.001,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    },

    validateParameters: (parameters: any) => {
      return typeof parameters.message === 'string' && parameters.message.length > 0;
    },

    getCapabilities: () => ({
      supportsStreaming: false,
      supportsCancellation: false,
      supportsRetry: true,
      maxConcurrency: 10,
      requiresAuthentication: false,
      supportedFormats: ['json', 'text', 'csv']
    })
  };

  // Register custom tool
  const toolId = await orchestrator.registerTool(customToolDefinition, customToolHandler);
  console.log(`✅ Custom tool registered: ${toolId}`);

  // Test custom tool
  const testResult = await orchestrator.executeTask({
    task: 'custom-logger', // This would be handled by a custom agent
    parameters: {
      message: 'This is a test log message from the custom tool',
      level: 'info',
      format: 'json'
    }
  });

  console.log(`Custom tool execution: ${testResult.success ? '✅ Success' : '❌ Failed'}`);
}

/**
 * Demo: Custom agent registration
 */
async function demoCustomAgentRegistration(orchestrator: any): Promise<void> {
  console.log('\n🤖 Demo 7: Custom Agent Registration');

  // Create custom agent definition
  const customAgentDefinition = {
    id: 'data-visualizer',
    name: 'Data Visualizer',
    description: 'Specialized agent for creating data visualizations and charts',
    type: 'analytical',
    specialization: ['data-visualization', 'chart-creation'],
    model: {
      provider: 'openai',
      model: 'gpt-4',
      maxTokens: 4096,
      temperature: 0.3
    },
    capabilities: [
      {
        name: 'chart-creation',
        description: 'Create various types of charts and graphs',
        parameters: { formats: ['bar', 'line', 'pie', 'scatter'] },
        cooldown: 1000
      },
      {
        name: 'data-visualization',
        description: 'Transform data into visual representations',
        parameters: { styles: ['professional', 'modern', 'minimal'] },
        cooldown: 2000
      }
    ],
    version: '1.0.0',
    cost: 0.02,
    timeout: 120000,
    maxConcurrency: 2,
    memory: {
      type: 'session',
      retention: 1800000,
      maxSize: 5000
    },
    tags: ['visualization', 'data', 'charts', 'custom']
  };

  // Create custom agent handler
  const customAgentHandler = {
    execute: async (context: any) => {
      const { task, parameters } = context;

      if (task === 'chart-creation') {
        const chart = {
          type: parameters.chartType || 'bar',
          title: parameters.title || 'Data Visualization',
          data: parameters.data || [10, 20, 30, 40],
          style: parameters.style || 'professional',
          generated: true,
          timestamp: new Date().toISOString()
        };

        return {
          success: true,
          data: chart,
          executionTime: 1500,
          cost: 0.02,
          metadata: {
            agentId: context.agentId,
            sessionId: context.sessionId,
            userId: context.userId,
            timestamp: Date.now(),
            toolsUsed: ['data-analysis']
          }
        };
      }

      return {
        success: false,
        error: `Unsupported task: ${task}`,
        executionTime: 0,
        cost: 0,
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: []
        }
      };
    },

    validateTask: (task: string, parameters: any) => {
      const validTasks = ['chart-creation', 'data-visualization'];
      return validTasks.includes(task) && parameters.data;
    },

    getCapabilities: () => ({
      supportsMultiStep: false,
      supportsCollaboration: true,
      supportsToolUse: true,
      maxSteps: 1,
      supportedTaskTypes: ['chart-creation', 'data-visualization'],
      requiresSetup: false,
      supportsMemory: true
    }),

    initialize: async () => {
      console.log('🎨 Data Visualizer agent initialized');
    },

    cleanup: async () => {
      console.log('🧹 Data Visualizer agent cleaned up');
    }
  };

  // Register custom agent
  const agentId = await orchestrator.registerAgent(
    customAgentDefinition,
    customAgentHandler,
    ['data-analysis', 'file-write']
  );
  console.log(`✅ Custom agent registered: ${agentId}`);

  // Test custom agent
  const chartResult = await orchestrator.executeTask({
    task: 'chart-creation',
    parameters: {
      title: 'Sales Performance',
      chartType: 'bar',
      data: [120, 150, 180, 200, 170],
      style: 'professional'
    },
    agentPreferences: {
      requiredCapabilities: ['chart-creation']
    }
  });

  console.log(`Custom agent execution: ${chartResult.success ? '✅ Success' : '❌ Failed'}`);
}

/**
 * Demo: Error handling and fallback mechanisms
 */
async function demoErrorHandling(orchestrator: any): Promise<void> {
  console.log('\n🛡️ Demo 8: Error Handling & Fallback');

  // Test with invalid task
  console.log('Testing invalid task handling...');
  const invalidResult = await orchestrator.executeTask({
    task: 'non-existent-task',
    parameters: {}
  });

  console.log(`Invalid task result: ${invalidResult.success ? 'Unexpected success' : '✅ Handled correctly'}`);

  // Test with missing required parameters
  console.log('Testing parameter validation...');
  const paramResult = await orchestrator.executeTask({
    task: 'code-review',
    parameters: {} // Missing required 'code' parameter
  });

  console.log(`Parameter validation: ${paramResult.success ? 'Unexpected success' : '✅ Validation working'}`);

  // Test system cleanup
  console.log('Testing session cleanup...');
  const cleanedCount = orchestrator.cleanupSessions(0); // Clean all sessions
  console.log(`Cleaned ${cleanedCount} old sessions`);

  console.log('✅ Error handling demonstration completed');
}

// Export the demo function for external usage
export { runRegistryDemo };

// For direct execution, uncomment the line below:
// runRegistryDemo().catch(console.error);

// Export for use in other modules
export { runRegistryDemo };