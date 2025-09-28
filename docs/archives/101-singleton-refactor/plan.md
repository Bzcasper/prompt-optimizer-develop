# Singleton Refactor Plan

## 1. Problem Background

After thorough investigation, we discovered a core flaw in the current architecture: **service instances are created too early during module import (Eager Instantiation)** and exported and passed as singletons (Singleton) across multiple packages.

This has led to the following serious issues:

1.  **"Phantom" Services**: A set of Web services based on `Dexie` (IndexedDB) was inadvertently created in the Electron rendering process. Although these services were never ultimately used, they consumed resources and created a false impression of data chaos.
2.  **State Inconsistency**: The creation of service instances is unaware of the runtime environment, leading to state inconsistencies between the UI process (which sees the Web version instance state) and the main process (which executes the logic).
3.  **Architectural Coupling**: The `@prompt-optimizer/ui` package unnecessarily exported core service instances, blurring its responsibilities and making it more of a service relay station rather than a pure UI library.
4.  **Testing Difficulties**: The singleton pattern made it very difficult to isolate and mock services during testing.

## 2. Refactor Goals

The core goal of this refactor is to **achieve lazy initialization of services and dependency injection**, ensuring that a unique and correct service instance is created only when needed and in the correct environment.

- **Remove Singleton Exports**: No package (`core`, `ui`) should export pre-created service instances anymore.
- **Unified Initialization Entry**: Create a single, environment-aware application initializer.
- **Clear Responsibility Division**: The `core` package should only provide service classes and factory functions, while `ui` should only provide UI components and Hooks. The application entry (`App.vue`) is responsible for orchestration.

## 3. Implementation Plan and Results

This refactor has been **successfully completed**. All core services have been migrated from the singleton pattern to factory functions and dependency injection, achieving the goal of creating service instances on demand and based on the environment.

### Phase One: Transform Core Package, Remove Singleton Exports (Completed) ✅

**Goal**: Change all service singleton export patterns (`export const service = new Service()`) to factory function patterns (`export function createService()`).

**Steps**:
1.  [x] **`services/storage/factory.ts`**: Removed `storageProvider` singleton export.
2.  [x] **`services/model/manager.ts`**: Removed `modelManager` singleton export and made its factory function accept dependencies.
3.  [x] **`services/template/manager.ts`**: Removed `templateManager` singleton export and made its factory function accept dependencies.
4.  [x] **`services/history/manager.ts`**: Removed `historyManager` singleton export and made its factory function accept dependencies.
5.  [x] **`index.ts`**: Updated the entry file to ensure only modules and factory functions are exported.

**Deviations Found and Handling**:

*   **Deep Dependency of `TemplateManager`**:
    *   **Discovery**: `TemplateManager` depended on another unnoticed singleton `templateLanguageService`.
    *   **Action**: Refactored `services/template/languageService.ts` similarly, removing the singleton and creating the `createTemplateLanguageService` factory function. Accordingly, `createTemplateManager` now accepts both `storageProvider` and `languageService` instances as parameters.

*   **Export Cleanup in `index.ts`**:
    *   **Discovery**: `index.ts` exported the application-level `electron-proxy.ts` file.
    *   **Action**: Cleaned up `index.ts`, removing exports that should not be exposed by the `core` package, making the API cleaner.

### Phase Two: Purify UI Package, Stop Exporting Services (Completed) ✅

**Goal**: Return `@prompt-optimizer/ui` to its pure UI library responsibilities.

6.  **`packages/ui/src/index.ts`**
    - [x] **Removed** all service instances re-exported from `@prompt-optimizer/core`. The UI package has returned to its pure UI library responsibilities.

### Phase Three: Create a Unified Application Initializer (Completed) ✅

**Goal**: Consolidate all initialization logic into a reusable `composable`.

7.  **File**: `packages/ui/src/composables/useAppInitializer.ts` (New)
    - [x] **Created file** and implemented the following logic:
        - Import all `create...` factory functions and Electron proxy classes.
        - Define `services` and `isInitializing` refs.
        - In `onMounted`, determine the environment using `isRunningInElectron()`:
            - **If Electron**: Create proxy instances for all services.
            - **If Web**: Create all **real** service instances (including `storageProvider`).
            - Aggregate all service instances into the `services` ref.
            - Update `isInitializing` state.

### Phase Four: Refactor Application Entry (`App.vue`) (Completed) ✅

**Goal**: Simplify the application entry to only consume the services returned by the initializer.

8.  **Modify `packages/web/src/App.vue` & `packages/extension/src/App.vue`**
    - [x] **Completed**: The application entry for both Web and plugin has been refactored to consume services returned by `useAppInitializer`, achieving a clear initialization flow.
    - [x] **Deepened**: Further refactored all UI child components under `App.vue` (such as `ModelSelect`, `TemplateSelect`, etc.) to no longer directly import service singletons, but instead receive service instances via `props` or `inject`, thoroughly completing the architectural unification of the UI layer.

## 4. Expected Outcomes (Achieved)

-   [x] **No "Phantom" Services**: `Dexie` will only be created once in the Web environment.
-   [x] **Clear Data Flow**: The dependency chain has become `useAppInitializer` -> `App.vue` -> `Components`, unidirectional and clear.
-   [x] **Robust Initialization**: All services are created at the right time and with the correct configuration.
-   [x] **Thoroughly Resolved State Inconsistency Issues**: Because the logic for creating service instances is unified and unique.

This plan fundamentally addresses the architectural issues we identified, laying a solid foundation for the project's future maintainability and scalability.

## 5. Reflections on the Refactor and Subsequent Decisions

This refactor successfully transitioned core services from the singleton pattern to the factory function pattern, addressing the fundamental issues of environmental isolation and state inconsistency. However, in the process of fixing numerous test failures that arose from this, we also gathered valuable insights and identified design decisions that need further refinement:

### 5.1 Regarding Mandatory Call to `ensureInitialized()`

- **Current Reflection**: The current design requires callers to manually invoke `await manager.ensureInitialized()` after obtaining the `Manager` instance to complete asynchronous initialization. While this decouples the instance creation and initialization process, it also exposes internal implementation details, increasing the burden on callers.
- **Optimization Direction**: An ideal design would be to make the factory function (like `createTemplateManager`) itself an asynchronous function, handling all initialization logic internally and directly returning a fully usable instance `Promise<Manager>`. This way, callers only need to `await` once, resulting in a cleaner interface and better encapsulation.
- **Decision**: **Temporarily accept** the current design but mark it as a **point for future optimization**. The current core task is to stabilize the refactored code.

### 5.2 Regarding Error Handling: Adhering to the "Fail-Fast" Principle

- **Issue Discovery**: The refactored `TemplateManager` silently degrades to using built-in templates when encountering storage errors during initialization, instead of throwing errors.
- **Decision**: This obscures serious underlying issues and violates the "fail-fast" principle. We decided to **correct this behavior**. The `TemplateManager` must **throw exceptions** when encountering critical errors like storage access during initialization. The top-level application logic will capture and decide how to handle these (e.g., reporting errors to the user, entering safe mode, etc.).

### 5.3 Regarding the Rigor of Test Code

- **Issue Discovery**: Some old unit tests were not rigorous enough.
- **Decision and Outcome**: **Fixed**. During the testing repair phase of this refactor, a large number of assertions were rewritten, using `expect.objectContaining` and other methods to enhance the stability and reliability of tests. All core tests have passed.

### 5.4 Chain Reactions in the UI Layer and Responses

- **Discovery**: The "de-singletonization" refactor of core services had a more significant impact on the upper UI and Composables than expected. The previous direct import of singletons was disrupted, triggering a series of chain issues including `property type check failures`, `loss of reactive state`, and `uninitialized services`.
- **Response**: We developed dedicated [`composables-refactor-plan.md`](./composables-refactor-plan.md) and [`web-refactor-plan.md`](./web-refactor-plan.md) for this. The core strategies are: 1) Refactor Composables that return multiple `ref`s to return a single `reactive` object to resolve property passing issues. 2) At the component level, inject services through the `provide/inject` mechanism to reduce prop drilling. This experience indicates that significant changes in the underlying architecture must be accompanied by thorough assessments of their impact on upper-layer applications and detailed refactor plans.

## 6. Detailed Modification List

All items in this list have been completed in recent commits.

### **Phase One: Transform Core Package**

1.  **File**: `packages/core/src/services/storage/factory.ts`
    - [x] **Deleted** (around L125): `export const storageProvider = StorageFactory.createDefault();`

2.  **File**: `packages/core/src/services/model/manager.ts`
    - [x] **Deleted** (around L427): `export const modelManager = ...`
    - [x] **Modified** (around L428): `export function createModelManager(storageProvider?: IStorageProvider): ModelManager`
        - **Changed to**: `export function createModelManager(storageProvider: IStorageProvider): ModelManager`
        - **Removed**: `storageProvider = storageProvider || StorageFactory.createDefault();`

3.  **File**: `packages/core/src/services/template/manager.ts`
    - [x] **Deleted** (around L300): `export const templateManager = ...`

4.  **File**: `packages/core/src/services/history/manager.ts`
    - [x] **Deleted** (around L230): `export const historyManager = ...`

5.  **File**: `packages/core/src/services/data/manager.ts`
    - [x] **Deleted** (around L80): `export const dataManager = ...`
    - [x] **Modified** (constructor): `constructor()` -> `constructor(modelManager: IModelManager, templateManager: ITemplateManager, historyManager: IHistoryManager)`
    - [x] **Modified** (factory function): `createDataManager()` -> `createDataManager(modelManager: IModelManager, templateManager: ITemplateManager, historyManager: IHistoryManager)`

### **Phase Two: Purify UI Package**

6.  **File**: `packages/ui/src/index.ts`
    - [x] **Deleted** (around L45-53):
        ```typescript
        export {
            templateManager,
            modelManager,
            historyManager,
            dataManager,
            storageProvider,
            createLLMService,
            createPromptService
        } from '@prompt-optimizer/core'
        ```
    - [x] **Added**: Export `createDataManager` and other necessary factory functions.

### **Phase Three: Create a Unified Application Initializer**

7.  **File**: `packages/ui/src/composables/useAppInitializer.ts` (New)
    - [x] **Created file** and implemented the following logic:
        - Import all `create...` factory functions and Electron proxy classes.
        - Define `services` and `isInitializing` refs.
        - In `onMounted`, determine the environment using `isRunningInElectron()`:
            - **If Electron**: Create proxy instances for all services.
            - **If Web**: Create all **real** service instances (including `storageProvider`).
            - Aggregate all service instances into the `services` ref.
            - Update `isInitializing` state.

### **Phase Four: Refactor Application Entry**

8.  **File**: `packages/web/src/App.vue` & `packages/extension/src/App.vue`
    - [x] **Removed**: All imports of service singletons like `modelManager`, `templateManager`, `historyManager`, etc.
    - [x] **Replaced**:
        - **Old**: `import { modelManager, ... } from '@prompt-optimizer/ui'`
        - **New**: `import { useAppInitializer } from '@prompt-optimizer/ui'`
    - [x] **Called**: `const { services, isInitializing } = useAppInitializer();`
    - [x] **Wrapped**: Used `v-if="!isInitializing"` on the root element of the template and added a loading state with `v-else`.
    - [x] **Passed**: Passed `services.value` as props to required child components, or used `services.value.modelManager` in the `composable`.
    - [x] **Cleaned**: Removed manual initialization logic in `onMounted`.