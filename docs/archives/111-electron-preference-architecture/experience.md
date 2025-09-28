# Development Experience Summary

## 🎯 Core Experience

### 1. Electron API Initialization Timing Management
**Experience**: In the Electron environment, there is a timing competition between the API exposure in the preload script and the initialization of components in the rendering process.

**Best Practice**:
```typescript
// ❌ Incorrect approach: Directly accessing the API
window.electronAPI.preference.get(key, defaultValue)

// ✅ Correct approach: Check first before accessing
if (isElectronApiReady()) {
  await window.electronAPI.preference.get(key, defaultValue)
} else {
  await waitForElectronApi()
  // Then access
}
```

**Applicable Scenarios**: Initialization of services in all Electron applications.

### 2. Vue Component Initialization and Service Dependencies
**Experience**: The Vue `onMounted` hook may trigger before the services are fully ready, leading to race conditions.

**Solution**:
- Use asynchronous initialization patterns.
- Implement lazy loading in the service layer.
- Add service readiness state checks.

**Avoidance Method**: Do not immediately call potentially unready services when the component is mounted.

### 3. API Path Normalization
**Experience**: The API paths exposed by `preload.js` must exactly match the code access paths.

**Standard Pattern**:
```typescript
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  preference: { /* API methods */ }
})

// Code access
window.electronAPI.preference.get()
```

**Common Errors**: 
- Exposing under `electronAPI` in preload, but accessing `api` in the code.
- Inconsistent API structure leading to undefined access.

## 🛠️ Technical Implementation Experience

### 1. Environment Detection Best Practices
```typescript
// Multi-layer checks to ensure API is fully available
export function isElectronApiReady(): boolean {
  const window_any = window as any;
  const hasElectronAPI = typeof window_any.electronAPI !== 'undefined';
  const hasPreferenceApi = hasElectronAPI && 
    typeof window_any.electronAPI.preference !== 'undefined';
  return hasElectronAPI && hasPreferenceApi;
}
```

**Key Points**:
- Not only check the environment but also the specific API availability.
- Use type-safe detection methods.
- Provide detailed debugging logs.

### 2. Asynchronous Waiting Pattern
```typescript
export function waitForElectronApi(timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    // Check immediately to avoid unnecessary waiting
    if (isElectronApiReady()) {
      resolve(true);
      return;
    }
    
    // Polling check + timeout protection
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isElectronApiReady()) {
        clearInterval(checkInterval);
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 50);
  });
}
```

**Design Points**:
- Fast path: Return immediately if ready.
- Reasonable interval: 50ms balances performance and responsiveness.
- Timeout protection: Prevents infinite waiting.
- Resource cleanup: Timely clearing of timers.

### 3. Proxy Service Protection Pattern
```typescript
class ElectronPreferenceServiceProxy {
  private ensureApiAvailable() {
    if (!window?.electronAPI?.preference) {
      throw new Error('Electron API not available');
    }
  }

  async get<T>(key: string, defaultValue: T): Promise<T> {
    this.ensureApiAvailable(); // Check before each call
    return window.electronAPI.preference.get(key, defaultValue);
  }
}
```

**Design Principles**:
- Defensive programming: Check before each call.
- Clear error messages: Facilitate problem diagnosis.
- Unified check logic: Avoid duplicate code.

## 🚫 Pitfall Guide

### 1. Common Error Patterns

#### Error 1: Assuming API is Immediately Available
```typescript
// ❌ Dangerous: Assuming API is ready
export function useTemplateManager() {
  const services = inject('services')
  // This may be called before the API is ready
  services.preferenceService.get('template-selection', null)
}
```

#### Error 2: Inconsistent API Paths
```typescript
// ❌ Error: Path mismatch
// preload.js: window.electronAPI.preference
// Code access: window.api.preference
```

#### Error 3: Lack of Timeout Protection
```typescript
// ❌ Dangerous: May wait indefinitely
while (!isApiReady()) {
  await sleep(100) // No timeout mechanism
}
```

### 2. Debugging Techniques

#### Add Detailed Logs
```typescript
console.log('[isElectronApiReady] API readiness check:', {
  hasElectronAPI,
  hasPreferenceApi,
});
```

#### Use Breakpoint Debugging
- Set breakpoints in the API detection function.
- Inspect the actual structure of the window object.
- Validate the completeness of API exposure.

#### Timing Analysis
- Record timestamps for each initialization step.
- Analyze the timing relationship between component mounting and API readiness.

## 🔄 Architectural Design Experience

### 1. Service Layer Abstraction
**Experience**: By abstracting through the service layer, UI components do not need to know the underlying storage implementation.

**Benefits**:
- Environment agnostic: The same UI code runs in both Web and Electron.
- Easy to test: Can easily mock the service layer.
- Separation of concerns: UI focuses on presentation, while the service layer handles data.

### 2. Proxy Pattern Application
**Experience**: Use the proxy pattern to encapsulate IPC communication in the Electron environment.

**Advantages**:
- Unified interface: Proxy services implement the same interface.
- Error isolation: The proxy layer handles communication errors.
- Transparent switching: Upper-level code does not need to be aware of environmental differences.

### 3. Dependency Injection Pattern
**Experience**: Use dependency injection to manage service instances.

**Implementation**:
```typescript
// Environment-adaptive service creation
if (isRunningInElectron()) {
  preferenceService = new ElectronPreferenceServiceProxy()
} else {
  preferenceService = createPreferenceService(storageProvider)
}

// Unified injection
provide('services', { preferenceService, ... })
```

## 📊 Performance Optimization Experience

### 1. Initialization Performance
- **Lazy Loading**: Initialize services only when needed.
- **Parallel Initialization**: Services without dependencies can be initialized in parallel.
- **Cache Detection Results**: Avoid repeated environment checks.

### 2. Runtime Performance
- **Batch Operations**: Combine multiple configuration read/write operations.
- **Asynchronous Processing**: Use Promises to avoid blocking the UI.
- **Error Recovery**: Gracefully handle API call failures.

## 🧪 Testing Strategy Experience

### 1. Environment Simulation
```typescript
// Mock Electron environment
Object.defineProperty(window, 'electronAPI', {
  value: {
    preference: {
      get: jest.fn(),
      set: jest.fn(),
    }
  }
})
```

### 2. Timing Tests
- Test access behavior before API readiness.
- Test handling of timeout scenarios.
- Test safety of concurrent initialization.

### 3. Integration Testing
- End-to-end testing of the complete initialization process.
- Verify consistency of behavior across different environments.
- Test error recovery mechanisms.

## 🔗 Related Resources

### Documentation Links
- [Electron Context Bridge Documentation](https://www.electronjs.org/docs/api/context-bridge)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### Code Examples
- Complete implementation can be found at: `packages/core/src/services/preference/`
- Test cases can be found at: `packages/core/tests/`

---

**Summary Date**: 2025-01-01  
**Applicable Version**: Electron 37.x, Vue 3.x  
**Experience Level**: Production Environment Verified