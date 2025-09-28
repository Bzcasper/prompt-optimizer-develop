#!/usr/bin/env node
/**
 * MCP Server for Prompt Optimizer
 *
 * 提供核心工具：
 * - optimize-user-prompt: 优化用户提示词
 * - optimize-system-prompt: 优化系统提示词
 * - iterate-prompt: 迭代优化成熟提示词
 * - generate-content: 生成内容（文章、营销文案、技术文档等）
 * - generate-content-iterative: 迭代式内容生成和优化
 *
 * 支持 stdio 和 HTTP 两种传输方式
 *
 * 注意：环境变量通过 environment.ts 在应用启动时加载
 *
 * @format
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  isInitializeRequest,
} from "@modelcontextprotocol/sdk/types.js";
import { CoreServicesManager } from "./adapters/core-services.js";
import { loadConfig } from "./config/environment.js";
import * as logger from "./utils/logging.js";
import { ParameterValidator } from "./adapters/parameter-adapter.js";
import {
  getTemplateOptions,
  getDefaultTemplateId,
} from "./config/templates.js";
import { randomUUID } from "node:crypto";
import express from "express";
import { MCPErrorHandler, MCP_ERROR_CODES } from "./adapters/error-handler.js";
import {
  registerBuiltInTools,
  getMCPToolDefinitions,
  executeTool,
} from "./adapters/tool-registration.js";
import {
  registerBuiltInAgents,
  getMCPAgentDefinitions,
  executeAgent,
  getAgentLLMConfig,
  updateAgentLLMAssignment,
  removeAgentLLMAssignment,
  getAllAgentLLMConfigs,
  testAgentWithModel,
  getAgentPerformanceStats,
} from "./adapters/agent-registration.js";

// 创建服务器实例的工厂函数
async function createServerInstance(config: any) {
  // 创建 MCP Server 实例 - 使用正确的 API
  const server = new Server(
    {
      name: "prompt-optimizer-mcp-server",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 初始化 Core 服务（每个服务器实例独立）
  const coreServices = CoreServicesManager.getInstance();
  await coreServices.initialize(config);

  // 获取存储提供者、模型管理器和LLM服务
  const storageProvider = coreServices.getStorageProvider();
  const modelManager = coreServices.getModelManager();
  const llmService = coreServices.getLLMService();

  // 注册工具和代理
  const toolRegistry = registerBuiltInTools();
  const {
    registry: agentRegistry,
    llmConfigManager,
    executionManager,
  } = await registerBuiltInAgents(storageProvider, modelManager, llmService);

  return {
    server,
    coreServices,
    toolRegistry,
    agentRegistry,
    llmConfigManager,
    executionManager,
  };
}

// 设置服务器工具和处理器的函数
async function setupServerHandlers(
  server: Server,
  coreServices: CoreServicesManager,
  toolRegistry: any,
  agentRegistry: any,
  llmConfigManager: any,
  executionManager: any
) {
  // 获取模板选项和默认模板ID用于工具定义
  logger.info("获取模板选项...");
  const templateManager = coreServices.getTemplateManager();
  const contentGenerationService = coreServices.getContentGenerationService();
  const [
    userOptimizeOptions,
    systemOptimizeOptions,
    iterateOptions,
    userDefaultId,
    systemDefaultId,
    iterateDefaultId,
    contentTemplates,
  ] = await Promise.all([
    getTemplateOptions(templateManager, "userOptimize"),
    getTemplateOptions(templateManager, "optimize"),
    getTemplateOptions(templateManager, "iterate"),
    getDefaultTemplateId(templateManager, "user"),
    getDefaultTemplateId(templateManager, "system"),
    getDefaultTemplateId(templateManager, "iterate"),
    contentGenerationService.getAvailableTemplates(),
  ]);

  // 注册工具列表处理器
  logger.info("注册 MCP 工具...");
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    // 获取内置工具定义
    const builtInToolDefinitions = getMCPToolDefinitions(toolRegistry);

    // 获取内置代理定义
    const builtInAgentDefinitions = getMCPAgentDefinitions(agentRegistry);

    // 原有的提示词优化工具
    const promptOptimizationTools = [
      {
        name: "optimize-user-prompt",
        description:
          "优化用户提示词，提升与AI对话的效果。适用于日常对话、问答、创作等场景。\n\n主要功能：\n- 增强表达清晰度和具体性\n- 添加必要的上下文信息\n- 优化语言表达和逻辑结构\n- 提高AI理解准确性\n\n使用场景示例：\n- 将模糊问题转化为具体明确的询问\n- 为创作任务添加详细要求和约束\n- 优化技术问题的描述方式",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description:
                "要优化的用户提示词。例如：'帮我写个文章' 或 '解释一下机器学习'",
            },
            template: {
              type: "string",
              description: `选择优化模板，不同模板适用于不同场景：\n${userOptimizeOptions
                .map((opt: any) => `- ${opt.label}：${opt.description}`)
                .join("\n")}`,
              enum: userOptimizeOptions.map((opt: any) => opt.value),
              default: userDefaultId,
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "optimize-system-prompt",
        description:
          "优化系统提示词，提升AI角色扮演和行为控制效果。适用于定制AI助手、创建专业角色、设计对话系统等场景。\n\n主要功能：\n- 增强角色定义和专业性\n- 优化行为指导和约束\n- 改进指令结构和层次\n- 添加必要的专业知识\n\n使用场景示例：\n- 将简单角色描述转化为专业角色定义\n- 为AI助手添加详细的行为规则和限制\n- 优化特定领域专家的知识框架",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description:
                "要优化的系统提示词。例如：'你是一个助手' 或 '你是一个医疗顾问'",
            },
            template: {
              type: "string",
              description: `选择优化模板，不同模板适用于不同场景：\n${systemOptimizeOptions
                .map((opt: any) => `- ${opt.label}：${opt.description}`)
                .join("\n")}`,
              enum: systemOptimizeOptions.map((opt: any) => opt.value),
              default: systemDefaultId,
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "iterate-prompt",
        description:
          "基于具体需求迭代改进已有的提示词。适用于已经有基础提示词，但需要针对特定需求进行精细调整的场景。\n\n主要功能：\n- 保持原有提示词的核心功能\n- 根据具体需求进行针对性改进\n- 解决现有提示词的特定问题\n- 适应新的使用场景或要求\n\n使用场景示例：\n- 现有提示词效果不够理想，需要改进\n- 需要适应新的业务需求或使用场景\n- 要解决特定的输出格式或内容问题\n- 需要增强某个特定方面的表现",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description:
                "要迭代改进的现有提示词。应该是一个已经在使用但需要改进的完整提示词",
            },
            requirements: {
              type: "string",
              description:
                "具体的改进需求或问题描述。例如：'输出格式不够规范' 或 '需要更专业的语言风格' 或 '希望增加创意性'",
            },
            template: {
              type: "string",
              description: `选择迭代优化模板，不同模板有不同的改进策略：\n${iterateOptions
                .map((opt: any) => `- ${opt.label}：${opt.description}`)
                .join("\n")}`,
              enum: iterateOptions.map((opt: any) => opt.value),
              default: iterateDefaultId,
            },
          },
          required: ["prompt", "requirements"],
        },
      },
      {
        name: "generate-content",
        description:
          "使用专业模板生成高质量内容。支持文章写作、营销文案、技术文档等多种内容类型。\n\n主要功能：\n- 使用预定义的专业模板\n- 支持变量替换和自定义参数\n- 生成结构化、专业的内容\n- 适用于多种内容创作场景\n\n支持的内容类型：\n- 文章写作 (Article Writer)\n- 营销文案 (Marketing Copy)\n- 技术文档 (Technical Documentation)\n- 以及更多专业模板\n\n使用场景示例：\n- 写SEO优化的博客文章\n- 创建产品营销文案\n- 生成技术文档和教程\n- 撰写专业报告和分析",
        inputSchema: {
          type: "object",
          properties: {
            templateId: {
              type: "string",
              description: `选择内容生成模板：\n${contentTemplates
                .map(
                  (template: any) => `- ${template.id}：${template.description}`
                )
                .join("\n")}`,
              enum: contentTemplates.map((template: any) => template.id),
            },
            variables: {
              type: "object",
              description:
                "模板变量，根据选择的模板提供相应的变量值。例如：{topic: 'AI技术', audience: '开发者', wordCount: 1500}",
            },
            systemPrompt: {
              type: "string",
              description: "可选的系统提示词，用于自定义AI的行为和风格",
              default: "",
            },
          },
          required: ["templateId", "variables"],
        },
      },
      {
        name: "generate-content-iterative",
        description:
          "迭代式内容生成和优化。通过多轮迭代改进生成的内容质量。\n\n主要功能：\n- 首先生成初始内容\n- 根据反馈进行多轮优化\n- 支持自定义优化要求\n- 逐步提升内容质量\n\n工作流程：\n1. 使用基础模板生成初始内容\n2. 根据具体要求进行迭代优化\n3. 每次迭代都基于前一版本改进\n4. 直到达到满意的质量标准\n\n适用场景：\n- 需要高质量内容的创作任务\n- 内容需要经过多次修改和完善\n- 对输出质量有较高要求的项目\n- 需要专业化或定制化内容的生成",
        inputSchema: {
          type: "object",
          properties: {
            templateId: {
              type: "string",
              description: `选择内容生成模板：\n${contentTemplates
                .map(
                  (template: any) => `- ${template.id}：${template.description}`
                )
                .join("\n")}`,
              enum: contentTemplates.map((template: any) => template.id),
            },
            variables: {
              type: "object",
              description: "模板变量，根据选择的模板提供相应的变量值",
            },
            refinementPrompt: {
              type: "string",
              description:
                "内容优化要求，描述如何改进生成的内容。例如：'使语言更专业' 或 '增加更多技术细节'",
            },
            maxIterations: {
              type: "number",
              description: "最大迭代次数，默认3次",
              default: 3,
              minimum: 1,
              maximum: 10,
            },
            systemPrompt: {
              type: "string",
              description: "可选的系统提示词，用于自定义AI的行为和风格",
              default: "",
            },
          },
          required: ["templateId", "variables", "refinementPrompt"],
        },
      },
    ];

    // Agent LLM management tools
    const agentLLMTools = [
      {
        name: "get-agent-llm-config",
        description: "获取指定代理的LLM配置信息",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "代理ID",
            },
          },
          required: ["agentId"],
        },
      },
      {
        name: "update-agent-llm-assignment",
        description: "更新代理的LLM分配配置",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "代理ID",
            },
            modelKey: {
              type: "string",
              description: "模型键",
            },
            config: {
              type: "object",
              description: "LLM配置",
              properties: {
                priority: {
                  type: "number",
                  description: "优先级，数字越大优先级越高",
                },
                enabled: {
                  type: "boolean",
                  description: "是否启用",
                },
                maxTokens: {
                  type: "number",
                  description: "最大令牌数",
                },
                temperature: {
                  type: "number",
                  description: "温度参数",
                },
                topP: {
                  type: "number",
                  description: "topP参数",
                },
                topK: {
                  type: "number",
                  description: "topK参数",
                },
                stopSequences: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "停止序列",
                },
                agentParams: {
                  type: "object",
                  description: "代理特定参数",
                },
              },
            },
          },
          required: ["agentId", "modelKey"],
        },
      },
      {
        name: "remove-agent-llm-assignment",
        description: "移除代理的LLM分配配置",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "代理ID",
            },
            modelKey: {
              type: "string",
              description: "模型键",
            },
          },
          required: ["agentId", "modelKey"],
        },
      },
      {
        name: "get-all-agent-llm-configs",
        description: "获取所有代理的LLM配置信息",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "test-agent-with-model",
        description: "使用指定模型测试代理",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "代理ID",
            },
            task: {
              type: "string",
              description: "测试任务",
            },
            parameters: {
              type: "object",
              description: "任务参数",
            },
            modelKey: {
              type: "string",
              description: "测试模型键",
            },
          },
          required: ["agentId", "task", "modelKey"],
        },
      },
      {
        name: "get-agent-performance-stats",
        description: "获取代理性能统计信息",
        inputSchema: {
          type: "object",
          properties: {
            agentId: {
              type: "string",
              description: "代理ID",
            },
          },
          required: ["agentId"],
        },
      },
    ];

    return {
      tools: [
        ...promptOptimizationTools,
        ...builtInToolDefinitions,
        ...builtInAgentDefinitions,
        ...agentLLMTools,
      ],
    };
  });

  // 注册工具调用处理器
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    logger.info(`处理工具调用请求: ${name}`);

    try {
      switch (name) {
        case "optimize-user-prompt": {
          const { prompt, template } = args as {
            prompt?: string;
            template?: string;
          };

          if (!prompt) {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'prompt'"
            );
          }

          // 参数验证
          ParameterValidator.validatePrompt(prompt);
          if (template) {
            ParameterValidator.validateTemplate(template);
          }

          // 调用 Core 服务
          const promptService = coreServices.getPromptService();
          const modelManager = coreServices.getModelManager();
          const templateManager = coreServices.getTemplateManager();

          // 检查 MCP 默认模型是否可用
          const mcpModel = await modelManager.getModel("mcp-default");
          if (!mcpModel || !mcpModel.enabled) {
            throw MCPErrorHandler.createModelConfigurationError(
              "MCP 默认模型未配置或未启用，请检查环境变量配置"
            );
          }

          const templateId =
            template || (await getDefaultTemplateId(templateManager, "user"));
          const result = await promptService.optimizePrompt({
            targetPrompt: prompt,
            modelKey: "mcp-default",
            optimizationMode: "user",
            templateId,
          });

          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        }

        case "optimize-system-prompt": {
          const { prompt, template } = args as {
            prompt?: string;
            template?: string;
          };

          if (!prompt) {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'prompt'"
            );
          }

          // 参数验证
          ParameterValidator.validatePrompt(prompt);
          if (template) {
            ParameterValidator.validateTemplate(template);
          }

          // 调用 Core 服务
          const promptService = coreServices.getPromptService();
          const modelManager = coreServices.getModelManager();
          const templateManager = coreServices.getTemplateManager();

          // 检查 MCP 默认模型是否可用
          const mcpModel = await modelManager.getModel("mcp-default");
          if (!mcpModel || !mcpModel.enabled) {
            throw MCPErrorHandler.createModelConfigurationError(
              "MCP 默认模型未配置或未启用，请检查环境变量配置"
            );
          }

          const templateId =
            template || (await getDefaultTemplateId(templateManager, "system"));
          const result = await promptService.optimizePrompt({
            targetPrompt: prompt,
            modelKey: "mcp-default",
            optimizationMode: "system",
            templateId,
          });

          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        }

        case "iterate-prompt": {
          const { prompt, requirements, template } = args as {
            prompt?: string;
            requirements?: string;
            template?: string;
          };

          if (!prompt) {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'prompt'"
            );
          }

          if (!requirements) {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'requirements'"
            );
          }

          // 参数验证
          ParameterValidator.validatePrompt(prompt);
          ParameterValidator.validateRequirements(requirements);
          if (template) {
            ParameterValidator.validateTemplate(template);
          }

          // 调用 Core 服务
          const promptService = coreServices.getPromptService();
          const modelManager = coreServices.getModelManager();
          const templateManager = coreServices.getTemplateManager();

          // 检查 MCP 默认模型是否可用
          const mcpModel = await modelManager.getModel("mcp-default");
          if (!mcpModel || !mcpModel.enabled) {
            throw MCPErrorHandler.createModelConfigurationError(
              "MCP 默认模型未配置或未启用，请检查环境变量配置"
            );
          }

          const templateId =
            template ||
            (await getDefaultTemplateId(templateManager, "iterate"));
          const result = await promptService.iteratePrompt(
            prompt,
            prompt, // 使用原始提示词作为上次优化的提示词
            requirements,
            "mcp-default",
            templateId
          );

          return {
            content: [
              {
                type: "text",
                text: result,
              },
            ],
          };
        }

        case "generate-content": {
          const { templateId, variables, systemPrompt } = args as {
            templateId?: string;
            variables?: Record<string, any>;
            systemPrompt?: string;
          };

          if (!templateId) {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'templateId'"
            );
          }

          if (!variables || typeof variables !== "object") {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'variables' 或变量格式无效"
            );
          }

          // 调用 Core 服务
          const contentGenerationService =
            coreServices.getContentGenerationService();
          const modelManager = coreServices.getModelManager();

          // 检查 MCP 默认模型是否可用
          const mcpModel = await modelManager.getModel("mcp-default");
          if (!mcpModel || !mcpModel.enabled) {
            throw MCPErrorHandler.createModelConfigurationError(
              "MCP 默认模型未配置或未启用，请检查环境变量配置"
            );
          }

          const result = await contentGenerationService.generateContent({
            templateId,
            variables,
            modelKey: "mcp-default",
            options: {
              systemPrompt: systemPrompt || undefined,
            },
          });

          return {
            content: [
              {
                type: "text",
                text: result.content,
              },
            ],
          };
        }

        case "generate-content-iterative": {
          const {
            templateId,
            variables,
            refinementPrompt,
            maxIterations,
            systemPrompt,
          } = args as {
            templateId?: string;
            variables?: Record<string, any>;
            refinementPrompt?: string;
            maxIterations?: number;
            systemPrompt?: string;
          };

          if (!templateId) {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'templateId'"
            );
          }

          if (!variables || typeof variables !== "object") {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'variables' 或变量格式无效"
            );
          }

          if (!refinementPrompt) {
            throw MCPErrorHandler.createValidationError(
              "缺少必需参数 'refinementPrompt'"
            );
          }

          // 调用 Core 服务
          const contentGenerationService =
            coreServices.getContentGenerationService();
          const modelManager = coreServices.getModelManager();

          // 检查 MCP 默认模型是否可用
          const mcpModel = await modelManager.getModel("mcp-default");
          if (!mcpModel || !mcpModel.enabled) {
            throw MCPErrorHandler.createModelConfigurationError(
              "MCP 默认模型未配置或未启用，请检查环境变量配置"
            );
          }

          const result = await contentGenerationService.generateWithIteration(
            {
              templateId,
              variables,
              modelKey: "mcp-default",
              options: {
                systemPrompt: systemPrompt || undefined,
                iterativeRefinement: true,
                refinementSteps: maxIterations || 3,
              },
            },
            refinementPrompt,
            maxIterations || 3
          );

          const finalContent = result.content;
          const iterationsInfo = result.iterations
            ? `\n\n迭代信息：共进行 ${result.iterations.length} 轮优化`
            : "";

          return {
            content: [
              {
                type: "text",
                text: finalContent + iterationsInfo,
              },
            ],
          };
        }

        default:
          // 检查是否是内置工具
          if (toolRegistry.getTool(name)) {
            const sessionId = randomUUID();
            return await executeTool(
              toolRegistry,
              name,
              args as Record<string, any>,
              sessionId,
              "mcp-server"
            );
          }

          // 检查是否是内置代理
          if (agentRegistry.getAgent(name)) {
            const sessionId = randomUUID();
            const { task, parameters, userId, options } = args as {
              task?: string;
              parameters?: Record<string, any>;
              userId?: string;
              options?: any;
            };

            if (!task) {
              throw MCPErrorHandler.createValidationError(
                "缺少必需参数 'task'"
              );
            }

            return await executeAgent(
              executionManager,
              name,
              task,
              parameters || {},
              sessionId,
              userId,
              options
            );
          }

          throw new Error(`未知工具 '${name}'`);
      }
    } catch (error) {
      logger.error(`工具执行错误 ${name}:`, error as Error);

      // 如果已经是 McpError，直接抛出
      if (error instanceof Error && error.constructor.name === "McpError") {
        throw error;
      }

      // 否则转换为 MCP 错误
      throw MCPErrorHandler.convertCoreError(error as Error);
    }
  });

  logger.info("MCP 工具注册成功");
}

async function main() {
  const config = loadConfig();
  logger.setLogLevel(config.logLevel);

  try {
    // 解析命令行参数
    const args = process.argv.slice(2);
    const transport =
      args.find((arg) => arg.startsWith("--transport="))?.split("=")[1] ||
      "stdio";
    const port = parseInt(
      args.find((arg) => arg.startsWith("--port="))?.split("=")[1] ||
        config.httpPort.toString()
    );

    logger.info("Starting MCP Server for Prompt Optimizer");
    logger.info(`Transport: ${transport}, Port: ${port}`);

    // 初始化 Core 服务（一次性，用于验证配置）
    logger.info("Initializing Core services...");
    const coreServices = CoreServicesManager.getInstance();
    await coreServices.initialize(config);
    logger.info("Core services initialized successfully");

    // 创建服务器实例并设置处理器
    const {
      server,
      toolRegistry,
      agentRegistry,
      llmConfigManager,
      executionManager,
    } = await createServerInstance(config);
    await setupServerHandlers(
      server,
      coreServices,
      toolRegistry,
      agentRegistry,
      llmConfigManager,
      executionManager
    );

    // 启动传输层
    if (transport === "http") {
      logger.info("Starting HTTP server with session management...");
      // 使用 Express 和会话管理支持多客户端连接
      const app = express();
      app.use(express.json());
      logger.info("Express app configured");

      // 存储每个会话的传输实例
      const transports: { [sessionId: string]: StreamableHTTPServerTransport } =
        {};

      // 处理 POST 请求（客户端到服务器通信）
      // Health check endpoint for Docker
      app.get("/health", (req, res) => {
        res.status(200).json({
          status: "healthy",
          service: "mcp-server",
          version: "0.1.0",
          timestamp: new Date().toISOString(),
        });
      });

      app.post("/mcp", async (req, res) => {
        // 检查现有会话ID
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        let httpTransport: StreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
          // 重用现有传输
          httpTransport = transports[sessionId];
        } else if (!sessionId && isInitializeRequest(req.body)) {
          // 新的初始化请求 - 为每个会话创建独立的服务器实例
          httpTransport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sessionId) => {
              // 存储传输实例
              transports[sessionId] = httpTransport;
            },
            // MCP 协议不需要复杂的 CORS 配置，允许所有来源
            allowedOrigins: ["*"],
            enableDnsRebindingProtection: false,
          });

          // 清理传输实例
          httpTransport.onclose = () => {
            if (httpTransport.sessionId) {
              delete transports[httpTransport.sessionId];
            }
          };

          // 为每个会话创建独立的服务器实例
          const {
            server,
            toolRegistry,
            agentRegistry,
            llmConfigManager,
            executionManager,
          } = await createServerInstance(config);
          await setupServerHandlers(
            server,
            coreServices,
            toolRegistry,
            agentRegistry,
            llmConfigManager,
            executionManager
          );

          // 连接到 MCP 服务器
          await server.connect(httpTransport);
        } else {
          // 无效请求
          res.status(400).json({
            jsonrpc: "2.0",
            error: {
              code: MCP_ERROR_CODES.INVALID_REQUEST,
              message: "Bad Request: No valid session ID provided",
            },
            id: null,
          });
          return;
        }

        // 处理请求
        await httpTransport.handleRequest(req, res, req.body);
      });

      // 处理 GET 请求（服务器到客户端通知，通过 SSE）
      app.get("/mcp", async (req, res) => {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (!sessionId || !transports[sessionId]) {
          res.status(400).send("Invalid or missing session ID");
          return;
        }

        const httpTransport = transports[sessionId];
        await httpTransport.handleRequest(req, res);
      });

      // 处理 DELETE 请求（会话终止）
      app.delete("/mcp", async (req, res) => {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (!sessionId || !transports[sessionId]) {
          res.status(400).send("Invalid or missing session ID");
          return;
        }

        const httpTransport = transports[sessionId];
        await httpTransport.handleRequest(req, res);
      });

      logger.info("Setting up HTTP server listener...");
      app.listen(port, () => {
        logger.info(
          `MCP Server running on HTTP port ${port} with session management`
        );
      });
      logger.info("HTTP server setup completed");
    } else {
      // stdio 模式 - 使用已创建的服务器实例
      const stdioTransport = new StdioServerTransport();
      await server.connect(stdioTransport);
      logger.info("MCP Server running on stdio");
    }
  } catch (error) {
    // 确保错误信息始终显示，即使没有启用 DEBUG
    console.error("❌ MCP Server startup failed:");
    console.error("   ", (error as Error).message);

    // 同时使用 debug 库记录详细信息
    logger.error("Failed to start MCP Server", error as Error);

    process.exit(1);
  }
}

// 处理未捕获的异常
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// 优雅关闭
process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

// 导出 main 函数供外部调用
export { main };

// 创建一个单独的启动文件，避免在构建时执行
