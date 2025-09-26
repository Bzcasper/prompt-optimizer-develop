# Template Management Troubleshooting Checklist

## Common Issues and Solutions

### 1. Template Deletion Error: "Template not found"

**Symptoms:**
- An error `TemplateError: Template not found: template-xxx` occurs when deleting a template.
- The error is typically thrown at line `index.js:1683`.

**Causes:**
- Missing `await` keyword in asynchronous method calls.
- Timing issue: `deleteTemplate` and `loadTemplates` are executed concurrently.
- The template is accessed by other operations during the deletion process.

**Solutions:**
1. Ensure all asynchronous template operations use `await`:
   ```javascript
   // ❌ Incorrect
   getTemplateManager.value.deleteTemplate(templateId)
   await loadTemplates()
   
   // ✅ Correct
   await getTemplateManager.value.deleteTemplate(templateId)
   await loadTemplates()
   ```

2. Check asynchronous calls in the following functions:
   - `confirmDelete()`
   - `handleSubmit()`
   - `handleFileImport()`
   - `applyMigration()`

### 2. Template Type Error: Adding Template Type Still Incorrect After Switching Categories in Management Interface

**Symptoms:**
- Switch to user prompt category in the template management interface, but clicking the add button still adds a system prompt template.
- The added template type does not match the currently displayed category.

**Causes:**
- **Core Issue**: The `getCurrentTemplateType()` function returns a fixed `props.templateType`, which does not change with the user's category switch in the management interface.
- Incorrect source of the template type used when adding a template.

**Important Concept Clarification:**
- **Category Switching in Template Management Interface**: Users can switch to view different types of templates in the management interface.
- **Behavior of the Add Button**: It should determine what type of template to add based on the currently displayed category.
  - Currently displayed system prompt category → Add system prompt template (`templateType: 'optimize'`)
  - Currently displayed user prompt category → Add user prompt template (`templateType: 'userOptimize'`)
  - Currently displayed iteration prompt category → Add iteration prompt template (`templateType: 'iterate'`)

**Solutions:**
1. Fix the `getCurrentTemplateType()` function to determine based on the current category instead of props:
   ```javascript
   // ❌ Incorrect: Using fixed props value
   function getCurrentTemplateType() {
     return props.templateType
   }

   // ✅ Correct: Determine based on current category
   function getCurrentTemplateType() {
     switch (currentCategory.value) {
       case 'system-optimize': return 'optimize'
       case 'user-optimize': return 'userOptimize'
       case 'iterate': return 'iterate'
       default: return 'optimize'
     }
   }
   ```

2. Ensure the category switch button correctly updates `currentCategory`:
   ```javascript
   @click="currentCategory = 'user-optimize'"
   ```

3. Verify that the correct template type is used when adding a template:
   ```javascript
   templateType: getCurrentTemplateType() // Now returns the correct type based on the current category
   ```

### 3. Incorrect Opening Position of Template Manager

**Symptoms:**
- Clicking manage from the system optimization prompt dropdown opens another category.
- Opening the template manager from the navigation bar locates to the wrong category.
- The initial location of the template manager does not match the source of the opening.

**Causes:**
- `currentCategory` is set only during component initialization and does not respond to changes in `props.templateType`.
- Incorrect default logic used when opened from the navigation bar.

**Solutions:**
1. Add a watcher for changes in `props.templateType`:
   ```javascript
   // Watch for changes in props.templateType and update current category
   watch(() => props.templateType, (newTemplateType) => {
     currentCategory.value = getCategoryFromProps()
   }, { immediate: true })
   ```

2. Fix the default logic for opening from the navigation bar:
   ```javascript
   // ❌ Incorrect: Deciding based on current optimization mode
   const openTemplateManager = (templateType?: string) => {
     currentTemplateManagerType.value = templateType || (selectedOptimizationMode.value === 'system' ? 'optimize' : 'userOptimize')
   }

   // ✅ Correct: Default to system optimization prompt
   const openTemplateManager = (templateType?: string) => {
     currentTemplateManagerType.value = templateType || 'optimize'
   }
   ```

3. Ensure correct positioning rules:
   - From system optimization prompt dropdown → Locate to system optimization prompt category.
   - From user optimization prompt dropdown → Locate to user optimization prompt category.
   - From iteration prompt dropdown → Locate to iteration prompt category.
   - From navigation bar → Locate to system optimization prompt category (default first).

### 4. Template Save Failure

**Symptoms:**
- An error occurs when saving a template.
- The template list does not update.

**Checklist:**
- [ ] Is `saveTemplate()` called with `await`?
- [ ] Is `loadTemplates()` called with `await`?
- [ ] Is the template data format correct?
- [ ] Does the template ID meet format requirements (at least 3 characters, only lowercase letters, numbers, and hyphens)?

### 5. Template Import Failure

**Symptoms:**
- An error occurs when importing a JSON file.
- The template list does not update after import.

**Checklist:**
- [ ] Is `importTemplate()` called with `await`?
- [ ] Is `loadTemplates()` called with `await`?
- [ ] Is the JSON file format correct?
- [ ] Does the template schema validation pass?

### 6. Architectural Design Principles

**Service Dependency Injection:**
- [ ] Use dependency injection instead of directly creating service instances.
- [ ] Avoid using `StorageFactory.createDefault()` in UI components.
- [ ] Ensure service instances remain consistent throughout the application.

**Error Handling:**
- [ ] Throw exceptions immediately instead of handling them silently.
- [ ] Avoid retry mechanisms that obscure issues.
- [ ] Fail fast when service checks fail.

**Asynchronous Operations:**
- [ ] All asynchronous method calls must use `await`.
- [ ] Avoid concurrent execution of potentially conflicting operations.
- [ ] Ensure the correctness of operation order.

### 7. Code Review Checklist

**Check during template management related code reviews:**
- [ ] Are all `templateManager` method calls correctly using `await`?
- [ ] Are asynchronous functions correctly declared as `async`?
- [ ] Is error handling complete?
- [ ] Is there a risk of race conditions?
- [ ] Is the template ID generation and validation logic correct?
- [ ] Have harmful default values been removed?
- [ ] Is the optimization mode correctly passed to all relevant components?

### 8. Testing Recommendations

**Unit Tests:**
- [ ] Test asynchronous behavior of template CRUD operations.
- [ ] Test exception handling in error scenarios.
- [ ] Test safety of concurrent operations.

**Integration Tests:**
- [ ] Test the complete template management process.
- [ ] Test interaction between UI components and service layer.
- [ ] Test IPC communication in the Electron environment.

### 9. Iteration Page Template Selection Not Updating After Built-in Template Language Switch

**Symptoms:**
- After switching built-in template languages in the template management interface, the dropdown for optimization prompts on the main interface updates correctly.
- However, after executing optimization and clicking "Continue Optimization," the template selection on the iteration page displays the old language's template name.
- The dropdown list has updated to the new language, but the currently selected item is still the old language.
- The new language takes effect when sending requests (because it is retrieved again via templateId).

**Root Cause:**
- **Different Event Propagation Paths**: The TemplateSelect components on the main interface and iteration page are at different levels.
- **Component Hierarchy Differences**:
  - Main Interface: `App.vue → TemplateSelectUI` (direct reference)
  - Iteration Page: `App.vue → PromptPanelUI → TemplateSelect` (indirect reference)
- **Lack of Refresh Mechanism**: Language switch events cannot propagate to the deeper TemplateSelect component.

**Detailed Analysis:**
1. **Reason for Normal Behavior on Main Interface**:
   - When TemplateManager closes, it automatically calls `templateSelectRef?.refresh?.()`.
   - The component hierarchy is simple, and the event propagation path is short.
   - There is a direct reference and refresh mechanism.

2. **Reason for Abnormal Behavior on Iteration Page**:
   - The TemplateSelect on the iteration page is not included in the refresh logic for language switching.
   - The component hierarchy is deeper, requiring additional event propagation mechanisms.
   - A complete event propagation chain was not previously established.

**Solutions:**
1. **Establish Event Propagation Chain**:
   ```javascript
   // TemplateManager.vue - Emit language change event
   const handleLanguageChanged = async (newLanguage: string) => {
     // ... existing logic ...

     // Emit language change event to notify parent component
     emit('languageChanged', newLanguage)
   }
   ```

2. **Handle Event in App.vue and Propagate**:
   ```javascript
   // Handle template language change
   const handleTemplateLanguageChanged = (newLanguage: string) => {
     // Refresh the template selection component on the main interface
     if (templateSelectRef.value?.refresh) {
       templateSelectRef.value.refresh()
     }

     // Refresh the template selection component on the iteration page
     if (promptPanelRef.value?.refreshIterateTemplateSelect) {
       promptPanelRef.value.refreshIterateTemplateSelect()
     }
   }
   ```

3. **Expose Refresh Method in PromptPanel**:
   ```javascript
   // PromptPanel.vue - Expose method to refresh iteration templates
   const refreshIterateTemplateSelect = () => {
     if (iterateTemplateSelectRef.value?.refresh) {
       iterateTemplateSelectRef.value.refresh()
     }
   }

   defineExpose({
     refreshIterateTemplateSelect
   })
   ```

**Fix Verification:**
- [x] Language switch events correctly propagate to all TemplateSelect components.
- [x] The dropdown list on the iteration page correctly updates to the new language.
- [x] Users can select templates in the correct language on the iteration page.
- [x] Main interface and iteration page behaviors are consistent.

**Experience Summary:**
1. **Component Hierarchy Affects Event Propagation**: Deeper components require additional event propagation mechanisms.
2. **Unified Refresh Mechanism**: All related components should have a unified refresh interface.
3. **Complete Event Chain**: Ensure events can propagate to all components that need to respond.
4. **Architectural Consistency**: Components with the same functionality should have the same response mechanisms.

### 10. Monitoring and Debugging

**Logging:**
- [ ] Log the start and end of template operations.
- [ ] Log the timing of asynchronous operations.
- [ ] Log detailed context of errors.

**Debugging Tips:**
- [ ] Use browser developer tools to inspect asynchronous call stacks.
- [ ] Check the initialization state of the template manager.
- [ ] Validate the integrity of template data.

## Preventive Measures

1. **Code Standards:**
   - All asynchronous template operations must use `await`.
   - Asynchronous functions must be declared as `async`.
   - Error handling must be complete.
   - Remove all harmful default values, especially those related to optimization modes.

2. **Architectural Principles:**
   - Use dependency injection to manage service instances.
   - Avoid directly creating services in the UI layer.
   - Maintain consistency of service instances.

3. **Test Coverage:**
   - Write unit tests for all template operations.
   - Test the correctness of asynchronous operations.
   - Test error handling scenarios.

4. **Code Review:**
   - Focus on checking the correctness of asynchronous operations.
   - Verify the completeness of error handling.
   - Ensure adherence to architectural principles.