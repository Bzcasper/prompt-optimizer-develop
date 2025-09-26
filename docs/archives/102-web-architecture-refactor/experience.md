# Web Architecture Refactoring Experience Summary

## 📋 Overview

Core experiences accumulated during the web architecture refactoring process, including Vue Composable architecture design, reactive system optimization, and best practices for dependency injection.

## 🎯 Vue Composable Architecture Refactoring: Solving Asynchronous Initialization Issues

### Problem Background
Calling Vue Composable functions in asynchronous callbacks leads to errors: `Uncaught (in promise) SyntaxError: Must be called at the top of a 'setup' function`. This violates the core rules of the Vue Composition API, necessitating a refactor of the architecture.

### Core Solution: Top-Level Declaration, Reactive Connection, Internal Autonomy
```typescript
// ❌ Error: Calling Composable in asynchronous callback
onMounted(async () => {
  const services = await initServices();
  const modelManager = useModelManager(); // Error: Not called at the top level of setup
});

// ✅ Correct: Top-level declaration, reactive connection
const { services } = useAppInitializer(); // Called at the top level
const modelManager = useModelManager(services); // Called at the top level, passing services reference

// Internal implementation: Reactive connection
export function useModelManager(services: Ref<AppServices | null>) {
  // State definition...
  
  // Reactive connection: Listening for service readiness
  watch(services, (newServices) => {
    if (!newServices) return;
    // Use the ready services...
  }, { immediate: true });
  
  return { /* Return state and methods */ };
}
```

### Architecture Design Points
1. **Unified Service Interface**: Create `AppServices` interface to manage all core services uniformly.
2. **Service Initializer**: `useAppInitializer` is responsible for creating and initializing all services.
3. **Composable Parameter Pattern**: All Composables receive `services` reference as a parameter.

### Key Experiences
1. **Vue Reactive Context**: Vue Composables must be synchronously called at the top level of `<script setup>`.
2. **Reactive Connection Pattern**: Use `watch` to listen for service readiness instead of calling Composables in callbacks.
3. **Fast Failure Principle**: In development environments, quickly exposing issues is more valuable than hiding them.
4. **Unified Architecture**: Maintain a consistent architectural pattern across all Composables.
5. **Type System Challenges**: Complex type systems may lead to interface mismatch issues.

## 🔄 Composable Refactoring: Deep Practice of `reactive` vs `ref`

### Background
To solve the issue where deeply nested `ref` in Vue cannot be automatically unwrapped, we refactored the return values of multiple core Composables from objects containing multiple `ref` to a single `reactive` object.

### Core Challenges and Solutions

#### 1. Dependency Injection Failure
- **Phenomenon**: Components cannot retrieve service instances via `inject`.
- **Root Cause**: Services were created but not correctly registered in the dependency injection system.
- **Solution**: Ensure a complete creation, registration, and provision chain for services.

#### 2. Reactive Interface Mismatch
- **Phenomenon**: `Cannot read properties of null (reading 'value')` error.
- **Root Cause**: Properties of the `reactive` object do not match the expected `ref` interface.
- **Solution**: Use `toRef` as an adapter.
  ```typescript
  // Create a two-way bound ref for the property of the reactive object
  const selectedTemplateRef = toRef(optimizer, 'selectedTemplate');
  ```

#### 3. External API Robustness
- **Phenomenon**: API detection failures lead to parsing errors.
- **Root Cause**: Attempting to parse JSON without checking the response content type.
- **Solution**: Check the `Content-Type` response header before parsing.

### Summary
- `reactive` is suitable for managing **a group** of related states, simplifying the top-level API.
- `ref` remains a reliable way to pass **single** reactive variables across components.
- `toRef` and `toRefs` are essential tools for adapting between `reactive` and `ref`.
- The correctness of the dependency injection and service initialization process is the cornerstone for the stable operation of complex applications.

## 💡 Core Experience Summary

1. **Vue Reactive Context**: Vue Composables must be synchronously called at the top level of `<script setup>`.
2. **Reactive Connection Pattern**: Use `watch` to listen for service readiness, keeping the code clear and maintainable.
3. **Fast Failure Principle**: In development environments, quickly exposing issues is more valuable than hiding them.
4. **Unified Architecture**: Maintain a consistent architectural pattern across all Composables.
5. **Type System**: Complex type systems require careful handling of interface matching issues.
6. **Reactive System**: `reactive` and `ref` each have applicable scenarios, and `toRef` is an important adaptation tool.

## 🔗 Related Documents

- [Overview of Web Architecture Refactoring](./README.md)
- [Composable Refactoring Implementation Record](./composables-refactor.md)
- [Architecture Design Principles](./design-principles.md)

---

**Document Type**: Experience Summary  
**Applicable Scope**: Vue Composable architecture development  
**Last Updated**: 2025-07-01