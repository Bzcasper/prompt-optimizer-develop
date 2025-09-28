# IPC Architecture Analysis and Development Experience

## 📝 Background

Analysis and solutions to IPC architecture issues encountered during the development of the Desktop version.

## 🔍 Architecture Difference Analysis

### 1. Web Environment vs Desktop Environment

**Web Environment (Single Process)**:
```
Vue Component → Direct Call → Service Instance
```

**Desktop Environment (Multi-Process)**:
```
Vue Component → ElectronProxy → IPC → Main Process → Service Instance
```

### 2. Common Problem Patterns

#### Problem 1: Missing Interface Contract
```typescript
// ❌ Incomplete interface definition
interface ITemplateManager {
  getTemplate(id: string): Promise<Template>;
  // Missing language-related methods
}

// ✅ Complete interface definition
interface ITemplateManager {
  getTemplate(id: string): Promise<Template>;
  getCurrentBuiltinTemplateLanguage(): Promise<BuiltinTemplateLanguage>;
  changeBuiltinTemplateLanguage(language: BuiltinTemplateLanguage): Promise<void>;
}
```

#### Problem 2: Incomplete Proxy Implementation
```typescript
// ❌ Proxy class missing methods
class ElectronTemplateManagerProxy implements ITemplateManager {
  async getTemplate(id: string): Promise<Template> {
    return this.electronAPI.getTemplate(id);
  }
  // Missing implementations for other methods
}

// ✅ Complete proxy implementation
class ElectronTemplateManagerProxy implements ITemplateManager {
  async getTemplate(id: string): Promise<Template> {
    return this.electronAPI.getTemplate(id);
  }
  
  async getCurrentBuiltinTemplateLanguage(): Promise<BuiltinTemplateLanguage> {
    return this.electronAPI.getCurrentBuiltinTemplateLanguage();
  }
}
```

#### Problem 3: Incomplete IPC Link
```javascript
// preload.js - Missing method exposure
window.electronAPI = {
  template: {
    getTemplate: (id) => ipcRenderer.invoke('template-getTemplate', id),
    // Missing language-related methods
  }
}

// main.js - Missing handler
ipcMain.handle('template-getTemplate', async (event, id) => {
  // Handling logic
});
// Missing language-related handlers
```

## 🛠️ Fix Strategy

### 1. Interface-First Design
```typescript
// Step 1: Define complete interface
export interface ITemplateManager {
  // All required methods
}

// Step 2: Web environment implementation
export class TemplateManager implements ITemplateManager {
  // Complete implementation
}

// Step 3: Electron proxy implementation
export class ElectronTemplateManagerProxy implements ITemplateManager {
  // Complete proxy implementation
}
```

### 2. IPC Link Integrity Check
```
Vue Component Call → Check Proxy Method → Check Preload Exposure → Check Main Handler → Check Service Method
```

### 3. Error Handling Principles
```typescript
// ❌ Error masking
async someMethod() {
  try {
    return await this.service.method();
  } catch (error) {
    return null; // Masks the error
  }
}

// ✅ Error propagation
async someMethod() {
  return await this.service.method(); // Let the error propagate naturally
}
```

## 🎯 Development Checklist

### IPC Function Development Check
- [ ] Is the interface definition complete?
- [ ] Is the Web environment implementation complete?
- [ ] Is the Electron proxy implementation complete?
- [ ] Does preload.js expose all methods?
- [ ] Does main.js have corresponding handlers?
- [ ] Is error handling correct?
- [ ] Have both environments been tested?

### Architecture Violation Check
- [ ] Does preload.js only forward without business logic?
- [ ] Are all methods asynchronous?
- [ ] Is a unified error handling format used?
- [ ] Are there direct cross-process calls?

## 💡 Best Practices

### 1. Progressive Development
1. First implement and test in the Web environment
2. Define a complete interface
3. Implement the Electron proxy
4. Complete the IPC link
5. Test in the Desktop environment

### 2. Debugging Techniques
```javascript
// Add logs at each stage
console.log('[Vue] Calling method:', methodName);
console.log('[Proxy] Forwarding to IPC:', methodName);
console.log('[Main] Handling IPC:', methodName);
console.log('[Service] Executing:', methodName);
```

### 3. Type Safety
```typescript
// Use strict type checking
interface ElectronAPI {
  template: {
    [K in keyof ITemplateManager]: ITemplateManager[K];
  };
}
```

## 🔗 Related Experiences

This architecture analysis provides a foundation for subsequent development:
- Established a complete IPC development process
- Formulated interface-first design principles
- Created a comprehensive development and debugging checklist

These experiences were further applied in subsequent serialization optimizations (115).