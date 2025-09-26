# Event Propagation Mechanism Fix - Built-in Template Language Switch Bug

## 🎯 Problem Description

### Core Issue
After switching the built-in template language, the optimization prompt dropdown in the main interface updates correctly, but the template selection on the iteration page displays the old language's template name.

### Problem Manifestation
1. **Main Interface Normal**: The optimization prompt dropdown switches correctly from "通用优化" to "General Optimization".
2. **Iteration Page Abnormal**:
   - The currently selected item shows "通用迭代" (Chinese).
   - The dropdown list shows "General Iteration" (English).
   - Users need to manually reselect to use the English template.
3. **Actual Request Normal**: The new language takes effect when sending requests (because it retrieves again via templateId).

### User Experience Impact
- Causes user confusion: UI display inconsistency.
- Requires extra operation: Users must manually reselect the template.
- Incomplete functionality: The language switch feature does not fully take effect.

## 🔍 Root Cause Analysis

### Component Hierarchy Differences
**Main Interface Optimization Prompt Dropdown (Normal):**
```
App.vue
└── TemplateSelectUI (ref="templateSelectRef")
```

**Iteration Page Template Dropdown (Abnormal):**
```
App.vue
└── PromptPanelUI (ref="promptPanelRef")
    └── TemplateSelect (ref="iterateTemplateSelectRef")
```

### Event Propagation Path Differences
**Main Interface Refresh Mechanism:**
1. `TemplateManager` automatically calls `templateSelectRef?.refresh?.()` when closed.
2. Direct reference, short event propagation path.
3. Has a complete refresh mechanism.

**Iteration Page Issue:**
1. Language switch events cannot propagate to the deeper TemplateSelect component.
2. The component hierarchy is deeper, requiring an additional event propagation mechanism.
3. A complete event propagation chain was not established previously.

### Technical Details
1. **Event Source**: `BuiltinTemplateLanguageSwitch` emits `languageChanged` event.
2. **Processing Layer**: `TemplateManager` handles the event and updates its own state.
3. **Propagation Breakpoint**: The event does not continue to propagate to the App.vue level.
4. **Impact Scope**: Only components within TemplateManager are updated.

## 🔧 Solution

### 1. Establish Event Propagation Chain

**TemplateManager.vue** - Emit language change event:
```javascript
const handleLanguageChanged = async (newLanguage: string) => {
  // Reload template list to reflect the new language
  await loadTemplates()

  // If the currently selected template is a built-in template, it needs to be reselected to get the new language version
  const currentSelected = selectedTemplate.value
  if (currentSelected && currentSelected.isBuiltin) {
    try {
      const updatedTemplate = await getTemplateManager.value.getTemplate(currentSelected.id)
      if (updatedTemplate) {
        emit('select', updatedTemplate, getCurrentTemplateType());
      }
    } catch (error) {
      // Error handling logic...
    }
  }

  // 🔑 Key fix: Emit language change event to notify parent component
  emit('languageChanged', newLanguage)
}
```

**Event Definition:**
```javascript
const emit = defineEmits(['close', 'select', 'update:show', 'languageChanged'])
```

### 2. App.vue Handle Event and Propagate

**Listen for Language Change Event:**
```vue
<TemplateManagerUI 
  v-if="isReady" 
  v-model:show="templateManagerState.showTemplates" 
  :templateType="templateManagerState.currentType" 
  @close="() => templateManagerState.handleTemplateManagerClose(() => templateSelectRef?.refresh?.())"
  @languageChanged="handleTemplateLanguageChanged"
/>
```

**Handle Language Change:**
```javascript
// Handle template language change
const handleTemplateLanguageChanged = (newLanguage: string) => {
  console.log('[App] Template language switched:', newLanguage)
  
  // Refresh the template selection component in the main interface
  if (templateSelectRef.value?.refresh) {
    templateSelectRef.value.refresh()
  }
  
  // 🔑 Key fix: Refresh the template selection component on the iteration page
  if (promptPanelRef.value?.refreshIterateTemplateSelect) {
    promptPanelRef.value.refreshIterateTemplateSelect()
  }
}
```

**Add Component References:**
```javascript
const templateSelectRef = ref<{ refresh?: () => void } | null>(null)
const promptPanelRef = ref<{ refreshIterateTemplateSelect?: () => void } | null>(null)
```

### 3. PromptPanel Expose Refresh Method

**Add Iteration Template Selection Component Reference:**
```vue
<TemplateSelect
  ref="iterateTemplateSelectRef"
  :modelValue="selectedIterateTemplate"
  @update:modelValue="$emit('update:selectedIterateTemplate', $event)"
  :type="templateType"
  :optimization-mode="optimizationMode"
  :services="services"
  @manage="$emit('openTemplateManager', templateType)"
/>
```

**Expose Refresh Method:**
```javascript
const iterateTemplateSelectRef = ref<{ refresh?: () => void } | null>(null);

// Expose method to refresh iteration template selection
const refreshIterateTemplateSelect = () => {
  if (iterateTemplateSelectRef.value?.refresh) {
    iterateTemplateSelectRef.value.refresh()
  }
}

defineExpose({
  refreshIterateTemplateSelect
})
```

## ✅ Fix Verification

### Testing Steps
1. Open the application and confirm the main interface displays the Chinese template.
2. Click "功能提示词" to open the template management interface.
3. Click the "中文" button to switch to "English".
4. Confirm the main interface optimization prompt dropdown updates to English.
5. Enter test content and execute optimization.
6. Click "继续优化" to open the iteration page.
7. **Key Verification**: Confirm the template selection on the iteration page correctly displays the English template.

### Verification Results
- [x] Language switch event correctly propagates to all TemplateSelect components.
- [x] The dropdown list on the iteration page correctly updates to the new language.
- [x] Users can directly use the correctly language template on the iteration page.
- [x] Main interface and iteration page behaviors are consistent.
- [x] No need for users to manually reselect the template.

## 💡 Experience Summary

### Architectural Design Principles
1. **Event Propagation Completeness**: Ensure state change events can propagate to all relevant components.
2. **Component Hierarchy Awareness**: Deeper components require additional event propagation mechanisms.
3. **Unified Response Mechanism**: Components with the same functionality should have the same response mechanism.
4. **Interface Consistency**: All relevant components should expose a unified refresh interface.

### Best Practices
1. **Establish Complete Event Chain**: A complete path from event source to all consumers.
2. **Use ref and defineExpose**: Provide external access interfaces for deeper components.
3. **Unified Refresh Mechanism**: All TemplateSelect components have a refresh method.
4. **Logging**: Add appropriate logs to help debug event propagation.

### Pitfalls to Avoid
1. **Assuming Events Will Automatically Propagate**: Vue's event system does not automatically propagate downwards.
2. **Ignoring Component Hierarchy Differences**: Components at different levels require different handling methods.
3. **Incomplete Fixes**: Only fixing part of the components while ignoring other related components.
4. **Lack of Verification**: Not thoroughly testing all related functionalities.

### Applicable Scenarios
This fix pattern is suitable for:
- Global state changes that need to notify multiple levels of components.
- Applications with complex component hierarchies.
- Functional modules that require a unified response mechanism.
- Issues with inconsistent event propagation paths.

## 🔗 Related Documents
- `112-desktop-ipc-fixes/language-switch-fix.md` - Language switch button fix.
- `106-template-management/troubleshooting.md` - Template management troubleshooting checklist.

## 📅 Fix Record
- **Discovery Date**: 2025-01-07
- **Fix Date**: 2025-01-07
- **Impact Scope**: Web and Extension environments.
- **Fix Type**: Event propagation mechanism improvement.
- **Importance Level**: High (core functionality affecting user experience).