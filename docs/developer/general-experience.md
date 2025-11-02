# Project General Experience Guide

This guide collects general experience and best practices in project development, aiming to quickly solve common problems and improve development efficiency.

> **Note**: Function-specific experience has been archived to the corresponding directory in `docs/archives/`.

## 📚 Archived Special Experience

- **Modal Component Experience** → [106-template-management/modal-experience.md](../archives/106-template-management/modal-experience.md)
- **Layout System Experience** → [108-layout-system/experience.md](../archives/108-layout-system/experience.md)
- **Theme System Experience** → [109-theme-system/experience.md](../archives/109-theme-system/experience.md)
- **Composable Architecture Experience** → [102-web-architecture-refactor/experience.md](../archives/102-web-architecture-refactor/experience.md)
- **Large-scale Architecture Refactoring Experience** → [117-import-export-architecture-refactor/experience.md](../archives/117-import-export-architecture-refactor/experience.md)
- **Version Update System Experience** → [118-desktop-auto-update-system/experience.md](../archives/118-desktop-auto-update-system/experience.md)
- **MCP Server Module Development Experience** → [120-mcp-server-module/experience.md](../archives/120-mcp-server-module/experience.md)
- **Docker API Proxy Experience** → [122-docker-api-proxy/experience.md](../archives/122-docker-api-proxy/experience.md)
- **Advanced Feature Complete Implementation Experience** → [123-advanced-features-implementation/experience.md](../archives/123-advanced-features-implementation/experience.md)

## 🔧 General Development Specifications

### API Integration
```typescript
// Unified OpenAI compatible format
const config = {
  baseURL: "https://api.provider.com/v1",
  models: ["model-name"],
  apiKey: import.meta.env.VITE_API_KEY // Must use Vite environment variables
};
```

**Core Principles**:
- Separation of business logic and API configuration
- Only pass parameters explicitly configured by the user, do not set default values
- Manage sensitive information through environment variables

### Error Handling
```typescript
try {
  await apiCall();
} catch (error) {
  console.error('[Service Error]', error); // Development log
  throw new Error('Operation failed, please try again later'); // User-friendly prompt
}
```

### Testing Specifications
```javascript
describe("Function Test", () => {
  beforeEach(() => {
    testId = `test-${Date.now()}`; // Unique identifier to avoid conflicts
  });
  
  // LLM parameter test: each parameter is tested independently
  it("should handle temperature parameter", async () => {
    await modelManager.updateModel(configKey, {
      llmParams: { temperature: 0.7 } // Only test one parameter
    });
  });
});
```

**Key Points**:
- Use a dynamic unique identifier
- Create an independent test for each LLM parameter
- Cover exception scenarios
- Correctly clean up the test state

### Vue Development Best Practices

#### Attribute Inheritance for Multi-root Components
**Problem**: When a Vue component has multiple root nodes, it cannot automatically inherit non-prop attributes (such as `class`) passed from the parent component, and will generate a warning.

**Solution**:
1. Use `defineOptions({ inheritAttrs: false })` in `<script setup>` to disable the default attribute inheritance behavior
2. In the template, manually bind `v-bind="$attrs"` to the **specific** root node you want to receive these attributes

**Example**:
```
<template>
  <!-- $attrs will apply class, id and other attributes to this component -->
  <OutputDisplayCore v-bind="$attrs" ... />
  <OutputDisplayFullscreen ... />
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>
```

#### Deep Component Event Propagation Mechanism
**Problem**: When a global state change needs to notify multi-level nested components, event propagation may be interrupted, causing deep components to fail to update in time.

**Typical Scenarios**:
- After a language switch, the main interface component updates normally, but the component inside the Modal displays the old state
- Component level difference: `App.vue → ComponentA` (direct reference) vs `App.vue → ComponentB → ComponentC` (indirect reference)

**Core Reasons**:
1. **v-if conditional rendering**: The ref becomes invalid after the component is destroyed, and the component method cannot be called
2. **Event propagation breakpoint**: The event only propagates to the direct child component and will not automatically propagate down to the deep component
3. **Component lifecycle difference**: Components at different levels may be in different lifecycle stages

**Solutions**:
1. **Use v-show instead of v-if**: Ensure that the component instance always exists and the ref remains valid
   ```vue
   <!-- ❌ Problematic solution: the component will be destroyed -->
   <Modal v-if="showModal">
     <TemplateSelect ref="templateRef" />
   </Modal>
   
   <!-- ✅ Recommended solution: the component is always rendered -->
   <Modal v-show="showModal">
     <TemplateSelect ref="templateRef" />
   </Modal>
   ```

2. **Establish a complete event propagation chain**: From the event source to all consumer components
   ```javascript
   // Parent component: establish event propagation
   const handleGlobalStateChange = (newState) => {
     // Refresh the direct child component
     if (directChildRef.value?.refresh) {
       directChildRef.value.refresh()
     }
     
     // Refresh the deep component (through the exposed method of the intermediate component)
     if (intermediateRef.value?.refreshDeepChild) {
       intermediateRef.value.refreshDeepChild()
     }
   }
   
   // Intermediate component: expose the refresh method of the deep component
   const deepChildRef = ref()
   
   const refreshDeepChild = () => {
     if (deepChildRef.value?.refresh) {
       deepChildRef.value.refresh()
     }
   }
   
   defineExpose({
     refreshDeepChild
   })
   ```

3. **Unified refresh interface**: All related components expose the same refresh method
   ```javascript
   // Each component that needs to respond to global state changes implements the refresh method
   const refresh = () => {
     // Reload data or update state
   }
   
   defineExpose({
     refresh
   })
   ```

**Best Practices**:
- **Architectural design**: Consider the complete path of event propagation during the design phase
- **Interface consistency**: Define a standard component refresh interface (such as the `refresh()` method)
- **Documentation**: Create a clear architectural diagram for complex event propagation chains
- **Test verification**: Ensure that events can be correctly propagated in all usage scenarios

**Applicable Scenarios**:
- Global theme switching
- Language switching
- User permission changes
- Template/configuration updates

> **Detailed Case**: See [106-template-management/event-propagation-fix.md](../archives/106-template-management/event-propagation-fix.md)

## ⚡ Quick Problem Troubleshooting

### Layout Issues
1. Check if the Flex constraint chain is complete
2. Confirm if `min-h-0` has been added
3. Verify if the parent container is `display: flex`

### Scrolling Issues
1. Check for incorrect `overflow` properties in the middle layer
2. Confirm if the height constraint is correctly passed from the top level
3. Verify if the scrolling container has the correct `overflow-y: auto`

### Component State Synchronization Issues
1. **Deep component not updated**:
   - Check if `v-if` is used, causing the component to be destroyed
   - Confirm if the event propagation chain is complete (parent → intermediate → target component)
   - Verify if the target component has exposed a refresh method

2. **Abnormal state of components in Modal**:
   - Check if the Modal uses `v-show` instead of `v-if`
   - Confirm if the component ref is still valid when the Modal is closed
   - Verify if the global state change event is propagated to the inside of the Modal

3. **Component ref call failed**:
   - Confirm if the component has been mounted (`nextTick`)
   - Check if conditional rendering causes the component to not exist
   - Verify if the component bound to the ref has exposed the corresponding method

### API Call Issues
1. Check if the environment variables are set correctly (`VITE_` prefix)
2. Confirm if the parameters are excessively set with default values
3. Verify if the error handling is user-friendly

### Test Failures
1. Check if the test ID is unique
2. Confirm if the state is correctly cleaned up after the test
3. Verify if the LLM parameter tests are independent

## 🔄 Version Management

### Version Synchronization
```json
// package.json
{
  "scripts": {
    "version": "pnpm run version:sync && git add -A"
  }
}
```
**Key**: Use the `version` hook instead of `postversion` to ensure that the synchronized files are included in the version commit.

### Template Management
- **Built-in templates**: Cannot be modified, cannot be exported
- **User templates**: Can be modified, a new ID is generated upon import
- **Import rules**: Skip templates with the same ID as built-in templates

## 🚨 Key Bug Fix Pattern

### Parameter Transparency
```typescript
// ❌ Error: automatically set default value
if (!config.temperature) config.temperature = 0.7;

// ✅ Correct: only use user-configured parameters
const requestConfig = {
  model: modelConfig.defaultModel,
  messages: formattedMessages,
  ...userLlmParams // Only pass parameters explicitly configured by the user
};
```

### Data Import Security Validation
```
// Whitelist validation + type checking
for (const [key, value] of Object.entries(importData)) {
  if (!ALLOWED_KEYS.includes(key)) {
    console.warn(`Skipping unknown configuration: ${key}`);
    continue;
  }
  if (typeof value !== 'string') {
    console.warn(`Skipping invalid type ${key}: ${typeof value}`);
    continue;
  }
  await storage.setItem(key, value);
}
```

### Internationalization (i18n) Key-Value Synchronization
**Problem**: `[intlify] Not found 'key' in 'locale' messages` error, usually caused by unsynchronized key-values in Chinese and English language packs.

**Solution**: Create an automated script to compare the two language files and list the differences.

## 📝 Document Update Specifications

When encountering new problems or finding better solutions, this document should be updated in a timely manner:
1. Add new experience to the corresponding chapter
2. Update code examples
3. Record the repair time and problem background
4. Keep the document concise and avoid overly detailed process descriptions

---

**Remember**: A good experience document should allow team members to quickly find solutions instead of reinventing the wheel.

## 🎯 Vue Composables Design Experience

### The Importance of Singleton Pattern
**Problem Scenario**: When multiple components use the same composable, if a new instance is created for each call, it will lead to unsynchronized state.

**Incorrect Implementation**:
```typescript
export function useUpdater() {
  const state = reactive({...})  // A new instance is created for each call
  return { state, ... }
}
```

**Correct Implementation**:
```
let globalUpdaterInstance: any = null

export function useUpdater() {
  if (globalUpdaterInstance) {
    return globalUpdaterInstance  // Return the existing instance
  }

  const state = reactive({...})
  const instance = { state, ... }
  globalUpdaterInstance = instance  // Cache the instance
  return instance
}
```

**Judgment Standard**: If multiple components need to access the same state, the singleton pattern should be used.

**Common Scenarios Requiring Singletons**:
- Global state management (such as update status, user settings)
- Modal state
- Notification system

### Debugging Strategy
- **Log-driven debugging**: Confirm the state of each link through detailed logs
- **Layered verification**: Verify the data layer first, then the UI layer
- **Avoid over-engineering**: Do not add complex patches to solve problems

## 🏗️ General Experience in Architectural Refactoring

### Large-scale Refactoring Strategy
**Progressive Refactoring Principles**:
1. **Interface First** - Design the interface first, then implement the functionality
2. **Phased Execution** - Maintain functional continuity and avoid destructive changes
3. **Test Protection** - Each phase must have test coverage
4. **Document Synchronization** - Update the documentation while refactoring

### Distributed Architecture Design
**Core Principles**:
- Single Responsibility: Each service is only responsible for its own data
- Unified Interface: All services implement the same interface
- Loose Coupling: Services interact through interfaces
- Scalability: New services can be added by simply implementing the interface

### Storage Abstraction Design
**Avoid Leaky Abstractions**:
- Encapsulate storage details in the service layer
- Expose with logical key names
- Establish clear abstraction boundaries
- Document the dual purpose of storage keys

### AI Automated Testing
**MCP Tool Application**:
- Use browser automation to verify real user scenarios
- Establish repeatable test cases
- Verify architectural consistency and data integrity
- Improve test coverage and reliability

> Detailed experience reference: [117-import-export-architecture-refactor](../archives/117-import-export-architecture-refactor/)

## Node.js Application Development Experience

### Environment Variable Management
- **Loading Time is Crucial**: Environment variables must be loaded into `process.env` before any module is imported
- **Node.js's `-r` parameter**: Is the most reliable way to preload scripts before the module system is initialized
- **Path Resolution**: Consider different working directories and deployment scenarios, and support multi-path lookup

### Build Tool Usage
- **Separate Entry Files**: The entry file only exports, and does not execute any code with side effects
- **Independent Startup Files**: Use a separate startup file to be responsible for executing the main logic
- **Avoid Build Side Effects**: Ensure that the build process does not execute any code with side effects

### Windows Compatibility
- **Avoid Complex Process Management**: Do not use complex process management tools like concurrently
- **Separate Build and Startup**: Adopt separate build and startup processes
- **Simple npm scripts**: Use simple npm scripts instead of complex command combinations

## Architectural Design Experience

### Adapter Pattern
- **Decoupling**: Achieve decoupling between different systems through the adapter pattern
- **Scalability**: The adapter pattern makes it easy to add new adapters to support more functions
- **Maintainability**: Each adapter has a single responsibility, which is easy to maintain

### Stateless Design
- **Simplified Deployment**: Stateless design simplifies the deployment process
- **Improved Reliability**: Avoids the problem of inconsistent state
- **Easy to Test**: Each test is a brand new environment

Related Archives:
- [120-mcp-server-module](../archives/120-mcp-server-module/) - MCP Server Module Development

## 🖥️ Node.js Environment Development Experience

### Environment Variable Loading Timing
**Problem**: Node.js environment variables must be loaded before modules are imported, otherwise the modules will not be able to read them during initialization
```bash
# ✅ Correct: use the -r parameter to preload
node -r ./preload-env.js dist/index.js

# ❌ Error: load environment variables after modules are imported
node dist/index.js  # At this time, the environment variables may not be loaded
```

**Solution**:
1. Create a preload script to support multi-path lookup
2. Centralize the loading of environment variables in the startup script
3. Support silent loading to avoid errors when the configuration file is not found

### Build-time Side Effect Control
**Problem**: Build tools (such as tsup) will cause the server to start unexpectedly when executing module-level code
```typescript
// ❌ Error: the entry file is executed directly
import { startServer } from './server'
startServer() // Will be executed during build

// ✅ Correct: separate export and execution
export { startServer } from './server'
// Use a separate startup file to execute the main logic
```

### Windows Process Management
**Problem**: Process management tools such as concurrently have problems with signal handling on Windows
```json
// ❌ Avoid: complex process management
"scripts": {
  "dev": "concurrently \"npm run build:watch\" \"npm run start\""
}

// ✅ Recommended: simple separate scripts
"scripts": {
  "build": "tsup",
  "start": "node dist/index.js",
  "dev": "npm run build && npm run start"
}
```

## 📝 Instructions for Use

1. **Find Experience**: First check the archived special experience, then the general specifications
2. **Apply in Practice**: Choose the appropriate solution according to the specific scenario
3. **Continuous Update**: Supplement this document in a timely manner when new general experience is discovered
4. **Avoid Duplication**: Function-specific experience should be archived in the corresponding archives directory
