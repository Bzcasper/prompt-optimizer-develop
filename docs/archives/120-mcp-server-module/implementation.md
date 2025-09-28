# MCP Server Module Technical Implementation Details

## 🔧 Architecture Design

### Overall Architecture
The MCP Server module adopts a layered architecture design to ensure decoupling from the Core module:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MCP Client    │    │   MCP Client    │    │   MCP Client    │
│ (Claude Desktop)│    │ (MCP Inspector) │    │   (Custom App)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │ MCP Protocol
          ┌────────────────────────────────────────────────┐
          │              MCP Server                        │
          │  ┌─────────────────────────────────────────┐   │
          │  │           Transport Layer               │   │
          │  │  ┌─────────────┐  ┌─────────────────┐   │   │
          │  │  │    stdio    │  │ Streamable HTTP │   │   │
          │  │  └─────────────┘  └─────────────────┘   │   │
          │  └─────────────────────────────────────────┘   │
          │  ┌─────────────────────────────────────────┐   │
          │  │           MCP Protocol Layer            │   │
          │  │            ┌─────────┐                  │   │
          │  │            │  Tools  │                  │   │
          │  │            └─────────┘                  │   │
          │  └─────────────────────────────────────────┘   │
          │  ┌─────────────────────────────────────────┐   │
          │  │         Service Adapter Layer           │   │
          │  └─────────────────────────────────────────┘   │
          └────────────────────┬───────────────────────────┘
                               │
          ┌────────────────────────────────────────────────┐
          │              Core Module                       │
          │  ┌─────────────┐ ┌─────────────┐ ┌──────────┐  │
          │  │PromptService│ │ LLMService  │ │ Template │  │
          │  └─────────────┘ └─────────────┘ │ Manager  │  │
          │  ┌─────────────┐ ┌─────────────┐ └──────────┘  │
          │  │HistoryMgr   │ │ ModelMgr    │ ┌──────────┐  │
          │  └─────────────┘ └─────────────┘ │ Memory   │  │
          │                                  │ Storage  │  │
          │                                  └──────────┘  │
          └────────────────────────────────────────────────┘
```

### Module Structure
```
packages/mcp-server/
├── package.json                 # Project configuration and dependencies
├── tsconfig.json               # TypeScript configuration
├── src/
│   ├── index.ts                # Main entry point (exports only)
│   ├── start.ts                # Startup entry point
│   ├── config/                 # Configuration management
│   │   ├── environment.ts      # Environment variable management
│   │   ├── models.ts           # Default model configuration
│   │   └── templates.ts        # Default template configuration
│   ├── tools/                  # MCP Tools implementation
│   │   ├── index.ts            # Tools exports
│   │   ├── optimize-user-prompt.ts      # User prompt optimization
│   │   ├── optimize-system-prompt.ts    # System prompt optimization
│   │   └── iterate-prompt.ts            # Prompt iteration optimization
│   ├── adapters/               # Service adapter layer
│   │   ├── core-services.ts    # Core service initialization and management
│   │   ├── parameter-adapter.ts # Parameter format conversion
│   │   └── error-handler.ts    # Error handling adaptation
│   └── utils/                  # Utility functions
│       └── logging.ts          # Logging utility
├── examples/                   # Usage examples
│   ├── stdio-client.js         # stdio client example
│   └── http-client.js          # HTTP client example
├── docs/                       # Documentation
│   └── README.md               # Usage instructions
└── tests/                      # Test files
    ├── tools.test.ts           # Tools tests
    └── integration.test.ts     # Integration tests
```

## 🐛 Problem Diagnosis and Resolution

### Environment Variable Loading Timing Issue
**Problem Description**: The `defaultModels` in the Core package is initialized when the module is imported, making it unable to read environment variables loaded later via dotenv.

**Solution**: Create a preload script (`preload-env.js`) to preload environment variables at Node.js startup:

```javascript
// preload-env.js
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables by priority
const paths = [
  resolve(process.cwd(), '.env.local'),
  resolve(process.cwd(), '../.env.local'),
  resolve(__dirname, '../../.env.local'),
  // ... more paths
];

paths.forEach(path => {
  try {
    config({ path });
  } catch (error) {
    // Ignore file not found errors
  }
});
```

Use the `-r` parameter to preload:
```json
{
  "scripts": {
    "dev": "node -r ./preload-env.js dist/start.js --transport=http"
  }
}
```

### Background Process Issue During Build
**Problem Description**: There is immediately executed code at the end of the `src/index.ts` file, which unexpectedly starts the server and occupies the port when `tsup` builds.

**Solution**: File separation strategy

1. `src/index.ts` - Only export functions, do not execute:
```typescript
// Export main function for external calls
export { main };
```

2. `src/start.ts` - Specifically for startup:
```typescript
#!/usr/bin/env node
import { main } from './index.js';

// Start the server
main().catch(console.error);
```

3. Update build configuration:
```json
{
  "scripts": {
    "build": "tsup src/index.ts src/start.ts --format cjs,esm --dts --clean",
    "dev": "node -r ./preload-env.js dist/start.js --transport=http"
  }
}
```

## 📝 Implementation Steps

1. Project structure design and initialization
2. Core service manager implementation
3. Parameter adapter layer implementation
4. Default configuration management
5. MCP Tools implementation
6. Error handling and conversion
7. MCP Server instance creation
8. Multi-transport support
9. Testing and documentation

## 🔍 Debugging Process

During development, we used the following debugging methods:

1. **MCP Inspector Debugging**: Use the official debugging tool for protocol-level testing
2. **Log-driven Debugging**: Detailed logging of each stage's status for quick problem localization
3. **Layered Testing Strategy**: Test Core services first, then test MCP wrapping for quick problem localization

## 🧪 Testing Verification

### Build Tests
- ✅ CJS/ESM dual format output
- ✅ TypeScript type definitions generated
- ✅ No side effects during build (server does not start)

### Functional Tests
- ✅ Environment variables loaded correctly
- ✅ Automatic model selection and configuration
- ✅ Template loading and management
- ✅ MCP tools registration and invocation
- ✅ HTTP/stdio dual transport support

### Compatibility Tests
- ✅ Windows 10/11
- ✅ Node.js 18+
- ✅ MCP Inspector integration
- ✅ Claude Desktop compatibility