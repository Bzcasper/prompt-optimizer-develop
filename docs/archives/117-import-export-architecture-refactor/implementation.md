# Technical Implementation Details

## 🔧 Architecture Design

### Core Design Philosophy

#### From Centralized to Distributed
**Original Architecture Issues**:
- DataManager bears too many responsibilities (coordination + concrete implementation)
- Adding new services requires modifying DataManager code
- Violates the Single Responsibility Principle and Open/Closed Principle

**New Architecture Design**:
```typescript
// Unified interface definition
export interface IImportExportable {
  exportData(): Promise<any>;
  importData(data: any): Promise<void>;
  getDataType(): Promise<string>;
  validateData(data: any): Promise<boolean>;
}

// DataManager is only responsible for coordination
class DataManager {
  async exportAllData(): Promise<string> {
    const services = [modelManager, templateManager, historyManager, preferenceService];
    const data = {};
    
    for (const service of services) {
      const dataType = await service.getDataType();
      data[dataType] = await service.exportData();
    }
    
    return JSON.stringify({ version: 1, exportTime: new Date().toISOString(), data });
  }
}
```

#### Dual Purpose of Storage Keys Solution
**Issue Identification**:
- Physical storage key: the key name used for actual storage operations
- Logical JSON key: the key name in the import/export JSON
- PreferenceService adding 'pref:' prefix leads to lookup failures

**Solution**:
```typescript
// PreferenceService handles prefix conversion internally
class PreferenceService {
  private readonly PREFIX = 'pref:';
  
  async exportData(): Promise<any> {
    const allData = await this.getAll();
    const exportData = {};
    
    // Remove prefix and use logical key names for export
    for (const [key, value] of Object.entries(allData)) {
      const logicalKey = key.startsWith(this.PREFIX) ? key.slice(this.PREFIX.length) : key;
      exportData[logicalKey] = value;
    }
    
    return exportData;
  }
}
```

### Interface Design Principles

#### Asynchronous First
All interface methods are designed to be asynchronous, supporting:
- Network requests (Electron IPC)
- File operations (FileStorageProvider)
- Data validation (complex validation logic)

#### Unified Error Handling
```typescript
export class ImportExportError extends Error {
  constructor(
    message: string,
    public readonly dataType?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'ImportExportError';
  }
}
```

## 🐛 Problem Diagnosis and Resolution

### Problem 1: Incomplete Data Export
**Phenomenon**: The user exports JSON with only 4 settings, while there should be 8.

**Diagnosis Process**:
1. Check DataManager export logic → Found a call to PreferenceService.getAll()
2. Check PreferenceService implementation → Found 'pref:' prefix added
3. Check storage key definitions → Found duplicate definitions in UI and Core packages
4. Analyze storage key usage → Found dual purpose of physical storage vs logical JSON

**Solution**:
- Handle prefix conversion within PreferenceService
- Unify storage key definitions in the Core package
- Clearly document the dual purpose of storage keys

### Problem 2: Circular Dependency
**Phenomenon**: Compilation error, circular references between modules.

**Solution**:
- Create a separate interfaces/import-export.ts file
- Separate interface definitions from concrete implementations
- Use dependency injection instead of direct references

### Problem 3: Electron IPC Serialization
**Phenomenon**: Vue reactive objects cannot be transmitted via IPC.

**Solution**:
```typescript
// Perform serialization in the proxy class
async exportData(): Promise<any> {
  const result = await window.electronAPI.modelManager.exportData();
  return JSON.parse(JSON.stringify(result)); // Deep serialization
}
```

## 📝 Implementation Steps

### Phase One: Interface Design
1. Create IImportExportable interface definition
2. Design ImportExportError error class
3. Define a unified data format specification

### Phase Two: Service Refactoring
1. **ModelManager**: Implement import/export of model data
2. **TemplateManager**: Implement import/export of template data
3. **HistoryManager**: Implement import/export of history records
4. **PreferenceService**: Implement import/export of user settings

### Phase Three: DataManager Refactoring
1. Remove concrete implementation logic (-308 lines of code)
2. Change to coordinator pattern, calling each service interface
3. Keep external API interface unchanged

### Phase Four: Electron Update
1. Update main.js IPC handling logic
2. Update preload.js API exposure
3. Update all service proxy classes

### Phase Five: Testing Improvement
1. Create import-export tests for each service
2. Create integration tests to validate the overall process
3. Establish an AI automation testing framework

## 🔍 Debugging Process

### Storage Key Issue Debugging
```bash
# 1. Check exported data
console.log(await dataManager.exportAllData());

# 2. Check PreferenceService data
console.log(await preferenceService.getAll());

# 3. Check storage layer data
console.log(await storageProvider.getAll());

# 4. Compare logical key names and physical key names
```

### Interface Implementation Verification
```typescript
// Verify that all services implement the interface
const services = [modelManager, templateManager, historyManager, preferenceService];
for (const service of services) {
  console.assert(typeof service.exportData === 'function');
  console.assert(typeof service.importData === 'function');
  console.assert(typeof service.getDataType === 'function');
  console.assert(typeof service.validateData === 'function');
}
```

## 🧪 Testing Validation

### Unit Tests
Each service's import-export.test.ts file includes:
- Export functionality tests
- Import functionality tests
- Data validation tests
- Error handling tests

### Integration Tests
data/import-export-integration.test.ts validates:
- Complete import/export process
- Multi-service coordination
- Data consistency checks

### MCP Browser Testing
Using Playwright for automated testing:
- Export button functionality
- File download validation
- Import file upload
- Data application validation
- User interface interaction

### AI Automation Testing Framework
Create a storage-key-consistency test suite:
- test-001: Data export integrity validation
- test-002: Compatibility of importing old version data
- test-003: Code consistency check

## 🔄 Architecture Evolution

### Pre-refactor Architecture
```
DataManager (375 lines)
├── Coordinates various services
├── Implements specific import/export logic
├── Handles data format conversion
└── Error handling and validation
```

### Post-refactor Architecture
```
DataManager (67 lines) - Only responsible for coordination
├── ModelManager.exportData()
├── TemplateManager.exportData()
├── HistoryManager.exportData()
└── PreferenceService.exportData()

IImportExportable Interface
├── Unified method signatures
├── Asynchronous operation support
└── Error handling specifications
```

### Key Improvements
1. **Code Reduction**: DataManager reduces code volume by 82%
2. **Separation of Responsibilities**: Each service self-manages import/export
3. **Extensibility**: New services only need to implement the interface
4. **Maintainability**: Modifying one service does not affect others
5. **Testability**: Each service can be tested independently

## 📈 Performance Impact

### Positive Impacts
- **Code Execution Efficiency**: Reduces unnecessary intermediate layer processing
- **Memory Usage**: Avoids aggregation of large data in DataManager
- **Concurrency**: Each service can process import/export in parallel

### Considerations
- **IPC Calls**: Increased IPC call frequency in Electron environment
- **Serialization Overhead**: Requires JSON serialization for Vue reactive objects

## 🔮 Future Expansion

### New Service Integration
Just implement the IImportExportable interface:
```typescript
class NewService implements IImportExportable {
  async exportData(): Promise<any> { /* Implementation */ }
  async importData(data: any): Promise<void> { /* Implementation */ }
  async getDataType(): Promise<string> { return 'newServiceData'; }
  async validateData(data: any): Promise<boolean> { /* Implementation */ }
}
```

### Feature Enhancements
- Incremental import/export
- Data compression
- Encryption support
- Version migration