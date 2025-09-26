# High-Level Service Proxy IPC Model Refactoring Plan

## 📋 Task Overview

Address the vulnerabilities and compatibility issues caused by the current low-level `fetch` proxy solution due to incomplete simulation. Establish a stable, maintainable, and clearly defined architecture for the desktop application, with the main process acting as the backend service provider and the rendering process as a pure frontend consumer.

## 🎯 Goals

- Abandon the low-level `fetch` proxy and switch to a high-level service interface proxy
- Establish a stable IPC communication protocol
- Implement the service provider role in the main process
- Improve the maintainability and stability of the system

## 📅 Timeline

- **Start Date**: 2024-07-25
- **Current Status**: 📋 Planning Phase
- **Expected Completion**: To be determined

## 🔧 Plan Steps

### 1. Clean Up `core` Package
- [ ] Remove all Electron-specific logic (such as `isRunningInElectron` and `fetch` injection)
- [ ] Return it to a pure, platform-independent core business logic library
- [ ] Ensure the core package can run in any JavaScript environment

### 2. Refactor `main.js`
- [ ] Make it a service provider
- [ ] Directly consume the `core` package via `require('@prompt-optimizer/core')`
- [ ] Instantiate core services like `LLMService` in the main process
- [ ] Establish service management and lifecycle control

### 3. Implement Main Process Storage Solution
- [ ] Provide a storage solution suitable for the Node.js environment for services in `main.js`
- [ ] Initially implement a temporary `MemoryStorageProvider`
- [ ] Subsequently implement file persistence storage

### 4. Refactor IPC Communication Protocol
- [ ] Abandon the low-level `api-fetch` proxy
- [ ] Establish high-level IPC interfaces based on public methods of `ILLMService` in `main.js` and `preload.js`
- [ ] Implement method-level IPC calls (such as `testConnection`, `sendMessageStream`)

### 5. Create Rendering Process Proxy
- [ ] Create an `ElectronLLMProxy` class in the `core` package
- [ ] This class implements the `ILLMService` interface
- [ ] Internal methods call IPC interfaces via `window.electronAPI.llm.*`

### 6. Refactor Service Initialization Logic
- [ ] Modify `useServiceInitializer.ts`
- [ ] Enable it to determine based on the current environment (Web or Electron)
- [ ] Provide a real `LLMService` instance or `ElectronLLMProxy` instance for the application

## 🚨 Problem Analysis

### Current Architecture Issues
1. **Vulnerabilities of Low-Level Proxy**: 
   - The `fetch` proxy causes serialization and instance type mismatch issues for objects like `AbortSignal` and `Headers` during cross-IPC transmission
   - This leads to application crashes and maintenance difficulties

2. **Violation of Separation of Concerns**:
   - Attempts to simulate a complex and unstable low-level Web API
   - Violates the principle of separation of concerns

3. **Maintenance Challenges**:
   - Incomplete simulation of low-level objects
   - Difficulties in debugging and error tracing

### Advantages of the Solution
1. **Stable Interface**: Proxies our own defined high-level, stable service interfaces
2. **Simple Data Structures**: Based on stable, simple, and serializable data structures and interfaces
3. **Clear Responsibilities**: The main process focuses on service provision, while the rendering process focuses on the UI

## 🏗️ New Architecture Design

### Main Process Architecture
```javascript
// main.js
const { LLMService, StorageProvider } = require('@prompt-optimizer/core');

class MainProcessServices {
  constructor() {
    this.storageProvider = new NodeStorageProvider();
    this.llmService = new LLMService(this.storageProvider);
  }
  
  async testConnection(config) {
    return await this.llmService.testConnection(config);
  }
  
  async sendMessageStream(messages, config, onChunk) {
    return await this.llmService.sendMessageStream(messages, config, onChunk);
  }
}

const services = new MainProcessServices();

// IPC Handlers
ipcMain.handle('llm:testConnection', async (event, config) => {
  return await services.testConnection(config);
});

ipcMain.handle('llm:sendMessageStream', async (event, messages, config) => {
  // Special logic for handling streaming responses
});
```

### Rendering Process Proxy
```typescript
// ElectronLLMProxy.ts
export class ElectronLLMProxy implements ILLMService {
  async testConnection(config: LLMConfig): Promise<boolean> {
    return await window.electronAPI.llm.testConnection(config);
  }
  
  async sendMessageStream(
    messages: Message[], 
    config: LLMConfig, 
    onChunk: (chunk: string) => void
  ): Promise<string> {
    return await window.electronAPI.llm.sendMessageStream(messages, config, onChunk);
  }
}
```

### Environment Detection and Initialization
```typescript
// useServiceInitializer.ts
export function useServiceInitializer() {
  const isElectron = typeof window !== 'undefined' && window.electronAPI;
  
  if (isElectron) {
    return {
      llmService: new ElectronLLMProxy(),
      storageProvider: new ElectronStorageProxy()
    };
  } else {
    return {
      llmService: new LLMService(new WebStorageProvider()),
      storageProvider: new WebStorageProvider()
    };
  }
}
```

## 📋 Milestones

- [ ] Complete solution design and documentation synchronization
- [ ] Complete code refactoring
- [ ] Desktop application successfully runs under the new architecture
- [ ] Implement file persistence storage in the main process

## 💡 Core Insights

1. **Cross-Process Communication Principles**: Should be based on stable, simple, and serializable data structures and interfaces
2. **Avoid Proxying Low-Level Objects**: Do not attempt to proxy complex low-level native objects
3. **Separation of Concerns**: The main process focuses on services, while the rendering process focuses on the UI
4. **Interface Stability**: High-level interfaces are more stable than low-level APIs and are better suited for cross-process communication

## 🔗 Related Documents

- [Current Desktop Architecture](./README.md)
- [Desktop Application Implementation Record](./desktop-implementation.md)
- [IPC Communication Best Practices](./ipc-best-practices.md)

---

**Task Status**: 📋 Planning Phase  
**Priority**: High  
**Last Updated**: 2025-07-01