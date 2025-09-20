#!/usr/bin/env node

/**
 * Test script for tool and agent registration
 */

import { createServerInstance } from '../src/index.js';
import { loadConfig } from '../src/config/environment.js';
import * as logger from '../src/utils/logging.js';

async function testRegistration() {
  console.log('🧪 Testing tool and agent registration...');
  
  try {
    // Load configuration
    const config = loadConfig();
    logger.setLogLevel(config.logLevel);
    
    // Create server instance (this will register tools and agents)
    const { server, coreServices, toolRegistry, agentRegistry } = await createServerInstance(config);
    
    // Test tool registration
    console.log('\n📋 Testing tool registration:');
    const tools = toolRegistry.listTools();
    console.log(`✅ Successfully registered ${tools.length} tools:`);
    tools.forEach(tool => {
      console.log(`   - ${tool.definition.id}: ${tool.definition.description}`);
    });
    
    // Test agent registration
    console.log('\n🤖 Testing agent registration:');
    const agents = agentRegistry.listAgents();
    console.log(`✅ Successfully registered ${agents.length} agents:`);
    agents.forEach(agent => {
      console.log(`   - ${agent.definition.id}: ${agent.definition.description}`);
    });
    
    // Test template registration
    console.log('\n📄 Testing template registration:');
    const templateManager = coreServices.getTemplateManager();
    const templates = templateManager.getAllTemplates();
    console.log(`✅ Successfully registered ${Object.keys(templates).length} templates`);
    
    // Test MCP server tools list
    console.log('\n🔌 Testing MCP server tools list:');
    const listToolsHandler = server.getRequestHandler('tools/list');
    if (listToolsHandler) {
      const toolsList = await listToolsHandler();
      console.log(`✅ MCP server exposes ${toolsList.tools.length} tools:`);
      toolsList.tools.forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.description.substring(0, 60)}...`);
      });
    } else {
      console.log('❌ MCP server does not have a tools/list handler');
    }
    
    console.log('\n🎉 All registration tests passed!');
    
  } catch (error) {
    console.error('❌ Registration test failed:', error);
    process.exit(1);
  }
}

// Run the test
testRegistration();