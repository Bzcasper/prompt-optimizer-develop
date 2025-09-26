# Vue Composable Architecture Refactoring Plan

## 1. Background and Issues

After refactoring the core services to "de-singletonize" them, a series of serious issues related to Vue's reactivity system and component communication were exposed during application startup. These issues initially manifested as various warnings and errors:

1.  **Property Type Mismatch**: The props type received by child components did not match expectations, such as expecting `Boolean` but receiving `Object` (`[Vue warn]: Invalid prop: type check failed`). This issue is prevalent in multiple components like `PromptPanel`.
2.  **Invalid Watch Source**: Composables like `useStorage` had not initialized their dependent `services` object, leading to `watch` listening to an `undefined` source (`[Vue warn]: Invalid watch source: undefined`).
3.  **Top-Level Call Error**: An attempt to call Composables in certain asynchronous initialization logic resulted in Vue throwing a `Must be called at the top of a 'setup' function` error.

## 2. Root Cause Analysis

Upon investigation, these seemingly scattered issues pointed to a single systemic architectural flaw: **Improper state encapsulation pattern of Composables**.

Many business logic Composables (like `usePromptOptimizer`, `useModelManager`) returned a plain JavaScript object containing multiple `ref`s, structured as follows:

```typescript
// Old Pattern
function usePromptOptimizer() {
  const isIterating = ref(false);
  const someOtherState = ref('');
  return { isIterating, someOtherState }; 
}
```

When used in `App.vue`:

```html
<!-- App.vue -->
<script setup>
const optimizer = usePromptOptimizer();
</script>

<template>
  <!-- 
    The issue: optimizer.isIterating is a ref object,
    rather than its internal value. Vue's template auto-unpacking does not delve into object properties.
  -->
  <PromptPanel :is-iterating="optimizer.isIterating" />
</template>
```

The `is-iterating` prop received by the `PromptPanel` component is a `Ref<boolean>` object instead of the expected `boolean` value, causing type check failures. This issue is at the core of all the chain reactions.

## 3. Solution: Return a Unified `reactive` Object

To fundamentally resolve the issue, we made a unified architectural decision: **Refactor all core business Composables to return a single `reactive` object**.

```typescript
// ✅ New Pattern
function usePromptOptimizer() {
  const state = reactive({
    isIterating: false,
    someOtherState: '',
  });
  
  // ... logic code modifies state ...

  return state; // Return a reactive object
}
```

When used in `App.vue`, the problem is resolved:

```html
<!-- App.vue (after modification) -->
<script setup>
const optimizerState = usePromptOptimizer();
</script>

<template>
  <!-- 
    Now optimizerState.isIterating is directly a boolean value,
    meeting the expectations of the child component's prop.
  -->
  <PromptPanel :is-iterating="optimizerState.isIterating" />
</template>
```

This pattern ensures that the value passed to child components is the primitive value rather than a `ref` wrapper, while maintaining cross-component state reactivity.

## 4. Implementation Process and Results (Completed) ✅

This refactoring has been **successfully completed**.

**Core Refactoring**:
- [x] **`usePromptOptimizer`**: Refactored to return a `reactive` object.
- [x] **`useModelManager`**: Refactored to return a `reactive` object.
- [x] **`useHistoryManager`**: Refactored to return a `reactive` object.
- [x] **`useTemplateManager`**: Refactored to return a `reactive` object.
- [x] **`usePromptTester`**: Refactored to return a `reactive` object.
- [x] **`useModals`**: Refactored to return a `reactive` object.

**Auxiliary Fixes**:
- [x] **Fix `useStorage`**: The `ThemeToggleUI` and `LanguageSwitch` components were modified to obtain the `services` instance via `inject` and pass it to `useStorage`, resolving the issue of premature initialization of dependencies.
- [x] **Adapt `App.vue`**: Adjusted the template bindings and `computed` properties in `App.vue` to accommodate the new `reactive` state structure and fixed the resulting type errors.
- [x] **Dependency Injection**: Promoted the use of `inject` to directly obtain dependencies from `services` in components like `ModelSelect` and `DataManager`, simplifying the template in `App.vue`.

**Final Results**:
- Completely resolved all Vue `warn` and `error` messages during startup.
- Established a more robust, predictable state management paradigm that aligns with Vue best practices.
- The application code, particularly `App.vue`, has become more concise and maintainable.

## 5. Lessons Learned

- **`reactive` vs. Object-Wrapped `ref`**: For a set of highly cohesive reactive states that will be passed or operated on together, using `reactive` encapsulation is a superior pattern compared to returning an object containing multiple `ref`s. It effectively avoids deep unpacking issues and simplifies consumer-side code.
- **`provide`/`inject` as a Service Injection Tool**: For global or cross-level services/dependencies (like the `services` object), using `provide`/`inject` is a more elegant and efficient solution than passing `props` through multiple layers.
- **Systemic Problems Require Systemic Solutions**: When faced with a series of seemingly different errors, it is crucial to analyze their common root causes. By identifying the core issue of "state encapsulation pattern," we resolved all surface symptoms in one go.