# Web and Plugin Architecture Refactoring Plan

## 1. Current Status and Issues

**Latest Status (2024-12-29):** Both the underlying and upper-layer application refactoring have been completed.

- **Completed**: The `@prompt-optimizer/core` and `@prompt-optimizer/ui` packages have successfully removed all singleton services.
- **Resolved**: The entry files of the Web application (`@prompt-optimizer/web`) and the browser extension (`@prompt-optimizer/extension`) have been adapted, and the application **can start and run normally**.

This plan aims to document and summarize the adaptation process of `App.vue`.

## 2. Refactoring Goals

- **Fix application startup failure issues** to ensure it runs normally.
- **Fully align the upper-layer application with the underlying service architecture**, using a unified `useAppInitializer` for service initialization.
- **Simplify `App.vue`**, making it responsible only for layout and initialization, delegating business logic entirely to Composables.
- **Adopt the latest Composable architecture**, consuming a returned `reactive` object instead of multiple `ref` Composables.

## 3. Implementation Plan

### Phase One: Purify UI Package (Completed) ✅

1.  **File**: `packages/ui/src/index.ts`
    -   **Task**: Remove all re-exported service instances from `@prompt-optimizer/core`.
    -   **Status**: ✅ **Completed**. The UI package now only exports components, Composables, factory functions, and types.

### Phase Two: Create Unified Application Initializer (Completed) ✅

1.  **File**: `packages/ui/src/composables/useAppInitializer.ts` (New)
    -   **Task**: Create a Vue Composable that creates and returns instances of all necessary services based on the environment (Web/Electron).
    -   **Status**: ✅ **Completed**.

### Phase Three: Refactor Application Entry (Completed) ✅

This phase is the core of this refactoring and has been **successfully completed**.

1.  **Files**: `packages/web/src/App.vue` and `packages/extension/src/App.vue`
    -   **Status**: ✅ **Completed**. The application can now start normally.
    -   **Final Implementation Plan**:
        1.  **[x] Clean up invalid imports**:
            -   In `<script setup>`, all direct imports of singleton services (`modelManager`, `templateManager`, etc.) have been removed.
        2.  **[x] Depend on `useAppInitializer`**:
            -   At the top level, call `const { services, isInitializing } = useAppInitializer()` as the sole source for obtaining all services.
        3.  **[x] Call all business Composables at the top level**:
            -   Following the results of the [Composable Refactoring Plan](./composables-refactor-plan.md), all business logic Composables (such as `usePromptOptimizer`, `useModelManager`) are called at the top level of `<script setup>`.
            -   These Composables receive the `services` ref as a parameter and return a single `reactive` object.
            -   **Example Code**:
                ```typescript
                // App.vue
                const { services, isInitializing, error } = useAppInitializer();
                
                // Directly call at the top level, passing in services ref
                const modelManagerState = useModelManager(services);
                const templateManagerState = useTemplateManager(services);
                const optimizerState = usePromptOptimizer(services);
                // ... other Composables
                ```
        4.  **[x] Update template (`<template>`)**:
            -   All data bindings and event handling in the template are now linked to properties of the `reactive` object returned by the Composables (e.g., `optimizerState.isIterating`).
            -   This resolves the previous prop type validation failure issues caused by passing `ref` objects.
        5.  **[x] Fix `computed` and type errors**:
            -   Corrected the `computed` properties in `App.vue` to no longer incorrectly access `.value`.
            -   Added missing i18n translation entries, such as `promptOptimizer.originalPromptPlaceholder`.
            -   Correctly passed deep dependencies like `templateLanguageService` through `provide`.
        6.  **[x] Promote `provide`/`inject`**:
            -   Retained `provide('services', services)` and encouraged child components (like `ModelSelect.vue`, `DataManager.vue`) to obtain services through `inject`, reducing props passing.

## 4. Expected Outcomes (Achieved)

- [x] Web and plugin applications have returned to normal, with functionality consistent with before the refactor.
- [x] The code in `App.vue` has become extremely concise, responsible only for "initialization" and "layout."
- [x] The entire application's startup process is clear and robust, fully adhering to best practices of dependency injection and reactive data flow.
- [x] A solid foundation has been laid for adding new features across all platforms (Web/Plugin/Desktop) in the future.

## 5. Latest Progress: Purify UI Subcomponents (Completed) ✅

**Background**: After completing the adaptation of `App.vue` to `useAppInitializer`, it was found that several UI components (`@prompt-optimizer/ui/components/*`) still directly imported singleton services from `@prompt-optimizer/core`, violating the new dependency injection architecture and potentially leading to bugs and testing difficulties.

**Task**: Completely remove the UI component layer's direct dependency on service singletons, changing to receive service instances via `props`.

**Implementation Checklist**:
- [x] **`TemplateSelect.vue`**: Removed direct import of `templateManager`, changed to receive via props.
- [x] **`ModelSelect.vue`**: Removed direct import of `modelManager`, changed to receive via props.
- [x] **`OutputDisplayCore.vue`**: Removed direct import of `compareService`, changed to receive via props.
- [x] **`HistoryDrawer.vue`**: Removed direct import of `historyManager` (this component already receives data via props, just needed to clean up unused imports).
- [x] **`BuiltinTemplateLanguageSwitch.vue`**: Removed direct import of `templateManager` and `templateLanguageService`, changed to receive via props.
- [x] **`DataManager.vue`**: Removed direct import of `dataManager`, changed to receive via props or inject from `services`.
- [x] **`TemplateManager.vue`**: Ensured `templateManager` and `templateLanguageService` are obtained from `services` injection and correctly passed to child components.

**Outcomes**:
- All core UI display components have been decoupled from the service layer.
- The reusability and testability of components have significantly improved.
- The entire frontend architecture aligns more closely with the principle of "depending on interfaces rather than implementations."
- The project's architectural consistency has been ensured, clearing obstacles for future maintenance and iteration.