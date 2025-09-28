/**
 * Advanced System Demo
 * Comprehensive demonstration of all new system components including
 * advanced prompts, tools, and Google ADK integration
 */

import { createAdvancedOrchestrator } from './registry-orchestrator';
import { advancedSystemPrompts, getAdvancedPrompt } from './advanced-prompts';

/**
 * Main demo function showcasing all advanced system capabilities
 */
async function runAdvancedDemo(): Promise<void> {
  console.log('🚀 Starting Advanced System Demo\n');

  // Initialize orchestrator with Google ADK configuration
  const orchestrator = createAdvancedOrchestrator({
    projectId: 'demo-project',
    location: 'us-central1'
  });
  console.log('✅ Advanced Registry Orchestrator initialized with Google ADK');

  // Demo 1: System overview and statistics
  await demoSystemOverview(orchestrator);

  // Demo 2: Advanced tools demonstration
  await demoAdvancedTools(orchestrator);

  // Demo 3: Google ADK agents demonstration
  await demoGoogleADKAgents(orchestrator);

  // Demo 4: Advanced prompts demonstration
  await demoAdvancedPrompts();

  // Demo 5: Multi-agent workflow demonstration
  await demoMultiAgentWorkflow(orchestrator);

  // Demo 6: System monitoring and analytics
  await demoSystemMonitoring(orchestrator);

  console.log('\n🎉 Advanced System Demo completed successfully!');
}

/**
 * Demo: System overview and statistics
 */
async function demoSystemOverview(orchestrator: any): Promise<void> {
  console.log('\n📋 Demo 1: System Overview');

  const stats = orchestrator.getSystemStatistics();

  console.log('System Statistics:');
  console.log(`  📚 Tools: ${stats.tools.totalTools} total`);
  console.log(`  🤖 Agents: ${stats.agents.totalAgents} total`);
  console.log(`  📈 Sessions: ${stats.sessions.active} active, ${stats.sessions.total} total`);
  console.log(`  ⏱️ Uptime: ${Math.round(stats.uptime / 1000 / 60)} minutes`);
  console.log(`  🔗 Google ADK: ${stats.googleADK.configured ? '✅ Configured' : '❌ Not configured'}`);
  
  if (stats.googleADK.configured) {
    console.log(`     Project ID: ${stats.googleADK.projectId}`);
    console.log(`     Location: ${stats.googleADK.location}`);
  }

  console.log('\nAvailable Tools by Category:');
  const categories = ['analysis', 'api', 'data', 'computation', 'communication', 'creative', 'utility'];
  for (const category of categories) {
    const tools = orchestrator.getAvailableTools(category);
    if (tools.length > 0) {
      console.log(`  📁 ${category}: ${tools.length} tools`);
      tools.forEach(tool => {
        console.log(`    • ${tool.definition.name} (${tool.definition.id})`);
      });
    }
  }

  console.log('\nAvailable Agents by Type:');
  const types = ['orchestrator', 'specialist', 'utility', 'creative', 'analytical', 'communicator'];
  for (const type of types) {
    const agents = orchestrator.getAvailableAgents(type);
    if (agents.length > 0) {
      console.log(`  🤖 ${type}: ${agents.length} agents`);
      agents.forEach(agent => {
        console.log(`    • ${agent.definition.name} (${agent.definition.id})`);
      });
    }
  }
}

/**
 * Demo: Advanced tools demonstration
 */
async function demoAdvancedTools(orchestrator: any): Promise<void> {
  console.log('\n⚡ Demo 2: Advanced Tools');

  // Test System Monitoring Tool
  console.log('\n📊 Testing System Monitoring Tool...');
  const monitoringResult = await orchestrator.executeTask({
    task: 'system-monitoring',
    parameters: {
      metrics: ['cpu', 'memory', 'disk', 'network'],
      timeRange: '1h',
      granularity: '1m'
    }
  });

  if (monitoringResult.success) {
    console.log('✅ System monitoring completed');
    console.log(`   Execution time: ${monitoringResult.executionTime}ms`);
    console.log(`   Cost: $${monitoringResult.cost.toFixed(4)}`);
    console.log(`   CPU Usage: ${monitoringResult.data.metrics.cpu.usage.toFixed(1)}%`);
    console.log(`   Memory Usage: ${monitoringResult.data.metrics.memory.percentage.toFixed(1)}%`);
  } else {
    console.log('❌ System monitoring failed:', monitoringResult.error);
  }

  // Test Security Scanner Tool
  console.log('\n🔒 Testing Security Scanner Tool...');
  const securityResult = await orchestrator.executeTask({
    task: 'security-scanner',
    parameters: {
      target: 'demo-application',
      scanType: 'comprehensive',
      depth: 3
    }
  });

  if (securityResult.success) {
    console.log('✅ Security scanning completed');
    console.log(`   Execution time: ${securityResult.executionTime}ms`);
    console.log(`   Cost: $${securityResult.cost.toFixed(4)}`);
    console.log(`   Vulnerabilities found: ${securityResult.data.vulnerabilities.length}`);
    console.log(`   Risk score: ${securityResult.data.riskScore}/100`);
  } else {
    console.log('❌ Security scanning failed:', securityResult.error);
  }

  // Test Workflow Automation Tool
  console.log('\n🔄 Testing Workflow Automation Tool...');
  const workflowResult = await orchestrator.executeTask({
    task: 'workflow-automation',
    parameters: {
      workflow: {
        name: 'Data Processing Pipeline',
        steps: [
          { id: 'extract', name: 'Extract Data' },
          { id: 'transform', name: 'Transform Data' },
          { id: 'load', name: 'Load Data' }
        ]
      },
      inputs: {
        dataSource: 'api',
        format: 'json',
        destination: 'database'
      }
    }
  });

  if (workflowResult.success) {
    console.log('✅ Workflow automation completed');
    console.log(`   Execution time: ${workflowResult.executionTime}ms`);
    console.log(`   Cost: $${workflowResult.cost.toFixed(4)}`);
    console.log(`   Steps completed: ${workflowResult.data.metrics.completedSteps}/${workflowResult.data.metrics.totalSteps}`);
  } else {
    console.log('❌ Workflow automation failed:', workflowResult.error);
  }

  // Test Advanced Data Processing Tool
  console.log('\n📈 Testing Advanced Data Processing Tool...');
  const dataProcessingResult = await orchestrator.executeTask({
    task: 'advanced-data-processing',
    parameters: {
      dataset: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        value: Math.random() * 100,
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
      })),
      operations: [
        { type: 'filter', condition: 'value > 50' },
        { type: 'group', field: 'category' },
        { type: 'aggregate', function: 'average', field: 'value' }
      ],
      parameters: {
        outputFormat: 'json',
        compression: 'none'
      }
    }
  });

  if (dataProcessingResult.success) {
    console.log('✅ Advanced data processing completed');
    console.log(`   Execution time: ${dataProcessingResult.executionTime}ms`);
    console.log(`   Cost: $${dataProcessingResult.cost.toFixed(4)}`);
    console.log(`   Operations completed: ${dataProcessingResult.data.summary.completedOperations}/${dataProcessingResult.data.summary.totalOperations}`);
  } else {
    console.log('❌ Advanced data processing failed:', dataProcessingResult.error);
  }

  // Test API Integration Tool
  console.log('\n🌐 Testing API Integration Tool...');
  const apiResult = await orchestrator.executeTask({
    task: 'api-integration',
    parameters: {
      endpoint: 'https://api.example.com/data',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token'
      },
      authentication: {
        type: 'bearer',
        token: 'demo-token'
      }
    }
  });

  if (apiResult.success) {
    console.log('✅ API integration completed');
    console.log(`   Execution time: ${apiResult.executionTime}ms`);
    console.log(`   Cost: $${apiResult.cost.toFixed(4)}`);
    console.log(`   Status: ${apiResult.data.status}`);
    console.log(`   Response time: ${apiResult.data.responseTime}ms`);
  } else {
    console.log('❌ API integration failed:', apiResult.error);
  }
}

/**
 * Demo: Google ADK agents demonstration
 */
async function demoGoogleADKAgents(orchestrator: any): Promise<void> {
  console.log('\n🤖 Demo 3: Google ADK Agents');

  // Test Content Creation Agent
  console.log('\n📝 Testing Content Creation Agent...');
  const contentResult = await orchestrator.executeTask({
    task: 'blog-post',
    parameters: {
      title: 'The Future of Artificial Intelligence',
      tone: 'professional',
      targetAudience: 'technology professionals',
      wordCount: 800
    },
    agentPreferences: {
      requiredCapabilities: ['content-creation']
    }
  });

  if (contentResult.success) {
    console.log('✅ Content creation completed');
    console.log(`   Execution time: ${contentResult.executionTime}ms`);
    console.log(`   Cost: $${contentResult.cost.toFixed(4)}`);
    console.log(`   Word count: ${contentResult.data.metadata.wordCount}`);
    console.log(`   Reading time: ${contentResult.data.metadata.readingTime} min`);
    console.log(`   SEO score: ${contentResult.data.metadata.seoScore}/100`);
  } else {
    console.log('❌ Content creation failed:', contentResult.error);
  }

  // Test Data Analysis Agent
  console.log('\n📊 Testing Data Analysis Agent...');
  const analysisResult = await orchestrator.executeTask({
    task: 'statistical-analysis',
    parameters: {
      dataset: Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        value: Math.random() * 100 + Math.sin(i / 10) * 20,
        category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
      })),
      confidenceLevel: 0.95,
      includeVisualizations: true
    },
    agentPreferences: {
      requiredCapabilities: ['data-analysis']
    }
  });

  if (analysisResult.success) {
    console.log('✅ Data analysis completed');
    console.log(`   Execution time: ${analysisResult.executionTime}ms`);
    console.log(`   Cost: $${analysisResult.cost.toFixed(4)}`);
    console.log(`   Mean: ${analysisResult.data.summary.mean.toFixed(2)}`);
    console.log(`   Standard deviation: ${analysisResult.data.summary.standardDeviation.toFixed(2)}`);
    console.log(`   Insights: ${analysisResult.data.insights.length}`);
  } else {
    console.log('❌ Data analysis failed:', analysisResult.error);
  }

  // Test Code Generation Agent
  console.log('\n💻 Testing Code Generation Agent...');
  const codeResult = await orchestrator.executeTask({
    task: 'function-generation',
    parameters: {
      language: 'javascript',
      functionality: 'data validation',
      complexity: 'medium',
      includeComments: true,
      includeTests: true
    },
    agentPreferences: {
      requiredCapabilities: ['code-generation']
    }
  });

  if (codeResult.success) {
    console.log('✅ Code generation completed');
    console.log(`   Execution time: ${codeResult.executionTime}ms`);
    console.log(`   Cost: $${codeResult.cost.toFixed(4)}`);
    console.log(`   Language: ${codeResult.data.language}`);
    console.log(`   Dependencies: ${codeResult.data.dependencies.join(', ')}`);
    console.log(`   Testable: ${codeResult.data.testable ? 'Yes' : 'No'}`);
  } else {
    console.log('❌ Code generation failed:', codeResult.error);
  }
}

/**
 * Demo: Advanced prompts demonstration
 */
async function demoAdvancedPrompts(): Promise<void> {
  console.log('\n📝 Demo 4: Advanced Prompts');

  console.log('Available Advanced System Prompts:');
  advancedSystemPrompts.forEach(prompt => {
    console.log(`  📄 ${prompt.name} (${prompt.id})`);
    console.log(`     Language: ${prompt.metadata.language}`);
    console.log(`     Type: ${prompt.metadata.templateType}`);
    console.log(`     Description: ${prompt.metadata.description}`);
  });

  // Demonstrate getting a specific prompt
  const systemOrchestratorPrompt = getAdvancedPrompt('system-orchestrator');
  if (systemOrchestratorPrompt) {
    console.log('\n📄 System Orchestrator Prompt Details:');
    console.log(`   Name: ${systemOrchestratorPrompt.name}`);
    console.log(`   ID: ${systemOrchestratorPrompt.id}`);
    console.log(`   Language: ${systemOrchestratorPrompt.metadata.language}`);
    console.log(`   Version: ${systemOrchestratorPrompt.metadata.version}`);
    
    if (Array.isArray(systemOrchestratorPrompt.content)) {
      console.log(`   Messages: ${systemOrchestratorPrompt.content.length}`);
      systemOrchestratorPrompt.content.forEach((message, index) => {
        console.log(`     Message ${index + 1}: ${message.role} (${message.content.length} chars)`);
      });
    } else {
      console.log(`   Content length: ${systemOrchestratorPrompt.content.length} chars`);
    }
  }

  // Demonstrate getting prompts by category
  console.log('\n📄 Advanced Prompts by Category:');
  const systemPrompts = getAdvancedPromptsByCategory('system');
  console.log(`   System prompts: ${systemPrompts.length}`);
  systemPrompts.forEach(prompt => {
    console.log(`     • ${prompt.name} (${prompt.id})`);
  });
}

/**
 * Demo: Multi-agent workflow demonstration
 */
async function demoMultiAgentWorkflow(orchestrator: any): Promise<void> {
  console.log('\n🔄 Demo 5: Multi-Agent Workflow');

  console.log('Executing complex multi-agent workflow for data analysis and reporting...');

  // Step 1: Data collection with API Integration Tool
  console.log('\n🌐 Step 1: Data Collection');
  const dataCollectionResult = await orchestrator.executeTask({
    task: 'api-integration',
    parameters: {
      endpoint: 'https://api.example.com/sales-data',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  });

  if (!dataCollectionResult.success) {
    console.log('❌ Data collection failed:', dataCollectionResult.error);
    return;
  }

  console.log('✅ Data collection completed');

  // Step 2: Data processing with Advanced Data Processing Tool
  console.log('\n📈 Step 2: Data Processing');
  const dataProcessingResult = await orchestrator.executeTask({
    task: 'advanced-data-processing',
    parameters: {
      dataset: dataCollectionResult.data.response.data || [],
      operations: [
        { type: 'clean', rules: ['remove-nulls', 'normalize-dates'] },
        { type: 'transform', function: 'calculate-metrics' },
        { type: 'aggregate', dimensions: ['region', 'product'] }
      ],
      parameters: {
        outputFormat: 'json'
      }
    }
  });

  if (!dataProcessingResult.success) {
    console.log('❌ Data processing failed:', dataProcessingResult.error);
    return;
  }

  console.log('✅ Data processing completed');

  // Step 3: Statistical analysis with Data Analysis Agent
  console.log('\n📊 Step 3: Statistical Analysis');
  const analysisResult = await orchestrator.executeTask({
    task: 'statistical-analysis',
    parameters: {
      dataset: dataProcessingResult.data.output.data,
      analysisType: 'comprehensive',
      includePredictions: true,
      confidenceLevel: 0.95
    },
    agentPreferences: {
      requiredCapabilities: ['data-analysis']
    }
  });

  if (!analysisResult.success) {
    console.log('❌ Statistical analysis failed:', analysisResult.error);
    return;
  }

  console.log('✅ Statistical analysis completed');

  // Step 4: Report generation with Content Creation Agent
  console.log('\n📝 Step 4: Report Generation');
  const reportResult = await orchestrator.executeTask({
    task: 'technical-documentation',
    parameters: {
      title: 'Sales Performance Analysis Report',
      data: analysisResult.data,
      includeCharts: true,
      includeRecommendations: true,
      format: 'markdown',
      targetAudience: 'executives'
    },
    agentPreferences: {
      requiredCapabilities: ['content-creation']
    }
  });

  if (!reportResult.success) {
    console.log('❌ Report generation failed:', reportResult.error);
    return;
  }

  console.log('✅ Report generation completed');

  // Summary
  console.log('\n📋 Multi-Agent Workflow Summary:');
  console.log(`   Total execution time: ${
    dataCollectionResult.executionTime +
    dataProcessingResult.executionTime +
    analysisResult.executionTime +
    reportResult.executionTime
  }ms`);
  console.log(`   Total cost: $${(
    dataCollectionResult.cost +
    dataProcessingResult.cost +
    analysisResult.cost +
    reportResult.cost
  ).toFixed(4)}`);
  console.log(`   Tools used: 4 (API Integration, Data Processing, Data Analysis, Content Creation)`);
  console.log(`   Agents used: 2 (Data Analysis Agent, Content Creation Agent)`);
  console.log(`   Report length: ${reportResult.data.metadata.wordCount} words`);
}

/**
 * Demo: System monitoring and analytics
 */
async function demoSystemMonitoring(orchestrator: any): Promise<void> {
  console.log('\n📊 Demo 6: System Monitoring and Analytics');

  // Get current system statistics
  const stats = orchestrator.getSystemStatistics();

  console.log('Current System Performance:');
  console.log(`   Uptime: ${Math.floor(stats.uptime / 1000 / 60)} minutes ${Math.floor((stats.uptime % 60000) / 1000)} seconds`);
  console.log(`   Active sessions: ${stats.sessions.active}`);
  console.log(`   Total sessions: ${stats.sessions.total}`);
  console.log(`   Tools registered: ${stats.tools.totalTools}`);
  console.log(`   Agents registered: ${stats.agents.totalAgents}`);

  // Monitor system performance over time
  console.log('\n📈 Monitoring System Performance Over Time...');
  
  const monitoringResults = [];
  for (let i = 0; i < 5; i++) {
    console.log(`   Taking measurement ${i + 1}/5...`);
    
    const result = await orchestrator.executeTask({
      task: 'system-monitoring',
      parameters: {
        metrics: ['cpu', 'memory'],
        timeRange: '5m',
        granularity: '1m'
      }
    });

    if (result.success) {
      monitoringResults.push({
        timestamp: Date.now(),
        cpu: result.data.metrics.cpu.usage,
        memory: result.data.metrics.memory.percentage
      });
    }

    // Wait between measurements
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Analyze monitoring results
  if (monitoringResults.length > 0) {
    const avgCpu = monitoringResults.reduce((sum, r) => sum + r.cpu, 0) / monitoringResults.length;
    const avgMemory = monitoringResults.reduce((sum, r) => sum + r.memory, 0) / monitoringResults.length;
    const maxCpu = Math.max(...monitoringResults.map(r => r.cpu));
    const maxMemory = Math.max(...monitoringResults.map(r => r.memory));

    console.log('\n📊 Performance Analysis:');
    console.log(`   Average CPU usage: ${avgCpu.toFixed(1)}%`);
    console.log(`   Average Memory usage: ${avgMemory.toFixed(1)}%`);
    console.log(`   Peak CPU usage: ${maxCpu.toFixed(1)}%`);
    console.log(`   Peak Memory usage: ${maxMemory.toFixed(1)}%`);

    if (maxCpu > 80) {
      console.log('⚠️  High CPU usage detected');
    }
    if (maxMemory > 80) {
      console.log('⚠️  High Memory usage detected');
    }
    if (maxCpu <= 80 && maxMemory <= 80) {
      console.log('✅ System performance within normal parameters');
    }
  }

  // Generate system analytics report
  console.log('\n📝 Generating System Analytics Report...');
  
  const reportResult = await orchestrator.executeTask({
    task: 'technical-documentation',
    parameters: {
      title: 'System Performance Analytics Report',
      data: {
        stats,
        monitoringResults,
        analysis: {
          avgCpu: monitoringResults.length > 0 ? monitoringResults.reduce((sum, r) => sum + r.cpu, 0) / monitoringResults.length : 0,
          avgMemory: monitoringResults.length > 0 ? monitoringResults.reduce((sum, r) => sum + r.memory, 0) / monitoringResults.length : 0,
          maxCpu: monitoringResults.length > 0 ? Math.max(...monitoringResults.map(r => r.cpu)) : 0,
          maxMemory: monitoringResults.length > 0 ? Math.max(...monitoringResults.map(r => r.memory)) : 0
        }
      },
      includeCharts: true,
      format: 'markdown',
      targetAudience: 'system administrators'
    },
    agentPreferences: {
      requiredCapabilities: ['content-creation']
    }
  });

  if (reportResult.success) {
    console.log('✅ System analytics report generated');
    console.log(`   Report length: ${reportResult.data.metadata.wordCount} words`);
    console.log(`   Reading time: ${reportResult.data.metadata.readingTime} minutes`);
  } else {
    console.log('❌ System analytics report generation failed:', reportResult.error);
  }

  // Cleanup old sessions
  console.log('\n🧹 Cleaning up old sessions...');
  const cleanedCount = orchestrator.cleanupSessions(0);
  console.log(`   Cleaned ${cleanedCount} sessions`);
}

// Export the demo function
export { runAdvancedDemo };

// Run the demo if this file is executed directly
if (require.main === module) {
  runAdvancedDemo().catch(console.error);
}