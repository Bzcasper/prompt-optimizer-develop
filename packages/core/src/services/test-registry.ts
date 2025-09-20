/**
 * Simple test script for Tool and Agent Registry
 */

import { createRegistryOrchestrator } from './registry-orchestrator.js';

async function testRegistry() {
  console.log('🚀 Testing Tool and Agent Registry\n');

  try {
    // Create orchestrator
    const orchestrator = createRegistryOrchestrator();
    console.log('✅ Registry Orchestrator created');

    // Test system inventory
    console.log('\n📋 Testing system inventory...');
    const tools = orchestrator.getAvailableTools();
    const agents = orchestrator.getAvailableAgents();

    console.log(`📚 Available Tools: ${tools.length}`);
    console.log(`🤖 Available Agents: ${agents.length}`);

    // Test tool search
    console.log('\n🔍 Testing tool search...');
    const fileTools = orchestrator.searchTools({ category: 'file' });
    console.log(`📁 File tools found: ${fileTools.length}`);

    // Test agent search
    console.log('Testing agent search...');
    const specialistAgents = orchestrator.searchAgents({ type: 'specialist' });
    console.log(`🎯 Specialist agents found: ${specialistAgents.length}`);

    // Test system statistics
    console.log('\n📊 Testing system statistics...');
    const stats = orchestrator.getSystemStatistics();
    console.log(`System Statistics:
  Tools: ${stats.tools.totalTools}
  Agents: ${stats.agents.totalAgents}
  Active Sessions: ${stats.sessions.active}
  Uptime: ${Math.round(stats.uptime / 1000 / 60)} minutes`);

    console.log('\n✅ All registry tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Registry test failed:', error);
    return false;
  }
}

// Run the test
testRegistry().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});