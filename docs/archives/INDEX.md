# 📚 Archive Document Comprehensive Index

This index categorizes all archived documents by functionality, helping to quickly locate relevant content.

## 🏗️ Architecture Refactoring Series

### Core Architecture Evolution
- **[101-singleton-refactor](./101-singleton-refactor/)** - Singleton Pattern Refactoring
  - Remove singleton patterns from the project and switch to a dependency injection architecture
  - Improve code testability and maintainability
  - Lay the foundation for subsequent architectural refactoring

- **[102-web-architecture-refactor](./102-web-architecture-refactor/)** - Web Architecture Refactoring
  - Comprehensive refactoring of web applications and browser plugin architecture based on singleton refactoring
  - Adopt a unified Composable architecture
  - Fix application startup failure issues

- **[103-desktop-architecture](./103-desktop-architecture/)** - Desktop Architecture
  - Design and refactoring of desktop (Electron) architecture
  - Ensure consistency with web architecture
  - Inter-process communication optimization

### Architecture Repair and Optimization
- **[111-electron-preference-architecture](./111-electron-preference-architecture/)** - Electron Preference Architecture
  - Refactoring of Electron PreferenceService architecture
  - Race condition fixes
  - Cross-process state management optimization

- **[121-context-editor-refactor](./121-context-editor-refactor/)** - Context Editor Refactoring 🆕
  - Clean up and optimize the structure of context editor-related components
  - Remove deprecated components (ConversationMessageEditor, ConversationSection)
  - API cleanup: remove unused props passing to enhance code maintainability
  - Maintenance refactoring with zero functional impact

## 🚀 Feature Development Series

### Core Functionality Modules
- **[106-template-management](./106-template-management/)** - Template Management Functionality
  - CRUD functionality for templates
  - Asynchronous operation optimization
  - User experience improvements

- **[107-component-standardization](./107-component-standardization/)** - Component Standardization Refactoring
  - Unify the behavior and API of all modal/dialog components
  - Establish a unified component API specification
  - Improve code consistency and maintainability

### Interface Functionality Optimization
- **[104-test-panel-refactor](./104-test-panel-refactor/)** - Test Panel Refactoring 📋
  - Refactoring and optimization of test panel functionality
  - User experience improvements

- **[105-output-display-v2](./105-output-display-v2/)** - Output Display v2 📋
  - Design of the second version of the output display functionality
  - Performance and user experience optimization

## 🎨 System Optimization Series

### UI/UX System
- **[108-layout-system](./108-layout-system/)** - Layout System Experience
  - Experience in implementing dynamic Flex layouts
  - Best practices for responsive design
  - Summary of layout system architecture

- **[109-theme-system](./109-theme-system/)** - Theme System Development
  - Design and implementation of the theme system
  - Dynamic theme switching functionality
  - Best practices for style management

- **[122-naive-ui-migration](./122-naive-ui-migration/)** - Naive UI Migration Project 🎨
  - Comprehensive framework migration from Element Plus to Naive UI
  - Major upgrade of the theme system: from 1 theme to 5 themes (light, dark, blue, green, purple)
  - Systematic evaluation of 26 tasks, successful migration in 8 months
  - Maintain cross-platform compatibility: Web (100%) + Desktop (95%) + Extension (95%)
  - Performance optimization: reduced build size, improved rendering performance
  - Established a complete methodology and best practices for UI framework migration

## 🔧 Issue Fixing Series

### Storage and Data
- **[110-desktop-indexeddb-fix](./110-desktop-indexeddb-fix/)** - Desktop IndexedDB Fix
  - Fix compatibility issues with desktop IndexedDB
  - Improve data storage stability
  - Optimize cross-platform storage solutions

### Inter-Process Communication
- **[112-desktop-ipc-fixes](./112-desktop-ipc-fixes/)** - Desktop IPC Fixes Collection
  - Fix the "Object Promise" issue with the language switch button display
  - Fix IPC serialization issues with Vue reactive objects
  - Analyze and fix IPC architecture
  - Unify asynchronous interfaces across environments
  - Standardize preload.js architecture

- **[115-ipc-serialization-fixes](./115-ipc-serialization-fixes/)** - IPC Serialization Fixes and Data Consistency 🔄
  - Unified handling of IPC serialization for Vue reactive objects
  - Implementation of the safeSerialize function
  - Fix data consistency issues in the business logic layer
  - Resolve model data loss issues
  - Establish a dual protection mechanism

## ⚙️ Service Refactoring Series

### Comprehensive Refactoring
- **[113-full-service-refactoring](./113-full-service-refactoring/)** - Comprehensive Service Refactoring
  - Complete refactoring of the service layer architecture
  - Optimize dependency injection
  - Standardize service interfaces

- **[114-desktop-file-storage](./114-desktop-file-storage/)** - Desktop File Storage Implementation 💾
  - Implement FileStorageProvider to replace in-memory storage
  - Complete data persistence solution
  - High-performance file I/O and error recovery mechanisms
  - Enhanced data security: intelligent recovery mechanisms, backup protection, atomic operations

- **[116-desktop-packaging-optimization](./116-desktop-packaging-optimization/)** - Desktop Application Packaging Optimization 📦
  - Change from portable mode to ZIP compressed package mode
  - Resolve storage path detection issues
  - Simplify code architecture to enhance user experience

- **[119-csp-safe-template-processing](./119-csp-safe-template-processing/)** - CSP Safe Template Processing 🔒
  - Resolve template compilation failures caused by browser extension CSP restrictions
  - Implement an environment-adaptive template processing mechanism
  - Maintain cross-platform functionality integrity and backward compatibility

## 🔍 Quick Lookup Guide

### Find by Issue Type
- **Startup Issues** → 102-web-architecture-refactor
- **Display Anomalies** → 112-desktop-ipc-fixes
- **Storage Issues** → 110-desktop-indexeddb-fix, 114-desktop-file-storage, 116-desktop-packaging-optimization
- **Data Consistency Issues** → 114-desktop-file-storage, 115-ipc-serialization-fixes
- **Serialization Errors** → 112-desktop-ipc-fixes, 115-ipc-serialization-fixes
- **Application Exit Issues** → 114-desktop-file-storage
- **Language Setting Issues** → 112-desktop-ipc-fixes
- **Layout Issues** → 108-layout-system
- **Theme Issues** → 109-theme-system, 122-naive-ui-migration
- **UI Library Migration Issues** → 122-naive-ui-migration
- **Template Issues** → 106-template-management, 119-csp-safe-template-processing
- **Component Issues** → 107-component-standardization, 121-context-editor-refactor
- **CSP Security Issues** → 119-csp-safe-template-processing
- **Browser Extension Issues** → 119-csp-safe-template-processing
- **Code Cleanup and Refactoring** → 121-context-editor-refactor
- **Cross-Platform Compatibility Issues** → 122-naive-ui-migration
- **Performance Optimization Issues** → 122-naive-ui-migration

### Find by Technology Stack
- **Electron Related** → 103, 110, 111, 112, 114
- **Vue/Frontend Related** → 102, 104, 105, 107, 108, 109, 121, 122
- **UI Library Related** → 109, 122
- **Browser Extension Related** → 119, 122
- **Architecture Design Related** → 101, 102, 103, 111, 113, 121
- **Service Layer Related** → 101, 106, 113, 119
- **IPC Communication Related** → 103, 111, 112
- **Template System Related** → 106, 119
- **Component Refactoring Related** → 107, 121
- **Theme System Related** → 109, 122
- **Performance Optimization Related** → 122

### Find by Development Stage
- **Early Project Architecture** → 101, 102, 103
- **Feature Development Stage** → 104, 105, 106, 107
- **Optimization and Improvement Stage** → 108, 109, 121, 122
- **Issue Fixing Stage** → 110, 111, 112, 114, 119
- **Refactoring and Improvement Stage** → 113, 121, 122

### Find by Experience Type
- **Architecture Design Experience** → 101, 102, 103, 111, 121
- **Feature Development Experience** → 106, 107
- **UI/UX Design Experience** → 108, 109, 122
- **UI Framework Migration Experience** → 122
- **Issue Troubleshooting Experience** → 110, 112, 114, 119
- **Refactoring Practice Experience** → 101, 113, 121, 122
- **Performance Optimization Experience** → 122

## 📖 Usage Recommendations

### Beginner's Path
1. **Understand Architecture** → 101 → 102 → 103
2. **Learn Feature Development** → 106 → 107
3. **Master System Optimization** → 108 → 109 → 122
4. **Learn Issue Troubleshooting** → 110 → 112 → 114
5. **UI Framework Migration** → 122 (Complete methodology and best practices)

### Problem-Solving Path
1. **Identify Issue Type** → Refer to "Find by Issue Type"
2. **Locate Relevant Documents** → Read README for an overview
3. **Dive into Technical Details** → Check experience.md and troubleshooting.md
4. **Apply Solutions** → Refer to implementation.md

### Experience Learning Path
1. **Choose an Area of Interest** → Refer to "Find by Technology Stack"
2. **Read in Chronological Order** → Understand the evolution process
3. **Extract Key Experiences** → Focus on experience.md
4. **Build Knowledge System** → Integrate related experiences

---

**💡 Tip**: Each document contains a complete background, implementation, and experience summary; it is recommended to read selectively based on actual needs.