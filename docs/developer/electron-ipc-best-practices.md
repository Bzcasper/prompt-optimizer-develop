# Electron IPC Best Practices

## Problem Background

In an Electron application, Vue's reactive objects cannot be directly passed through IPC (Inter-Process Communication), which will cause an "An object could not be cloned" error. This is because Vue's reactive objects contain non-serializable proxy wrappers.

## Core Principles

### 1. The ElectronProxy Layer Automatically Handles Serialization

✅ **Current Practice**:
```javascript
// You can directly pass a Vue reactive object, and ElectronProxy will automatically serialize it
await modelManager.addModel(newModel.value.key, {
  name: newModel.value.name,
  llmParams: newModel.value.llmParams // ElectronProxy will automatically clean up the reactive wrapper
})
```

**Architectural Advantages**:
- Vue components do not need to care about serialization details
- All serialization logic is centralized in the ElectronProxy layer
- Automatic protection, not easy to miss
- The code is cleaner and the development experience is better

### 2. Automatic Serialization Handling

**The ElectronProxy layer automatically handles serialization**:
- All ElectronProxy classes have built-in serialization handling
- Vue components do not need to manually call serialization functions
- You can directly pass a Vue reactive object, and the proxy layer will automatically clean it up

**Technical Implementation**:
- Use the `safeSerializeForIPC` function in `packages/core/src/utils/ipc-serialization.ts`
- Automatically call serialization in every required ElectronProxy method
- Ensure 100% IPC compatibility

### 3. How to Identify the Problem

When you see the following errors, it means there is an IPC serialization problem:
- `An object could not be cloned`
- `DataCloneError`
- `Failed to execute 'postMessage'`

## Common Problem Scenarios

### 1. Model Management
```javascript
// ✅ You can now directly pass a Vue reactive object
await modelManager.addModel(key, {
  llmParams: formData.value.llmParams // ElectronProxy will automatically serialize it
})
```

### 2. History
```javascript
// ✅ You can now directly pass a Vue reactive object
await historyManager.createNewChain({
  metadata: { mode: optimizationMode.value } // ElectronProxy will automatically serialize it
})
```

### 3. Template Management
```javascript
// ✅ You can now directly pass a Vue reactive object
await templateManager.saveTemplate({
  content: form.value.messages // ElectronProxy will automatically serialize it
})
```

## Development Checklist

Development is now simpler, you just need to check:

- [ ] Have you tested in the desktop environment?
- [ ] Are there any direct IPC calls that bypass ElectronProxy?
- [ ] Does the new ElectronProxy method include serialization handling?

## Debugging Tips

### 1. Check the Object Type
```javascript
console.log('Object type:', Object.prototype.toString.call(obj))
console.log('Is reactive:', obj.__v_isReactive)
console.log('Is ref:', obj.__v_isRef)
```

### 2. Test Serialization
```javascript
try {
  JSON.stringify(obj)
  console.log('Object is serializable')
} catch (error) {
  console.error('Object is not serializable:', error)
}
```

### 3. Use Developer Tools
In Chrome DevTools, reactive objects will be displayed as `Proxy` type.

## Architectural Recommendations

### 1. Centralized Handling in the ElectronProxy Layer
Serialization handling has been moved to the ElectronProxy layer, and Vue components can call it directly:

```javascript
// In the component method - now it's simpler
const handleSave = async () => {
  await service.save(formData.value) // Pass it directly, no need to manually serialize
}
```

### 2. Specification for Adding New ElectronProxy Methods
When adding a new ElectronProxy method, serialize complex object parameters:

```typescript
async newMethod(complexObject: SomeType): Promise<ResultType> {
  // Serialize complex object parameters
  const safeObject = safeSerializeForIPC(complexObject);
  return this.electronAPI.someService.newMethod(safeObject);
}
```

### 3. Type Safety
The interface of ElectronProxy should accept Vue reactive objects and handle them automatically internally:

```typescript
interface IModelManager {
  addModel(key: string, config: ModelConfig | Ref<ModelConfig>): Promise<void>
  // The interface layer supports reactive objects, and the implementation layer automatically serializes them
}
```

## Performance Considerations

- The ElectronProxy layer uses `JSON.parse(JSON.stringify())` to ensure 100% compatibility
- Serialization only occurs at the IPC boundary and does not affect the performance of Vue components
- Avoid frequent service calls in the rendering loop
- For large objects, consider batch processing or using more fine-grained data transfer

## Testing Strategy

1. **Unit Testing**: Ensure that the serialization function correctly handles various data types
2. **Integration Testing**: Test all IPC calls in the desktop environment
3. **Regression Testing**: Test in the desktop environment every time the code involving IPC is modified

## Conclusion

The current architecture has greatly simplified the use of Electron IPC:

1. **Vue Component Layer**: Directly pass reactive objects without worrying about serialization
2. **ElectronProxy Layer**: Automatically handles serialization to ensure IPC compatibility
3. **Main Process Layer**: Double protection to handle edge cases
4. **Development Experience**: Cleaner code, fewer opportunities for errors

Remember: **You can now safely pass Vue reactive objects, and the architecture will handle it automatically!**

## 📚 Related Documents

- [112-Desktop IPC Fixes](../archives/112-desktop-ipc-fixes/) - IPC architecture analysis and language switching fixes
- [115-IPC Serialization Fixes](../archives/115-ipc-serialization-fixes/) - Vue reactive object serialization solution
- [ElectronProxy Layer Serialization](../archives/115-ipc-serialization-fixes/proxy-layer-serialization.md) - Technical implementation details
- [Architecture Evolution Record](../archives/115-ipc-serialization-fixes/architecture-evolution.md) - The evolution process from manual to automatic
