/**
 * Specialized Agents using Google ADK
 * Advanced agents for different tasks powered by Google's Agent Development Kit
 */

import {
  AgentDefinition,
  AgentHandler,
  AgentExecutionContext,
  AgentExecutionResult,
  AgentCapabilities
} from '../agent/types';
import {
  GoogleADKAgentHandler,
  GoogleADKConfig,
  createGoogleADKAgentDefinition,
  GoogleADKPresets
} from '../google-adk';

/**
 * Advanced Content Creation Agent
 */
export class ContentCreationAgent extends GoogleADKAgentHandler {
  constructor(config: GoogleADKConfig) {
    super(config);
  }

  async execute(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      console.log(`📝 Content Creation Agent executing task: ${context.task}`);

      // Simulate Google ADK content creation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));

      const { task, parameters } = context;
      let content = '';

      switch (task) {
        case 'blog-post':
          content = this.generateBlogPost(parameters);
          break;
        case 'social-media':
          content = this.generateSocialMediaContent(parameters);
          break;
        case 'marketing-copy':
          content = this.generateMarketingCopy(parameters);
          break;
        case 'technical-documentation':
          content = this.generateTechnicalDocumentation(parameters);
          break;
        default:
          content = this.generateGenericContent(parameters);
      }

      const result = {
        content,
        metadata: {
          wordCount: content.split(' ').length,
          readingTime: Math.ceil(content.split(' ').length / 200),
          seoScore: Math.floor(Math.random() * 30 + 70),
          tone: parameters.tone || 'professional',
          targetAudience: parameters.targetAudience || 'general'
        }
      };

      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime,
        cost: this.calculateCost(content.length),
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: context.tools || [],
          tokensUsed: Math.floor(content.length / 4)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        cost: 0,
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: []
        }
      };
    }
  }

  private generateBlogPost(params: any): string {
    return `# ${params.title || 'The Future of AI'}

## Introduction
In today's rapidly evolving technological landscape, artificial intelligence continues to reshape how we approach complex problems and create innovative solutions.

## Main Content
The integration of AI into various sectors has demonstrated remarkable improvements in efficiency, accuracy, and scalability. From healthcare to finance, education to manufacturing, AI technologies are enabling unprecedented levels of automation and intelligence.

## Key Insights
1. **Adoption Trends**: Organizations are increasingly adopting AI solutions to stay competitive.
2. **Technological Advancements**: Breakthroughs in machine learning and natural language processing are expanding AI capabilities.
3. **Future Implications**: The continued development of AI will likely transform job markets and create new opportunities.

## Conclusion
As we look to the future, it's clear that AI will play an increasingly central role in shaping our world. Organizations and individuals who embrace these technologies will be well-positioned to thrive in the coming decades.`;
  }

  private generateSocialMediaContent(params: any): string {
    const platform = params.platform || 'twitter';
    const topic = params.topic || 'AI innovation';
    
    if (platform === 'twitter') {
      return `🚀 Exciting developments in ${topic}! The latest advancements are opening up new possibilities we never thought possible. What are your thoughts on these innovations? #AI #Innovation #Tech`;
    } else if (platform === 'linkedin') {
      return `The landscape of ${topic} is undergoing a significant transformation. Recent developments in AI and machine learning are creating unprecedented opportunities for businesses and individuals alike.

Key takeaways:
• Enhanced efficiency and productivity
• Improved decision-making capabilities
• New avenues for innovation and growth

I'm curious to hear how others in my network are leveraging these advancements in their respective fields.

#AI #Technology #BusinessInnovation`;
    }
    
    return `Engaging content about ${topic} tailored for ${platform}.`;
  }

  private generateMarketingCopy(params: any): string {
    return `🌟 Transform Your Business with AI-Powered Solutions 🌟

Are you ready to take your organization to the next level? Our cutting-edge AI technologies deliver:

✅ Unprecedented efficiency gains
✅ Data-driven decision making
✅ Scalable automation solutions
✅ Competitive advantage in your market

Don't get left behind in the digital revolution. Partner with us to unlock the full potential of AI for your business.

📞 Contact us today for a free consultation!
🌐 Visit our website to learn more

#AI #BusinessTransformation #Innovation`;
  }

  private generateTechnicalDocumentation(params: any): string {
    return `# API Documentation

## Overview
This API provides access to advanced AI-powered features for content generation, analysis, and processing.

## Authentication
All API requests require authentication using an API key in the Authorization header:

\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints

### POST /generate/content
Generate content based on specified parameters.

**Request Body:**
\`\`\`json
{
  "type": "blog-post",
  "topic": "AI technology",
  "tone": "professional",
  "wordCount": 1000
}
\`\`\`

**Response:**
\`\`\`json
{
  "content": "Generated content...",
  "metadata": {
    "wordCount": 1000,
    "readingTime": 5,
    "seoScore": 85
  }
}
\`\`\`

## Rate Limits
- Free tier: 100 requests per day
- Pro tier: 1000 requests per day
- Enterprise tier: Custom limits

## Error Handling
The API uses standard HTTP status codes and returns error information in JSON format.

\`\`\`json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The specified parameter is invalid"
  }
}
\`\`\``;
  }

  private generateGenericContent(params: any): string {
    return `This is high-quality content generated by our AI system based on your parameters. The content is tailored to your specific needs and requirements, ensuring relevance and value for your target audience.`;
  }

  validateTask(task: string, parameters: Record<string, any>): boolean {
    const validTasks = [
      'blog-post',
      'social-media',
      'marketing-copy',
      'technical-documentation',
      'generic-content'
    ];
    return validTasks.includes(task) && typeof parameters === 'object';
  }

  getCapabilities(): AgentCapabilities {
    return {
      supportsMultiStep: true,
      supportsCollaboration: false,
      supportsToolUse: true,
      maxSteps: 5,
      supportedTaskTypes: [
        'blog-post',
        'social-media',
        'marketing-copy',
        'technical-documentation',
        'generic-content'
      ],
      requiresSetup: true,
      supportsMemory: true
    };
  }
}

/**
 * Advanced Data Analysis Agent
 */
export class DataAnalysisAgent extends GoogleADKAgentHandler {
  constructor(config: GoogleADKConfig) {
    super(config);
  }

  async execute(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      console.log(`📊 Data Analysis Agent executing task: ${context.task}`);

      // Simulate Google ADK data analysis
      await new Promise(resolve => setTimeout(resolve, Math.random() * 4000 + 2000));

      const { task, parameters } = context;
      let analysisResult = {};

      switch (task) {
        case 'statistical-analysis':
          analysisResult = this.performStatisticalAnalysis(parameters);
          break;
        case 'predictive-modeling':
          analysisResult = this.performPredictiveModeling(parameters);
          break;
        case 'data-visualization':
          analysisResult = this.createDataVisualization(parameters);
          break;
        case 'anomaly-detection':
          analysisResult = this.detectAnomalies(parameters);
          break;
        default:
          analysisResult = this.performGenericAnalysis(parameters);
      }

      return {
        success: true,
        data: analysisResult,
        executionTime: Date.now() - startTime,
        cost: this.calculateCost(JSON.stringify(analysisResult).length),
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: context.tools || [],
          tokensUsed: Math.floor(JSON.stringify(analysisResult).length / 4)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        cost: 0,
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: []
        }
      };
    }
  }

  private performStatisticalAnalysis(params: any): any {
    return {
      analysisType: 'statistical',
      summary: {
        mean: 75.5,
        median: 72.0,
        mode: 68.0,
        standardDeviation: 12.3,
        variance: 151.29,
        range: 45.0,
        min: 45.0,
        max: 90.0
      },
      distribution: {
        type: 'normal',
        skewness: 0.2,
        kurtosis: -0.1
      },
      correlations: {
        featureA: 0.85,
        featureB: -0.32,
        featureC: 0.67
      },
      insights: [
        'The data follows a roughly normal distribution',
        'Strong positive correlation between featureA and target variable',
        'Outliers detected in approximately 5% of the data'
      ]
    };
  }

  private performPredictiveModeling(params: any): any {
    return {
      modelType: 'gradient-boosting',
      performance: {
        accuracy: 0.92,
        precision: 0.89,
        recall: 0.94,
        f1Score: 0.91,
        rocAuc: 0.96
      },
      featureImportance: [
        { feature: 'age', importance: 0.35 },
        { feature: 'income', importance: 0.28 },
        { feature: 'education', importance: 0.18 },
        { feature: 'location', importance: 0.12 },
        { feature: 'gender', importance: 0.07 }
      ],
      predictions: {
        sampleSize: 1000,
        positivePredictions: 320,
        negativePredictions: 680,
        confidenceInterval: [0.88, 0.95]
      },
      recommendations: [
        'Focus on age and income features for model improvement',
        'Consider collecting more data on education level',
        'Implement model retraining quarterly'
      ]
    };
  }

  private createDataVisualization(params: any): any {
    return {
      visualizationType: 'interactive-dashboard',
      components: [
        {
          type: 'line-chart',
          title: 'Trend Analysis',
          dataPoints: 24,
          metrics: ['revenue', 'users', 'conversion']
        },
        {
          type: 'bar-chart',
          title: 'Category Comparison',
          categories: ['A', 'B', 'C', 'D'],
          values: [45, 32, 28, 15]
        },
        {
          type: 'pie-chart',
          title: 'Distribution',
          segments: [
            { label: 'Segment 1', value: 35 },
            { label: 'Segment 2', value: 25 },
            { label: 'Segment 3', value: 20 },
            { label: 'Segment 4', value: 20 }
          ]
        }
      ],
      insights: [
        'Revenue shows consistent upward trend',
        'Category A significantly outperforms others',
        'Distribution remains relatively stable'
      ]
    };
  }

  private detectAnomalies(params: any): any {
    return {
      detectionMethod: 'isolation-forest',
      totalDataPoints: 10000,
      anomaliesDetected: 127,
      anomalyRate: 0.0127,
      severity: {
        critical: 5,
        high: 23,
        medium: 45,
        low: 54
      },
      patterns: [
        {
          pattern: 'spike-detection',
          frequency: 'weekly',
          confidence: 0.87
        },
        {
          pattern: 'seasonal-variation',
          frequency: 'monthly',
          confidence: 0.92
        }
      ],
      recommendations: [
        'Investigate critical anomalies immediately',
        'Implement real-time monitoring for spike patterns',
        'Consider seasonal adjustments in forecasting'
      ]
    };
  }

  private performGenericAnalysis(params: any): any {
    return {
      analysisType: 'generic',
      dataQuality: {
        completeness: 0.95,
        accuracy: 0.92,
        consistency: 0.89,
        timeliness: 0.97
      },
      summary: 'Data analysis completed successfully',
      nextSteps: [
        'Clean and preprocess data',
        'Perform exploratory data analysis',
        'Select appropriate modeling techniques'
      ]
    };
  }

  validateTask(task: string, parameters: Record<string, any>): boolean {
    const validTasks = [
      'statistical-analysis',
      'predictive-modeling',
      'data-visualization',
      'anomaly-detection',
      'generic-analysis'
    ];
    return validTasks.includes(task) && typeof parameters === 'object';
  }

  getCapabilities(): AgentCapabilities {
    return {
      supportsMultiStep: true,
      supportsCollaboration: true,
      supportsToolUse: true,
      maxSteps: 8,
      supportedTaskTypes: [
        'statistical-analysis',
        'predictive-modeling',
        'data-visualization',
        'anomaly-detection',
        'generic-analysis'
      ],
      requiresSetup: true,
      supportsMemory: true
    };
  }
}

/**
 * Advanced Code Generation Agent
 */
export class CodeGenerationAgent extends GoogleADKAgentHandler {
  constructor(config: GoogleADKConfig) {
    super(config);
  }

  async execute(context: AgentExecutionContext): Promise<AgentExecutionResult> {
    const startTime = Date.now();

    try {
      console.log(`💻 Code Generation Agent executing task: ${context.task}`);

      // Simulate Google ADK code generation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));

      const { task, parameters } = context;
      let codeResult = {};

      switch (task) {
        case 'function-generation':
          codeResult = this.generateFunction(parameters);
          break;
        case 'class-generation':
          codeResult = this.generateClass(parameters);
          break;
        case 'api-endpoint':
          codeResult = this.generateAPIEndpoint(parameters);
          break;
        case 'database-query':
          codeResult = this.generateDatabaseQuery(parameters);
          break;
        case 'test-generation':
          codeResult = this.generateTests(parameters);
          break;
        default:
          codeResult = this.generateGenericCode(parameters);
      }

      return {
        success: true,
        data: codeResult,
        executionTime: Date.now() - startTime,
        cost: this.calculateCost(JSON.stringify(codeResult).length),
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: context.tools || [],
          tokensUsed: Math.floor(JSON.stringify(codeResult).length / 4)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        cost: 0,
        metadata: {
          agentId: context.agentId,
          sessionId: context.sessionId,
          userId: context.userId,
          timestamp: Date.now(),
          toolsUsed: []
        }
      };
    }
  }

  private generateFunction(params: any): any {
    const language = params.language || 'javascript';
    const functionality = params.functionality || 'data processing';

    if (language === 'javascript') {
      return {
        code: `/**
 * ${functionality} function
 * @param {any} data - Input data to process
 * @returns {any} Processed data
 */
function processData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input data');
  }

  try {
    // Process the data
    const result = {
      ...data,
      processed: true,
      timestamp: new Date().toISOString()
    };

    return result;
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
}

// Export the function
module.exports = processData;`,
        language: 'javascript',
        dependencies: [],
        testable: true
      };
    } else if (language === 'python') {
      return {
        code: `def process_data(data):
    \"\"\"
    ${functionality} function
    
    Args:
        data (dict): Input data to process
        
    Returns:
        dict: Processed data
        
    Raises:
        ValueError: If input data is invalid
    \"\"\"
    if not data or not isinstance(data, dict):
        raise ValueError("Invalid input data")
    
    try:
        # Process the data
        result = {
            **data,
            "processed": True,
            "timestamp": datetime.datetime.now().isoformat()
        }
        
        return result
    except Exception as error:
        print(f"Error processing data: {error}")
        raise error`,
        language: 'python',
        dependencies: ['datetime'],
        testable: true
      };
    }

    return {
      code: `// Function for ${functionality} in ${language}`,
      language,
      dependencies: [],
      testable: true
    };
  }

  private generateClass(params: any): any {
    const language = params.language || 'javascript';
    const className = params.className || 'DataProcessor';

    if (language === 'javascript') {
      return {
        code: `/**
 * ${className} class for data processing
 */
class ${className} {
  constructor(config = {}) {
    this.config = {
      debug: false,
      ...config
    };
    this.data = null;
  }

  /**
   * Load data into the processor
   * @param {any} data - Data to load
   */
  loadData(data) {
    if (!data) {
      throw new Error('Data cannot be null or undefined');
    }
    this.data = data;
    
    if (this.config.debug) {
      console.log('Data loaded successfully');
    }
  }

  /**
   * Process the loaded data
   * @returns {any} Processed data
   */
  process() {
    if (!this.data) {
      throw new Error('No data loaded. Call loadData() first.');
    }

    const processed = {
      ...this.data,
      processed: true,
      processedAt: new Date().toISOString()
    };

    return processed;
  }

  /**
   * Get the current data
   * @returns {any} Current data
   */
  getData() {
    return this.data;
  }
}

// Export the class
module.exports = ${className};`,
        language: 'javascript',
        dependencies: [],
        testable: true
      };
    }

    return {
      code: `// Class ${className} in ${language}`,
      language,
      dependencies: [],
      testable: true
    };
  }

  private generateAPIEndpoint(params: any): any {
    const framework = params.framework || 'express';
    const endpoint = params.endpoint || '/api/data';

    if (framework === 'express') {
      return {
        code: `/**
 * ${endpoint} API endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.${endpoint.includes(':id') ? 'get' : 'post'}('${endpoint}', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Validate input
    if (!data) {
      return res.status(400).json({
        error: 'Data is required'
      });
    }

    // Process the data
    const processed = {
      ...data,
      processed: true,
      processedAt: new Date().toISOString()
    };

    // Return success response
    res.json({
      success: true,
      data: processed
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});`,
        language: 'javascript',
        framework: 'express',
        dependencies: ['express'],
        testable: true
      };
    }

    return {
      code: `// API endpoint for ${endpoint} using ${framework}`,
      language: 'javascript',
      framework,
      dependencies: [],
      testable: true
    };
  }

  private generateDatabaseQuery(params: any): any {
    const database = params.database || 'sql';
    const operation = params.operation || 'select';

    if (database === 'sql') {
      return {
        code: `-- ${operation} query for user data
SELECT 
  u.id,
  u.username,
  u.email,
  p.profile_data,
  COUNT(o.id) as order_count
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND u.created_at >= '2024-01-01'
GROUP BY u.id, u.username, u.email, p.profile_data
ORDER BY order_count DESC
LIMIT 100;`,
        language: 'sql',
        database: 'sql',
        operation: 'select',
        testable: true
      };
    }

    return {
      code: `// Database ${operation} query for ${database}`,
      language: 'sql',
      database,
      operation,
      testable: true
    };
  }

  private generateTests(params: any): any {
    const framework = params.framework || 'jest';
    const target = params.target || 'function';

    if (framework === 'jest') {
      return {
        code: `const { processData } = require('./dataProcessor');

describe('processData', () => {
  test('should process valid data correctly', () => {
    const inputData = {
      name: 'Test',
      value: 100
    };
    
    const result = processData(inputData);
    
    expect(result).toEqual({
      name: 'Test',
      value: 100,
      processed: true,
      timestamp: expect.any(String)
    });
  });

  test('should throw error for invalid data', () => {
    const invalidData = null;
    
    expect(() => {
      processData(invalidData);
    }).toThrow('Invalid input data');
  });

  test('should add timestamp to processed data', () => {
    const inputData = { test: true };
    const result = processData(inputData);
    
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });
});`,
        language: 'javascript',
        framework: 'jest',
        target,
        testable: false
      };
    }

    return {
      code: `// Tests for ${target} using ${framework}`,
      language: 'javascript',
      framework,
      target,
      testable: false
    };
  }

  private generateGenericCode(params: any): any {
    return {
      code: `// Generated code based on parameters: ${JSON.stringify(params)}`,
      language: 'javascript',
      dependencies: [],
      testable: true
    };
  }

  validateTask(task: string, parameters: Record<string, any>): boolean {
    const validTasks = [
      'function-generation',
      'class-generation',
      'api-endpoint',
      'database-query',
      'test-generation',
      'generic-code'
    ];
    return validTasks.includes(task) && typeof parameters === 'object';
  }

  getCapabilities(): AgentCapabilities {
    return {
      supportsMultiStep: true,
      supportsCollaboration: true,
      supportsToolUse: true,
      maxSteps: 6,
      supportedTaskTypes: [
        'function-generation',
        'class-generation',
        'api-endpoint',
        'database-query',
        'test-generation',
        'generic-code'
      ],
      requiresSetup: true,
      supportsMemory: true
    };
  }
}

/**
 * Factory functions for creating specialized Google ADK agents
 */
export class SpecializedGoogleADKAgents {
  static createContentCreationAgent(projectId: string, location: string): {
    definition: AgentDefinition;
    handler: AgentHandler;
    tools: string[];
  } {
    const config = GoogleADKPresets.creativeAgent(projectId, location);
    config.agentId = 'content-creation-agent';
    
    const definition = createGoogleADKAgentDefinition(config, [
      'content-creation',
      'writing',
      'blogging',
      'social-media',
      'marketing'
    ]);
    
    definition.description = 'Specialized agent for creating high-quality content across various formats and platforms';
    definition.specialization = ['content-creation', 'writing', 'creative'];
    
    const handler = new ContentCreationAgent(config);
    
    return {
      definition,
      handler,
      tools: ['data-analysis', 'file-read', 'file-write']
    };
  }

  static createDataAnalysisAgent(projectId: string, location: string): {
    definition: AgentDefinition;
    handler: AgentHandler;
    tools: string[];
  } {
    const config = GoogleADKPresets.analysisAgent(projectId, location);
    config.agentId = 'data-analysis-agent';
    
    const definition = createGoogleADKAgentDefinition(config, [
      'data-analysis',
      'statistics',
      'machine-learning',
      'visualization',
      'anomaly-detection'
    ]);
    
    definition.description = 'Advanced agent for comprehensive data analysis, statistical modeling, and insights generation';
    definition.specialization = ['data-analysis', 'statistics', 'machine-learning'];
    
    const handler = new DataAnalysisAgent(config);
    
    return {
      definition,
      handler,
      tools: ['data-analysis', 'file-read', 'visualization', 'advanced-data-processing']
    };
  }

  static createCodeGenerationAgent(projectId: string, location: string): {
    definition: AgentDefinition;
    handler: AgentHandler;
    tools: string[];
  } {
    const config = GoogleADKPresets.codeAgent(projectId, location);
    config.agentId = 'code-generation-agent';
    
    const definition = createGoogleADKAgentDefinition(config, [
      'code-generation',
      'function-creation',
      'class-design',
      'api-development',
      'test-generation'
    ]);
    
    definition.description = 'Specialized agent for generating high-quality code across multiple programming languages and frameworks';
    definition.specialization = ['code-generation', 'software-development', 'programming'];
    
    const handler = new CodeGenerationAgent(config);
    
    return {
      definition,
      handler,
      tools: ['file-read', 'file-write', 'code-execution', 'data-analysis']
    };
  }

  static registerAllSpecializedAgents(registry: any, projectId: string, location: string): void {
    console.log('🤖 Registering specialized Google ADK agents...');

    try {
      // Register Content Creation Agent
      const contentAgent = this.createContentCreationAgent(projectId, location);
      registry.registerAgent(
        contentAgent.definition,
        contentAgent.handler,
        contentAgent.tools
      );
      console.log('✅ Content Creation Agent registered');

      // Register Data Analysis Agent
      const analysisAgent = this.createDataAnalysisAgent(projectId, location);
      registry.registerAgent(
        analysisAgent.definition,
        analysisAgent.handler,
        analysisAgent.tools
      );
      console.log('✅ Data Analysis Agent registered');

      // Register Code Generation Agent
      const codeAgent = this.createCodeGenerationAgent(projectId, location);
      registry.registerAgent(
        codeAgent.definition,
        codeAgent.handler,
        codeAgent.tools
      );
      console.log('✅ Code Generation Agent registered');

      console.log('🎉 All specialized Google ADK agents registered successfully');
    } catch (error) {
      console.error('❌ Failed to register specialized Google ADK agents:', error);
      throw error;
    }
  }
}