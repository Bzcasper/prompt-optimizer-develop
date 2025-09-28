# Development Process Archive

Here, the refactoring records, design documents, experience summaries, etc., from the project development process are archived by functional points for subsequent tracking and troubleshooting.

## 📚 Archive Description

### Numbering Specification
- **Starting Number**: 101
- **Numbering Method**: Simple accumulation (101, 102, 103...)
- **Number Retention**: Numbers are not reused even if the functionality is deprecated

### Archiving Principles
- **Archive by Functional Point**: All related documents for the same functionality are grouped together
- **Complete Context**: Includes complete records of planning, design, implementation, experience, etc.
- **Chronological Order**: Development chronological order is reflected through numbering

## 🗂️ Functional Point List

### Architecture Refactoring Series (Completed)
- [101-singleton-refactor](./101-singleton-refactor/) - Singleton Pattern Refactoring ✅
- [102-web-architecture-refactor](./102-web-architecture-refactor/) - Web Architecture Refactoring ✅
- [103-desktop-architecture](./103-desktop-architecture/) - Desktop Architecture ✅

### Feature Development Series
- [104-test-panel-refactor](./104-test-panel-refactor/) - Test Panel Refactoring 📋
- [105-output-display-v2](./105-output-display-v2/) - Output Display v2 📋
- [106-template-management](./106-template-management/) - Template Management Functionality 🔄
- [107-component-standardization](./107-component-standardization/) - Component Standardization Refactoring 🔄

### System Optimization Series (Completed)
- [108-layout-system](./108-layout-system/) - Layout System Experience Summary ✅
- [109-theme-system](./109-theme-system/) - Theme System Development ✅

### Issue Fixing Series (Completed)
- [110-desktop-indexeddb-fix](./110-desktop-indexeddb-fix/) - Desktop IndexedDB Issue Fix ✅
- [111-electron-preference-architecture](./111-electron-preference-architecture/) - Electron PreferenceService Architecture Refactoring and Race Condition Fix ✅
- [112-desktop-ipc-fixes](./112-desktop-ipc-fixes/) - Desktop IPC Fixes Collection ✅

### Service Refactoring Series
- [113-full-service-refactoring](./113-full-service-refactoring/) - Comprehensive Service Refactoring 🔄

### Data Architecture Series (Completed)
- [114-desktop-file-storage](./114-desktop-file-storage/) - Desktop File Storage Implementation ✅
- [115-ipc-serialization-fixes](./115-ipc-serialization-fixes/) - IPC Serialization Issue Fixes ✅
- [116-desktop-packaging-optimization](./116-desktop-packaging-optimization/) - Desktop Packaging Optimization ✅
- [117-import-export-architecture-refactor](./117-import-export-architecture-refactor/) - Import and Export Architecture Refactoring ✅

### System Integration Series (Completed)
- [118-desktop-auto-update-system](./118-desktop-auto-update-system/) - Desktop Application Release and Smart Update System ✅
- [119-csp-safe-template-processing](./119-csp-safe-template-processing/) - CSP Safe Template Processing ✅
- [120-mcp-server-module](./120-mcp-server-module/) - MCP Server Module Development ✅

### Feature Expansion Series (Completed)
- [121-multi-custom-models-support](./121-multi-custom-models-support/) - Support for Multiple Custom Model Environment Variables ✅
- [122-docker-api-proxy](./122-docker-api-proxy/) - Docker API Proxy Functionality Implementation ✅
- [123-advanced-features-implementation](./123-advanced-features-implementation/) - Complete Implementation of Advanced Features ✅

### UI Optimization Series (Completed)
- [124-navigation-optimization](./124-navigation-optimization/) - Navigation Bar Optimization Project ✅

## 📋 Document Structure

Each functional point directory contains:
- **README.md** - Overview of the functional point, timeline, status
- **Core Documents** (as applicable):
  - `plan.md` - Planning Document
  - `design.md` - Design Document
  - `implementation.md` - Implementation Record
  - `experience.md` - Experience Summary
  - `troubleshooting.md` - Troubleshooting Checklist

## 🔍 Search Guide

### Search by Time
- **101-103**: Architecture Refactoring by the end of December 2024
- **104-107**: Feature Development from the end of December 2024 to July 2025
- **108-109**: System Optimization in July 2025
- **110-113**: Fixes and Refactoring from January to July 2025

### Search by Functional Category
- **Architecture Refactoring Series**: 101, 102, 103
- **Feature Development Series**: 104, 105, 106, 107
- **System Optimization Series**: 108, 109
- **Issue Fixing Series**: 110, 111, 112
- **Service Refactoring Series**: 113
- **UI Optimization Series**: 124

### Search by Status
- **Completed**: 101, 102, 103, 108, 109, 110, 111, 112, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124
- **In Progress**: 106, 107, 113
- **Planned**: 104, 105

## 📝 Usage Instructions

1. **Find Related Functionality**: Locate the corresponding directory by functionality name or number
2. **Understand Background**: Read README.md first to understand the functionality overview
3. **Dive into Details**: Check specific planning, design, or experience documents as needed
4. **Troubleshooting**: If there are related issues, refer to troubleshooting.md

## 🔄 Maintenance Instructions

- **New Functionality Archiving**: Continue numbering from 125
- **Document Updates**: Update status and experience summary promptly after functionality completion
- **Cross-Referencing**: Establish reference relationships between related functional points
- **Merging Principles**: Consider merging when there are more than three related documents in the same functional area
- **Quality Standards**: Empty directories or documents with insufficient content should be merged or deleted

## 📋 Organization Guidelines

### Archiving Standards
1. **Functional Integrity**: Each functional point contains a complete chain of planning → design → implementation → experience
2. **Avoid Duplicate Numbering**: Strictly assign numbers in chronological order without reuse
3. **Content Quality**: Ensure that document content is substantial and has practical value

### Document Structure Specification
```
{number}-{function-name}/
├── README.md (Function Overview, Timeline, Status)
├── plan.md (Planning Document, optional)
├── design.md (Design Document, optional)
├── implementation.md (Implementation Record, optional)
├── experience.md (Experience Summary, required)
└── troubleshooting.md (Troubleshooting Checklist, optional)
```

## 📊 Statistical Information

- **Total Archives**: 24
- **Completed**: 19
- **In Progress**: 3
- **Planned**: 2
- **Next Number**: 125