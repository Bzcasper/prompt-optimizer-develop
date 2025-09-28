/**
 * Tool Registry System
 * Comprehensive tool registration, discovery, and execution framework
 */

import { z } from 'zod';

// Tool Definition Schema
export const ToolParameterSchema = z.object({
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'object', 'array']),
  description: z.string(),
  required: z.boolean().default(false),
  defaultValue: z.any().optional(),
  validation: z.any().optional()
});

export const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['file', 'api', 'data', 'computation', 'communication', 'analysis', 'creative', 'utility']),
  version: z.string(),
  parameters: z.array(ToolParameterSchema),
  outputSchema: z.any().optional(),
  cost: z.number().default(0),
  timeout: z.number().default(30000), // 30 seconds default
  rateLimit: z.object({
    requests: z.number(),
    period: z.number() // in milliseconds
  }).optional(),
  permissions: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});

export type ToolParameter = z.infer<typeof ToolParameterSchema>;
export type ToolDefinition = z.infer<typeof ToolSchema>;

// Tool Instance and Execution
export interface ToolInstance {
  id: string;
  definition: ToolDefinition;
  handler: ToolHandler;
  metadata: {
    registeredAt: number;
    lastUsed?: number;
    usageCount: number;
    averageExecutionTime: number;
    successRate: number;
  };
}

export interface ToolExecutionContext {
  toolId: string;
  parameters: Record<string, any>;
  sessionId: string;
  agentId: string;
  userId?: string;
  timeout?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
  cost: number;
  metadata: {
    toolId: string;
    sessionId: string;
    agentId: string;
    timestamp: number;
  };
}

export interface ToolHandler {
  execute(context: ToolExecutionContext): Promise<ToolExecutionResult>;
  validateParameters(parameters: Record<string, any>): boolean;
  getCapabilities(): ToolCapabilities;
}

export interface ToolCapabilities {
  supportsStreaming?: boolean;
  supportsCancellation?: boolean;
  supportsRetry?: boolean;
  maxConcurrency?: number;
  requiresAuthentication?: boolean;
  supportedFormats?: string[];
}

// Tool Registry Class
export class ToolRegistry {
  private tools: Map<string, ToolInstance> = new Map();
  private categories: Map<string, Set<string>> = new Map();
  private tags: Map<string, Set<string>> = new Map();

  /**
   * Register a new tool
   */
  registerTool(definition: ToolDefinition, handler: ToolHandler): string {
    // Validate tool definition
    const validatedDefinition = ToolSchema.parse(definition);

    // Check for duplicate ID
    if (this.tools.has(validatedDefinition.id)) {
      throw new Error(`Tool with ID '${validatedDefinition.id}' already exists`);
    }

    // Validate dependencies
    for (const depId of validatedDefinition.dependencies) {
      if (!this.tools.has(depId)) {
        throw new Error(`Tool dependency '${depId}' not found`);
      }
    }

    // Create tool instance
    const instance: ToolInstance = {
      id: validatedDefinition.id,
      definition: validatedDefinition,
      handler,
      metadata: {
        registeredAt: Date.now(),
        usageCount: 0,
        averageExecutionTime: 0,
        successRate: 1.0
      }
    };

    // Register tool
    this.tools.set(validatedDefinition.id, instance);

    // Update category and tag indices
    this.updateIndices(validatedDefinition);

    return validatedDefinition.id;
  }

  /**
   * Unregister a tool
   */
  unregisterTool(toolId: string): boolean {
    const instance = this.tools.get(toolId);
    if (!instance) {
      return false;
    }

    // Check for dependent tools
    const dependents = this.getDependentTools(toolId);
    if (dependents.length > 0) {
      throw new Error(`Cannot unregister tool '${toolId}' - it has ${dependents.length} dependent tools`);
    }

    // Remove from indices
    this.removeFromIndices(instance.definition);

    // Remove tool
    this.tools.delete(toolId);
    return true;
  }

  /**
   * Get tool by ID
   */
  getTool(toolId: string): ToolInstance | undefined {
    return this.tools.get(toolId);
  }

  /**
   * List all tools
   */
  listTools(): ToolInstance[] {
    return Array.from(this.tools.values());
  }

  /**
   * List tools by category
   */
  listToolsByCategory(category: string): ToolInstance[] {
    const toolIds = this.categories.get(category);
    if (!toolIds) return [];

    return Array.from(toolIds)
      .map(id => this.tools.get(id))
      .filter((tool): tool is ToolInstance => tool !== undefined);
  }

  /**
   * List tools by tag
   */
  listToolsByTag(tag: string): ToolInstance[] {
    const toolIds = this.tags.get(tag);
    if (!toolIds) return [];

    return Array.from(toolIds)
      .map(id => this.tools.get(id))
      .filter((tool): tool is ToolInstance => tool !== undefined);
  }

  /**
   * Search tools by query
   */
  searchTools(query: {
    category?: string;
    tags?: string[];
    name?: string;
    capability?: string;
  }): ToolInstance[] {
    let results = this.listTools();

    if (query.category) {
      results = results.filter(tool => tool.definition.category === query.category);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(tool =>
        query.tags!.some(tag => tool.definition.tags.includes(tag))
      );
    }

    if (query.name) {
      const searchTerm = query.name.toLowerCase();
      results = results.filter(tool =>
        tool.definition.name.toLowerCase().includes(searchTerm) ||
        tool.definition.description.toLowerCase().includes(searchTerm)
      );
    }

    if (query.capability) {
      results = results.filter(tool => {
        const capabilities = tool.handler.getCapabilities();
        return Object.values(capabilities).some(cap => cap === true) ||
               (capabilities.supportedFormats && capabilities.supportedFormats.includes(query.capability!));
      });
    }

    return results;
  }

  /**
   * Execute a tool
   */
  async executeTool(context: ToolExecutionContext): Promise<ToolExecutionResult> {
    const instance = this.tools.get(context.toolId);
    if (!instance) {
      throw new Error(`Tool '${context.toolId}' not found`);
    }

    // Validate parameters
    if (!instance.handler.validateParameters(context.parameters)) {
      throw new Error(`Invalid parameters for tool '${context.toolId}'`);
    }

    // Check permissions (placeholder for permission system)
    await this.checkPermissions(instance, context);

    // Execute tool
    const startTime = Date.now();
    try {
      const result = await instance.handler.execute(context);
      const executionTime = Date.now() - startTime;

      // Update metadata
      this.updateToolMetadata(instance, executionTime, true);

      return {
        ...result,
        executionTime,
        metadata: {
          ...result.metadata,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Update metadata
      this.updateToolMetadata(instance, executionTime, false);

      return {
        success: false,
        error: error.message,
        executionTime,
        cost: 0,
        metadata: {
          toolId: context.toolId,
          sessionId: context.sessionId,
          agentId: context.agentId,
          timestamp: Date.now()
        }
      };
    }
  }

  /**
   * Get tool statistics
   */
  getToolStatistics(toolId: string): ToolStatistics | null {
    const instance = this.tools.get(toolId);
    if (!instance) return null;

    return {
      toolId,
      usageCount: instance.metadata.usageCount,
      averageExecutionTime: instance.metadata.averageExecutionTime,
      successRate: instance.metadata.successRate,
      lastUsed: instance.metadata.lastUsed,
      registeredAt: instance.metadata.registeredAt
    };
  }

  /**
   * Get registry statistics
   */
  getRegistryStatistics(): RegistryStatistics {
    const tools = this.listTools();
    const stats = {
      totalTools: tools.length,
      categories: this.categories.size,
      totalUsage: tools.reduce((sum, tool) => sum + tool.metadata.usageCount, 0),
      averageSuccessRate: tools.length > 0
        ? tools.reduce((sum, tool) => sum + tool.metadata.successRate, 0) / tools.length
        : 0,
      mostUsedTool: tools.reduce((prev, current) =>
        prev.metadata.usageCount > current.metadata.usageCount ? prev : current
      )
    };

    return stats;
  }

  // Private methods

  private updateIndices(definition: ToolDefinition): void {
    // Update category index
    if (!this.categories.has(definition.category)) {
      this.categories.set(definition.category, new Set());
    }
    this.categories.get(definition.category)!.add(definition.id);

    // Update tag indices
    for (const tag of definition.tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)!.add(definition.id);
    }
  }

  private removeFromIndices(definition: ToolDefinition): void {
    // Remove from category index
    const categorySet = this.categories.get(definition.category);
    if (categorySet) {
      categorySet.delete(definition.id);
      if (categorySet.size === 0) {
        this.categories.delete(definition.category);
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

  private getDependentTools(toolId: string): string[] {
    const dependents: string[] = [];
    for (const instance of this.tools.values()) {
      if (instance.definition.dependencies.includes(toolId)) {
        dependents.push(instance.id);
      }
    }
    return dependents;
  }

  private async checkPermissions(instance: ToolInstance, context: ToolExecutionContext): Promise<void> {
    // Placeholder for permission checking
    // In a real implementation, this would check user permissions against tool requirements
  }

  private updateToolMetadata(instance: ToolInstance, executionTime: number, success: boolean): void {
    instance.metadata.lastUsed = Date.now();
    instance.metadata.usageCount++;

    // Update average execution time
    const totalTime = instance.metadata.averageExecutionTime * (instance.metadata.usageCount - 1) + executionTime;
    instance.metadata.averageExecutionTime = totalTime / instance.metadata.usageCount;

    // Update success rate
    const successCount = Math.round(instance.metadata.successRate * (instance.metadata.usageCount - 1));
    const newSuccessCount = success ? successCount + 1 : successCount;
    instance.metadata.successRate = newSuccessCount / instance.metadata.usageCount;
  }
}

// Statistics Interfaces
export interface ToolStatistics {
  toolId: string;
  usageCount: number;
  averageExecutionTime: number;
  successRate: number;
  lastUsed?: number;
  registeredAt: number;
}

export interface RegistryStatistics {
  totalTools: number;
  categories: number;
  totalUsage: number;
  averageSuccessRate: number;
  mostUsedTool: ToolInstance;
}

// Built-in Tool Categories
export const TOOL_CATEGORIES = {
  FILE: 'file',
  API: 'api',
  DATA: 'data',
  COMPUTATION: 'computation',
  COMMUNICATION: 'communication',
  ANALYSIS: 'analysis',
  CREATIVE: 'creative',
  UTILITY: 'utility'
} as const;

// Factory function
export function createToolRegistry(): ToolRegistry {
  return new ToolRegistry();
}