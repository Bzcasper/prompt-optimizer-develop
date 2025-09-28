/**
 * Advanced Tools Module
 * Base implementation for advanced system tools
 */

import { ToolRegistry } from '../tool-registry';
import { createHeyGenVideoTool } from './heygen-video-tool';

/**
 * Advanced Tools Collection
 * Manages registration of all advanced system tools
 */
export class AdvancedTools {
  /**
   * Register all advanced tools with the tool registry
   */
  static registerAllAdvancedTools(toolRegistry: ToolRegistry): void {
    try {
      // Register HeyGen Video Tool
      const heyGenVideoTool = createHeyGenVideoTool();
      toolRegistry.registerTool(
        heyGenVideoTool.definition,
        heyGenVideoTool.handler
      );

      console.log('✅ All advanced tools registered successfully');
    } catch (error) {
      console.error('❌ Failed to register advanced tools:', error);
      throw error;
    }
  }
}
