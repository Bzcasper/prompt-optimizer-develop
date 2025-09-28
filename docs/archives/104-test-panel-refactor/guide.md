## **`TestPanel.vue` Component Upgrade Documentation**

### 1. **Objective**

Upgrade the `OutputPanelUI` component used in the `TestPanel.vue` component for displaying "Original Prompt Result" and "Optimized Prompt Result" to a more powerful and unified `OutputDisplay` component.

### 2. **Core Principles**

This upgrade will adhere to the architectural pattern consistent with the usage of `OutputDisplay` in `PromptPanel.vue`, ensuring uniformity and maintainability in the codebase. The core principles are as follows:

*   **Parent Component Owns State**: `TestPanel.vue` will act as the data owner, fully responsible for managing the streaming reception of test results, content storage, and loading state.
*   **Unidirectional Data Flow**: All states (such as content and loading state) will be passed unidirectionally to the child component `OutputDisplay` via `props`.
*   **Separation of Concerns**: `TestPanel.vue` focuses on business logic (how to fetch data), while `OutputDisplay` focuses on view presentation (how to display data).

### 3. **Scope of Upgrade**

*   **File**: `packages/ui/src/components/TestPanel.vue`

### 4. **Detailed Implementation Steps**

#### **4.1. Template (`<template>`) Modifications**

1.  **Remove Markdown Toggle Buttons**:
    *   In the template, locate and completely remove the two `<button>` elements used for toggling Markdown rendering and their related `enableMarkdown` logic. The `OutputDisplay` component has built-in view switching functionality, and external control is no longer needed.

2.  **Replace "Original Prompt Test Result" Panel**:
    *   Find the `div` with `v-show="isCompareMode"`.
    *   Remove the internal `<OutputPanelUI ... />` component.
    *   Add the following new structure in its place:
        ```html
        <h3 class="text-lg font-semibold theme-text truncate mb-3">{{ t('test.originalResult') }}</h3>
        <OutputDisplay
          :content="originalTestResult"
          :streaming="isTestingOriginal"
          mode="readonly"
          class="flex-1 h-full"
        />
        ```

3.  **Replace "Optimized Prompt Test Result" Panel**:
    *   Find the `div` displaying the optimized result.
    *   Remove the internal `<OutputPanelUI ... />` component.
    *   Add the following new structure in its place:
        ```html
        <h3 class="text-lg font-semibold theme-text truncate mb-3">
          {{ isCompareMode ? t('test.optimizedResult') : t('test.testResult') }}
        </h3>
        <OutputDisplay
          :content="optimizedTestResult"
          :streaming="isTestingOptimized"
          mode="readonly"
          class="flex-1 h-full"
        />
        ```

4.  **Remove `ref` Attributes**:
    *   Delete the `ref="originalOutputPanelRef"` and `ref="optimizedOutputPanelRef"` attributes from the template, as they will no longer be used.

#### **4.2. Script (`<script setup>`) Modifications**

1.  **Update Imports**:
    *   Remove `OutputPanelUI` from the import statement of `'./OutputPanel.vue'`.
    *   Add `OutputDisplay` from `'./OutputDisplay.vue'`.
    *   Ensure that `useToast` is imported from `'../composables/useToast'` and initialize `const toast = useToast()`.

2.  **Remove Deprecated States**:
    *   Delete the following `ref` definitions:
        ```javascript
        const originalOutputPanelRef = ref(null)
        const optimizedOutputPanelRef = ref(null)
        const enableMarkdown = ref(true); // If it exists
        ```

3.  **Refactor `testOriginalPrompt` Function**:
    *   This function will be refactored from a delegate pattern to an active management pattern.
    *   The **modified** complete logic should be as follows:
        ```javascript
        const testOriginalPrompt = async () => {
          if (!props.originalPrompt) return

          isTestingOriginal.value = true
          originalTestResult.value = ''
          originalTestError.value = '' // Optional, mainly for debugging
          
          await nextTick(); // Ensure state updates and DOM clearing are completed

          try {
            const streamHandler = {
              onToken: (token) => {
                originalTestResult.value += token
              },
              onComplete: () => { /* No longer need to set isTesting after stream ends, handled by finally */ },
              onError: (err) => {
                const errorMessage = err.message || t('test.error.failed')
                originalTestError.value = errorMessage
                toast.error(errorMessage)
              }
            }

            // ... The logic for constructing systemPrompt and userPrompt remains unchanged ...

            await props.promptService.testPromptStream(
              systemPrompt,
              userPrompt,
              selectedTestModel.value,
              streamHandler
            )
          } catch (error) {
            console.error('[TestPanel] Original prompt test failed:', error); // Add detailed error logging
            const errorMessage = error.message || t('test.error.failed')
            originalTestError.value = errorMessage
            toast.error(errorMessage)
            originalTestResult.value = ''
          } finally {
            // Ensure that the loading state is closed regardless of success or failure
            isTestingOriginal.value = false
          }
        }
        ```

4.  **Refactor `testOptimizedPrompt` Function**:
    *   Apply the exact same refactoring logic as `testOriginalPrompt`, but the target objects are the `optimized` related states (`props.optimizedPrompt`, `isTestingOptimized`, `optimizedTestResult`, `optimizedTestError`).
    *   **Key Enhancement**: Similarly, include `await nextTick()` and `console.error` logging in the `try-catch-finally` structure here.

5.  **Remove `defineExpose`**:
    *   Since there is no longer a need to externally reference the internal `ref` or methods of the component, delete the entire `defineExpose` code block.

### 5. **Expected Results**

*   `TestPanel.vue` no longer relies on `OutputPanel.vue`, but fully utilizes `OutputDisplay.vue`.
*   The test result area has a consistent appearance and interaction with the main optimization panel (such as view switching, fullscreen, etc.), but is restricted to read-only mode.
*   The streaming data display logic has been correctly moved to the `<script>` section of `TestPanel.vue`, resulting in clearer code structure and more reliable state management.
*   The project has eliminated an `OutputPanel.vue` component that was only used for specific scenarios, improving code reusability and consistency.