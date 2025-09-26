# Language Switch Button Fix

## 🎯 Problem Description

### Core Issue
The language switch button for managing functional prompts displays "Object Promise" instead of the correct language name (e.g., "中文" or "English").

### Problem Manifestation
- The UI component shows the abnormal text "Object Promise"
- The language switching functionality does not work properly
- Inconsistent behavior between Web and Electron environments

### Root Cause
- **Inconsistent Asynchronous Interfaces**: Methods in the Electron environment return Promises but are used as synchronous values
- **IPC Call Handling Errors**: The results of asynchronous IPC calls are not properly awaited
- **Interface Definition Mismatch**: Web and Electron environments use different method signatures

## 🔧 Solution

### 1. Unify Asynchronous Interface Design
Create the `ITemplateLanguageService` interface to ensure consistency across environments:

```typescript
export interface ITemplateLanguageService {
  initialize(): Promise<void>;
  getCurrentLanguage(): Promise<BuiltinTemplateLanguage>;
  setLanguage(language: BuiltinTemplateLanguage): Promise<void>;
  toggleLanguage(): Promise<BuiltinTemplateLanguage>;
  isValidLanguage(language: string): Promise<boolean>;
  getSupportedLanguages(): Promise<BuiltinTemplateLanguage[]>;
}
```

### 2. Fix Asynchronous Calls in Vue Component
```vue
<!-- Before Fix -->
<span>{{ languageService.getCurrentLanguage() }}</span>

<!-- After Fix -->
<span>{{ currentLanguage }}</span>

<script setup>
const currentLanguage = ref('')

onMounted(async () => {
  currentLanguage.value = await languageService.getCurrentLanguage()
})
</script>
```

### 3. Improve IPC Call Chain
```javascript
// preload.js
templateLanguage: {
  getCurrentLanguage: async () => {
    const result = await ipcRenderer.invoke('template-getCurrentBuiltinTemplateLanguage');
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
}

// main.js
ipcMain.handle('template-getCurrentBuiltinTemplateLanguage', async (event) => {
  try {
    const result = await templateManager.getCurrentBuiltinTemplateLanguage();
    return createSuccessResponse(result);
  } catch (error) {
    return createErrorResponse(error);
  }
});
```

## ✅ Fix Validation

### Validation Checklist
- [x] The language switch button correctly displays "中文" or "English"
- [x] The "Object Promise" display issue is fully resolved
- [x] Consistent behavior between Web and Electron environments
- [x] All asynchronous calls are correctly handled

## 💡 Experience Summary

### Core Principles
1. **Interface Consistency**: Interfaces across environments must maintain consistent asynchronicity
2. **Error Handling**: Allow errors to propagate naturally for easier problem localization
3. **Type Safety**: Use TypeScript to ensure the completeness of interface implementations
4. **Event Propagation**: Ensure that language switch events can propagate to all relevant components

### Best Practices
1. **Unified Asynchrony**: All cross-environment interfaces should be asynchronous
2. **Interface-Driven**: Define interfaces first, then implement specific classes
3. **Comprehensive Testing**: Validate functionality in both environments
4. **Event Chain Integrity**: Establish a complete event propagation mechanism to ensure deep components can also respond to state changes

### Related Issues
- **Iteration Page Template Selection Not Updating**: After switching languages, due to component hierarchy differences and a lack of event propagation mechanisms, the template selection on the iteration page fails to update correctly. The solution is to establish a complete event propagation chain to ensure all TemplateSelect components can respond to language switch events. See section 9 of `106-template-management/troubleshooting.md`.

This fix establishes a complete asynchronous interface design pattern, providing a standard for future IPC development.