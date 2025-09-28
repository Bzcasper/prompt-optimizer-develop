/**
 * MCP Client Service for UI Integration
 * Provides communication with the MCP server for prompt optimization
 */

import { Template } from '@prompt-optimizer/core';

export interface MCPOptimizeRequest {
  prompt: string;
  template?: string;
  mode?: 'user' | 'system';
}

export interface MCPIterateRequest {
  prompt: string;
  requirements: string;
  template?: string;
}

export interface MCPContentRequest {
  templateId: string;
  variables: Record<string, any>;
  systemPrompt?: string;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class MCPClientService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Test MCP server connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.status === 200;
    } catch (error) {
      console.error('MCP server connection test failed:', error);
      return false;
    }
  }

  /**
   * Optimize user prompt
   */
  async optimizeUserPrompt(request: MCPOptimizeRequest): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'optimize-user-prompt',
            arguments: {
              prompt: request.prompt,
              template: request.template
            }
          }
        })
      });

      const result = await response.json();

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'MCP request failed'
        };
      }

      return {
        success: true,
        data: result.result?.content?.[0]?.text || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Optimize system prompt
   */
  async optimizeSystemPrompt(request: MCPOptimizeRequest): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'optimize-system-prompt',
            arguments: {
              prompt: request.prompt,
              template: request.template
            }
          }
        })
      });

      const result = await response.json();

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'MCP request failed'
        };
      }

      return {
        success: true,
        data: result.result?.content?.[0]?.text || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Iterate prompt optimization
   */
  async iteratePrompt(request: MCPIterateRequest): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'iterate-prompt',
            arguments: {
              prompt: request.prompt,
              requirements: request.requirements,
              template: request.template
            }
          }
        })
      });

      const result = await response.json();

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'MCP request failed'
        };
      }

      return {
        success: true,
        data: result.result?.content?.[0]?.text || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate content
   */
  async generateContent(request: MCPContentRequest): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'generate-content',
            arguments: {
              templateId: request.templateId,
              variables: request.variables,
              systemPrompt: request.systemPrompt
            }
          }
        })
      });

      const result = await response.json();

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'MCP request failed'
        };
      }

      return {
        success: true,
        data: result.result?.content?.[0]?.text || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate content with iteration
   */
  async generateContentIterative(
    templateId: string,
    variables: Record<string, any>,
    refinementPrompt: string,
    maxIterations: number = 3,
    systemPrompt?: string
  ): Promise<MCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'tools/call',
          params: {
            name: 'generate-content-iterative',
            arguments: {
              templateId,
              variables,
              refinementPrompt,
              maxIterations,
              systemPrompt
            }
          }
        })
      });

      const result = await response.json();

      if (result.error) {
        return {
          success: false,
          error: result.error.message || 'MCP request failed'
        };
      }

      return {
        success: true,
        data: result.result?.content?.[0]?.text || ''
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get available templates
   */
  async getAvailableTemplates(): Promise<{ optimize: string[], iterate: string[], content: string[] }> {
    // This would typically call the MCP server to get available templates
    // For now, return empty arrays as placeholders
    return {
      optimize: [],
      iterate: [],
      content: []
    };
  }

  /**
   * Update MCP server URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Get current MCP server URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export singleton instance
export const mcpClient = new MCPClientService();