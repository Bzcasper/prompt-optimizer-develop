<!-- @format -->

# Prompt Optimizer MCP Server

A Model Context Protocol (MCP) server that provides prompt optimization and content generation capabilities.

## Features

```bash
pnpm install
```

## Configuration

- **Prompt Optimization**: Optimize user and system prompts for better AI interactions
- **Iterative Improvement**: Refine existing prompts based on specific requirements
- **Content Generation**: Generate various types of content using professional templates
- **Multi-Model Support**: Works with various AI models (OpenAI, Gemini, DeepSeek, etc.)
- **Template System**: Pre-built templates for different optimization scenarios

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Local Installation

```bash
# Clone the repository
git clone <repository-url>
cd prompt-optimizer-develop

# Install dependencies
pnpm install
```

### Global Installation

The MCP server can be installed globally as a CLI tool:

```bash
# Install globally from the project directory
cd prompt-optimizer-develop
pnpm install -g @prompt-optimizer/mcp-server

# Or install from npm registry (when published)
npm install -g @prompt-optimizer/mcp-server
```

After global installation, you can use the `prompt-optimizer-mcp` command from anywhere:

```bash
# Run the MCP server globally
prompt-optimizer-mcp

# Run with HTTP transport
prompt-optimizer-mcp --transport=http --port=3000
```

## Configuration

### Environment Variables

#### Local Development

The MCP server requires API keys for the AI models you want to use. Create a `.env` file in the project root:

The MCP server requires API keys for the AI models you want to use. Create a `.env` file in the project root:

```bash
# OpenAI
VITE_OPENAI_API_KEY=your_openai_api_key

# Gemini
VITE_GEMINI_API_KEY=your_gemini_api_key

# DeepSeek
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key

# SiliconFlow
VITE_SILICONFLOW_API_KEY=your_siliconflow_api_key

# Zhipu AI
VITE_ZHIPU_API_KEY=your_zhipu_api_key

# Custom API
VITE_CUSTOM_API_KEY=your_custom_api_key
VITE_CUSTOM_API_BASE_URL=https://your-api-endpoint.com/v1
VITE_CUSTOM_API_MODEL=your_model_name
```

#### Global CLI Configuration

When using the globally installed CLI, you need to configure environment variables in one of the following locations:

**Unix/macOS:**
- `~/.prompt-optimizer.env`
- `~/.config/prompt-optimizer/.env`

**Windows:**
- `%USERPROFILE%\.prompt-optimizer.env`
- `%APPDATA%\prompt-optimizer\.env`

You can copy the template from `packages/mcp-server/global-config-template.env`:

```bash
# Copy the template to your home directory
cp packages/mcp-server/global-config-template.env ~/.prompt-optimizer.env

# Edit the file with your API keys
nano ~/.prompt-optimizer.env
```

Example global configuration:
```bash
# OpenAI
MCP_OPENAI_API_KEY=your_openai_api_key

# Gemini
MCP_GEMINI_API_KEY=your_gemini_api_key

# Server settings
MCP_DEFAULT_MODEL_PROVIDER=openai
MCP_HTTP_PORT=3000
MCP_LOG_LEVEL=info
```

### Custom Models

You can configure additional custom models using environment variables with the pattern `VITE_CUSTOM_API_KEY_{MODEL_NAME}`:

```bash
# Qwen model
VITE_CUSTOM_API_KEY_qwen=your_qwen_api_key
VITE_CUSTOM_API_BASE_URL_qwen=https://dashscope.aliyuncs.com/compatible-mode/v1
VITE_CUSTOM_API_MODEL_qwen=qwen-turbo

# Claude model
VITE_CUSTOM_API_KEY_claude=your_claude_api_key
VITE_CUSTOM_API_BASE_URL_claude=https://api.anthropic.com/v1
VITE_CUSTOM_API_MODEL_claude=claude-3-sonnet-20240229
```

## Usage

### Running the Server

#### Development Mode

```bash
pnpm run dev
```

#### Production Mode

```bash
pnpm start
```

### HTTP Server Mode

For HTTP transport (useful for Docker):

```bash
pnpm run dev -- --transport=http --port=3000
```

### Available Tools

#### 1. optimize-user-prompt

Optimize user prompts for better AI interactions.

**Parameters:**

- `prompt` (required): The user prompt to optimize
- `template` (optional): Optimization template ID

**Example:**

```json
{
  "name": "optimize-user-prompt",
  "arguments": {
    "prompt": "帮我写个文章",
    "template": "user-prompt-basic"
  }
}
```

#### 2. optimize-system-prompt

Optimize system prompts for better AI role definition and behavior control.

**Parameters:**

- `prompt` (required): The system prompt to optimize
- `template` (optional): Optimization template ID

**Example:**

```json
{
  "name": "optimize-system-prompt",
  "arguments": {
    "prompt": "你是一个助手",
    "template": "system-prompt-basic"
  }
}
```

#### 3. iterate-prompt

Iteratively improve an existing prompt based on specific requirements.

**Parameters:**

- `prompt` (required): The existing prompt to improve
- `requirements` (required): Specific improvement requirements
- `template` (optional): Iteration template ID

**Example:**

```json
{
  "name": "iterate-prompt",
  "arguments": {
    "prompt": "写一篇关于人工智能的文章",
    "requirements": "使语言更专业，增加技术细节",
    "template": "iterate-basic"
  }
}
```

#### 4. generate-content

Generate content using professional templates.

**Parameters:**

- `templateId` (required): Content generation template ID
- `variables` (required): Template variables
- `systemPrompt` (optional): Custom system prompt

**Example:**

```json
{
  "name": "generate-content",
  "arguments": {
    "templateId": "article-writer",
    "variables": {
      "topic": "人工智能",
      "audience": "技术人员",
      "wordCount": 1500
    }
  }
}
```

#### 5. generate-content-iterative

Generate content through iterative refinement.

**Parameters:**

- `templateId` (required): Content generation template ID
- `variables` (required): Template variables
- `refinementPrompt` (required): Refinement instructions
- `maxIterations` (optional): Maximum refinement iterations (default: 3)
- `systemPrompt` (optional): Custom system prompt

**Example:**

```json
{
  "name": "generate-content-iterative",
  "arguments": {
    "templateId": "article-writer",
    "variables": {
      "topic": "人工智能",
      "audience": "技术人员",
      "wordCount": 1500
    },
    "refinementPrompt": "使语言更专业，增加更多技术细节",
    "maxIterations": 3
  }
}
```

## Available Templates

### Prompt Optimization Templates

#### User Prompt Templates

- `user-prompt-basic`: Basic user prompt optimization
- `user-prompt-context-aware`: Context-aware user prompt optimization
- `user-prompt-detailed`: Detailed user prompt optimization

#### System Prompt Templates

- `system-prompt-basic`: Basic system prompt optimization
- `system-prompt-role-focused`: Role-focused system prompt optimization
- `system-prompt-comprehensive`: Comprehensive system prompt optimization

#### Iteration Templates

- `iterate-basic`: Basic prompt iteration
- `iterate-context-aware`: Context-aware prompt iteration
- `iterate-output-format`: Output format focused iteration

### Content Generation Templates

- `article-writer`: Article writing template
- `marketing-copy`: Marketing copy template
- `technical-documentation`: Technical documentation template
- `social-media-post`: Social media post template
- `email-newsletter`: Email newsletter template

## Docker Usage

### Using Docker Compose

```bash
# Start the MCP server
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the server
docker-compose down
```

### Using Docker Directly

```bash
# Build the image
docker build -t prompt-optimizer-mcp-server .

# Run the container
docker run -d \
  --name mcp-server \
  -p 3000:3000 \
  -e VITE_OPENAI_API_KEY=your_api_key \
  prompt-optimizer-mcp-server
```

### Environment Configuration for Docker

You can use the provided `.env.multi-agent.example` file as a template for Docker configuration:

```bash
# Copy the example file
cp .env.multi-agent.example .env.multi-agent

# Edit the file with your API keys
nano .env.multi-agent

# Start with Docker Compose
docker-compose -f docker-compose.multi-agent.yml up -d
```

## MCP Client Integration

### Claude Desktop App

Add the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "prompt-optimizer": {
      "command": "node",
      "args": ["/path/to/prompt-optimizer/packages/mcp-server/dist/index.js"],
      "env": {
        "VITE_OPENAI_API_KEY": "your_openai_api_key",
        "VITE_GEMINI_API_KEY": "your_gemini_api_key"
      }
    }
  }
}
```

### HTTP Client

For HTTP transport, send requests to:

```
POST http://localhost:3000/mcp
Content-Type: application/json
MCP-Session-ID: your-session-id
```

## Error Handling

The MCP server provides detailed error information with specific error codes:

- `-32000`: Internal error
- `-32001`: Prompt optimization failed
- `-32002`: Model not configured
- `-32003`: Template not found
- `-32004`: Content generation failed
- `-32005`: Rate limit exceeded
- `-32006`: Network error
- `-32007`: Validation error

## Development

### Building the Project

```bash
# Build the TypeScript project
pnpm run build

# Run tests
pnpm test

# Run linting
pnpm lint
```

### Project Structure

```
packages/mcp-server/
├── src/
│   ├── adapters/          # Core service adapters
│   ├── config/           # Configuration management
│   ├── utils/            # Utility functions
│   └── index.ts          # Main server file
├── dist/                 # Compiled JavaScript output
├── package.json          # Package configuration
└── README.md            # This file
```

## Troubleshooting

### Common Issues

1. **Model Configuration Errors**

   - Ensure API keys are correctly set in environment variables
   - Verify the model is enabled in the configuration

2. **Template Not Found**

   - Check if the template ID is correct
   - Verify the template is available in the template manager

3. **Network Errors**

   - Check your internet connection
   - Verify API endpoints are accessible

4. **Rate Limiting**
   - Wait for the rate limit to reset
   - Consider using multiple API keys

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=mcp-server:* pnpm run dev
```

## Global CLI Troubleshooting

### Common Global Installation Issues

1. **Environment Variables Not Loading**

   If the global CLI doesn't load your environment variables:

   ```bash
   # Check if the global config file exists
   ls -la ~/.prompt-optimizer.env
   
   # Or check the config directory
   ls -la ~/.config/prompt-optimizer/.env
   ```

   Ensure the configuration file is in the correct location and contains valid API keys.

2. **Command Not Found**

   If `prompt-optimizer-mcp` command is not found:

   ```bash
   # Check if the package is installed globally
   npm list -g @prompt-optimizer/mcp-server
   
   # If not installed, install it globally
   pnpm install -g @prompt-optimizer/mcp-server
   ```

3. **Permission Issues**

   If you encounter permission errors:

   ```bash
   # Install with correct permissions
   pnpm install -g @prompt-optimizer/mcp-server --unsafe-perm=true
   ```

4. **Global vs Local Conflicts**

   If you have both local and global installations, the global installation takes precedence when running from outside the project directory.

5. **Checking Global Installation Status**

   To verify your global installation is working:

   ```bash
   # Check if the CLI is properly installed
   prompt-optimizer-mcp --version
   
   # Test environment variable loading
   prompt-optimizer-mcp --transport=http --port=3000
   ```

### Global Configuration File Locations

The global CLI looks for configuration files in the following order:

1. Current working directory: `.env.local`, `.env`
2. User's home directory: `~/.prompt-optimizer.env`, `~/.prompt-optimizer.env.local`
3. User config directory: `~/.config/prompt-optimizer/.env`, `~/.config/prompt-optimizer/.env.local`
4. System config directory: `/etc/prompt-optimizer/.env` (Linux/macOS)
5. Windows app data: `%APPDATA%\prompt-optimizer\.env` (Windows)

## License

This project is licensed under the MIT License.
