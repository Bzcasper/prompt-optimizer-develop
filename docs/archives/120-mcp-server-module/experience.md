# MCP Server Module Development Experience Summary

## 🎯 Core Experience

### Zero-Intrusiveness Design Principle
In developing the MCP Server module, we adopted the zero-intrusiveness design principle, making no modifications to the Core module code and achieving functional integration through an adaptation layer. This design approach brought the following benefits:

1. **Maintaining Clean Architecture**: Avoided modifications to the core module, preserving the purity of the code.
2. **Reducing Maintenance Costs**: Updates to the core module do not affect the MCP Server module.
3. **Improving Testability**: The MCP Server module and Core module can be tested independently.

**Implementation Key Points**:
- **Absolutely do not modify Core module code**: All adaptations are completed at the MCP server layer.
- **Use existing interfaces**: Calls are made strictly according to the existing API of the Core module.
- **Complete service initialization**: All Core service dependencies must be initialized.

### Core Module Service-Oriented Architecture Matching
The service-oriented architecture of the Core module is highly compatible with the MCP protocol, providing a solid foundation for zero-intrusiveness design:
- All core functionalities are exposed through service interfaces.
- Dependencies between services are clear, facilitating management of the adaptation layer.
- Parameter and return value formats are standardized, making protocol conversion easier.

### Layered Architecture Design
A layered architecture design is adopted, separating the MCP protocol layer, transport layer, and service adaptation layer, making the responsibilities of each layer clear and facilitating maintenance and expansion.

## 🛠️ Technical Implementation Experience

### Environment Variable Loading Timing Issue
In Node.js applications, the timing of loading environment variables is very important. The issue we encountered was that the Core module initialized its configuration upon import, while the environment variables had not yet been loaded.

**Problem Phenomenon**:
- Node.js environment variables must be loaded before module import; otherwise, they cannot be read during module initialization.
- The Core module reads environment variables for configuration initialization upon import.

**Solution**:
1. Use Node.js's `-r` parameter to preload environment variables before module system initialization.
2. Create a preload script (preload-env.js) that supports multi-path lookup to adapt to different deployment scenarios.
3. Centralize configuration in the project root for easier management.
4. Support silent loading to avoid errors when configuration files are not found.

**Implementation Details**:
```bash
node -r ./preload-env.js dist/index.js
```

### Build-Time Side Effect Control
When using the tsup build tool, attention must be paid to the side effects of the entry file.

**Problem Phenomenon**:
- Build tools (like tsup) executing module-level code can unexpectedly start the server.
- Port occupation during the build process affects the development experience.

**Best Practices**:
1. The entry file should only export and not execute any side-effect-causing code.
2. Use a separate startup file to execute the main logic.
3. Avoid calling side-effect-causing functions at the top level of the module.
4. Separate build entry and startup entry.

### Windows Process Management Compatibility
When developing in a Windows environment, special attention must be paid to process management issues.

**Problem Phenomenon**:
- Tools like concurrently have issues with signal handling under Windows.
- Ctrl+C cannot correctly terminate child processes.
- Complex process management leads to a poor development experience.

**Solution**:
1. Avoid using complex process management tools like concurrently.
2. Separate build and startup processes, using simple npm scripts.
3. Use simple npm scripts instead of complex command combinations.
4. Prefer simple solutions in the Windows environment.

### MCP Protocol Debugging Techniques
Debugging is an important part of developing the MCP Server.

**Debugging Tools**:
1. **MCP Inspector**: Use the official debugging tool for protocol-level testing.
2. **Layered Testing Strategy**: Test Core services first, then test MCP wrapping to quickly locate issues.
3. **Log-Driven Debugging**: Record the state of each stage in detail for quick issue localization.

**Testing Methods**:
- Use a custom MCP Inspector testing tool to verify functionality.
- Test Chinese and English input to ensure internationalization support.
- Custom parameter testing to verify the correctness of parameter adaptation.

## 🚫 Pitfall Guide

### Environment Variable Loading Timing Trap
**Problem**: Environment variables are loaded after module import, leading to incorrect configuration initialization.
**Cause**: The Node.js module system executes module code upon import, at which point environment variables may not yet be loaded.
**Solution**: Use Node.js's `-r` parameter to preload environment variable scripts.
**Avoidance Method**: Centralize environment variable loading handling in the project startup script.

### Build-Time Side Effect Trap
**Problem**: Server startup code is unexpectedly executed during the build process, occupying ports.
**Cause**: Build tools execute module-level code to analyze dependencies.
**Solution**: Separate build entry and startup entry to ensure the build process is free of side effects.
**Avoidance Method**: The entry file should only export and not execute any side-effect-causing operations.

### Windows Signal Handling Trap
**Problem**: Signal handling issues when using tools like concurrently on Windows, unable to correctly terminate processes.
**Cause**: The signal handling mechanism in Windows differs from that of Unix systems.
**Solution**: Avoid using complex process management tools; adopt simple npm scripts.
**Avoidance Method**: Prefer simple solutions in the Windows environment.

### Storage Layer Environment Difference Trap
**Problem**: Inconsistent storage layer configurations across different environments.
**Cause**: The storage mechanisms in browser and Node.js environments differ.
**Solution**: Use StorageFactory to adapt to different environments and select the correct Provider during configuration.
**Avoidance Method**: Clearly define storage strategies early in the project to avoid large-scale modifications later.

## 🔄 Architecture Design Experience

### Deep Application of Adapter Pattern
In the MCP Server module, we extensively used the adapter pattern to convert MCP protocol interfaces into Core module interfaces. The advantages of this design pattern include:

1. **Decoupling**: The MCP protocol layer and Core service layer are completely decoupled.
2. **Scalability**: New adapters can be easily added to support more functionalities.
3. **Maintainability**: Each adapter has a single responsibility, making it easier to maintain.

**Implementation Complexity Considerations**:
- **Service Management**: Need to manage the complete Core service stack.
- **Parameter Conversion**: MCP simple parameters → Core complex parameter formats.
- **Configuration Management**: Configuration and validation of default models and templates.
- **Error Handling**: Conversion of Core errors to MCP protocol errors.

### Value of Stateless Design
The MCP Server adopts a stateless design, using in-memory storage without persistence, with each restart being a fresh state. The advantages of this design include:

1. **Simplified Deployment**: No need to consider data persistence and state management.
2. **Increased Reliability**: Avoids issues of inconsistent states.
3. **Ease of Testing**: Each test occurs in a fresh environment.
4. **Professional Tool Positioning**: Aligns with the usage patterns of tool-type applications.

### Independent Module Design Principles
Maintain clean dependencies and avoid circular dependencies:
- Only depend on the Core module to avoid UI layer pollution.
- Organize by functionality in layers for easier maintenance and expansion.
- Unify error conversion layers to provide a consistent user experience.

## 📚 Learning Resources and Tool Configuration

### Useful Documentation
- **MCP Official Documentation**: https://modelcontextprotocol.io - Protocol specifications and best practices.
- **MCP TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk - Complete API documentation and examples.

### Development Tool Configuration
- **MCP TypeScript SDK**: Use registerTool/registerResource methods to support Zod validation.
- **tsup Build Tool**: Configure ESM/CJS dual format output to remain consistent with the Core module.
- **Environment Variable Preloading**: Create a preload-env.js script to support multi-path lookup and silent loading.

### Code Implementation Patterns
- **MCP Tools Implementation Pattern**: Use registerTool + Zod validation.
- **Storage Layer Adaptation**: StorageFactory.create('memory') - In-memory storage configuration.
- **Parameter Adaptation Pattern**: Conversion of MCP simple parameters to Core complex parameters.

## 🎯 Key Decision Records

### Technology Selection Decisions
- **MCP SDK**: Chose the official TypeScript SDK for reasons of type safety and complete functional support.
- **Storage Solution**: Selected MemoryStorageProvider as it is suitable for tool-type applications with no persistence requirements.
- **Transport Method**: Supported both stdio and HTTP dual modes for flexible deployment to meet different usage scenarios.
- **Validation Library**: Chose Zod because the project is already using it, and it perfectly matches the MCP SDK.

### Architecture Decisions
- **Dependency Relationships**: Only depend on the Core module to maintain clean architecture and avoid UI layer pollution.
- **Module Structure**: Organized by functionality in layers for easier maintenance and expansion.
- **Error Handling**: Unified error conversion layer to provide a consistent user experience.
- **Zero-Intrusiveness Principle**: Made no modifications to Core code to maintain the purity of the core module.