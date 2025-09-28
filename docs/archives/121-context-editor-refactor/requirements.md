# Context Editor Refactoring - Requirement Document

## Introduction

This specification defines the requirements for the refactoring of the context editor architecture based on the "lightweight management of the main panel + deep management of the full-screen editor" division of labor model. By analyzing the existing functionality implementations in ConversationManager.vue.backup and ConversationMessageEditor.vue, we identify the core functionalities that need to be retained and reassign them to appropriate components.

Refactoring Goals:
1. Remove the ConversationMessageEditor and ConversationSection components.
2. Simplify the ConversationManager, retaining lightweight management functions.
3. Enhance the ContextEditor to host all complex functionalities.
4. Implement bidirectional data synchronization.

## Consistency with Product Vision

This refactoring supports the core product vision of providing an intuitive AI prompt optimization tool:
- The main interface remains simple, focusing on core workflows.
- Complex functionalities are centralized in a dedicated interface, providing a complete experience.
- Data is synchronized in real-time, reducing operational complexity.

## Functionality Analysis and Allocation

### Features Learned from ConversationManager.vue.backup
**Existing Features:**
- ✅ Compact header title and statistics
- ✅ Variable statistics (used/missing) and tool statistics
- ✅ Quick template dropdown menu
- ✅ Import/export functionality (with format support)
- ✅ Sync to test functionality (requirement removed)
- ✅ Collapse/expand functionality
- ✅ List display using ConversationMessageEditor
- ✅ Integrated add message functionality

**To be Reallocated:**
- Template functionality → Move to ContextEditor
- Import/export functionality → Move to ContextEditor
- Basic statistics and editing → Retain in ConversationManager

### Features Learned from ConversationMessageEditor.vue
**Existing Features:**
- ✅ Compact row layout
- ✅ Message header information (index, role, variable statistics)
- ✅ Preview toggle functionality
- ✅ Move and delete operations
- ✅ Full-screen editing modal
- ✅ Dynamic row count calculation
- ✅ Variable detection and missing prompts
- ✅ Variable highlight preview

**To be Integrated:**
- Basic editing functionality → Integrate into inline editing of ConversationManager
- Full-screen editing modal → Remove (replaced by ContextEditor)
- Preview functionality → Move to ContextEditor

### Existing Features of ContextEditor
**Existing Features:**
- ✅ Modal interface
- ✅ Tabbed architecture (message editing/tool management)
- ✅ Complete message editing functionality
- ✅ Variable preview and replacement
- ✅ Statistics display
- ✅ Accessibility support

**Missing but Needs to be Added:**
- ❌ Import/export functionality
- ❌ Template selection and application

## Requirements

### Requirement 1: Remove Redundant Components

**User Story:** As a developer, I want to remove redundant components so that the codebase is cleaner and easier to maintain.

#### Acceptance Criteria

1. After the refactoring is completed, the system should no longer include the ConversationMessageEditor component.
2. After the refactoring is completed, the system should no longer include the ConversationSection component.
3. When checking import/export, the system should no longer export these removed components.
4. When checking usage, all references to these components should be replaced.

### Requirement 2: Lightweight Transformation of ConversationManager

**User Story:** As a user, I want the main panel to be simple and efficient, providing basic message management functionality.

#### Acceptance Criteria

1. When viewing the header area, the ConversationManager should display a compact title, message count, variable count, and missing variable count statistics.
2. When there are messages, the ConversationManager should display a concise message list, including role and content previews.
3. When editing messages, the ConversationManager should provide inline role selection and text input.
4. When managing messages, the ConversationManager should support adding, deleting, and reordering.
5. When space is insufficient, the ConversationManager should support collapsing functionality.
6. When advanced features are needed, the ConversationManager should provide an "Open Editor" button.

### Requirement 3: Remove Duplicate Complex Functions

**User Story:** As a user, I want complex functions not to appear on the main panel to avoid interface clutter.

#### Acceptance Criteria

1. After the refactoring is completed, the ConversationManager should not contain a quick template dropdown menu.
2. After the refactoring is completed, the ConversationManager should not contain import/export buttons.
3. After the refactoring is completed, the ConversationManager should not contain sync to test functionality.
4. When these functions are needed, users should access them by opening the ContextEditor.

### Requirement 4: Enhance ContextEditor Functionality

**User Story:** As a user, I want to access all complex context management functionalities in the ContextEditor.

#### Acceptance Criteria

1. When opening the ContextEditor, the system should maintain the existing tabbed architecture (message editing/tool management).
2. When templates are needed, the ContextEditor should provide complete template selection, preview, and application functionality.
3. When import/export is needed, the ContextEditor should provide multi-format support for import/export functionality.
4. When editing messages, the ContextEditor should provide complete editing, preview, and variable highlight functionalities.
5. When handling variables, the ContextEditor should integrate variable management functionalities.

### Requirement 5: Bidirectional Data Synchronization

**User Story:** As a user, I want real-time data synchronization between the ConversationManager and ContextEditor without manual saving.

#### Acceptance Criteria

1. When modifying messages in the ConversationManager, if the ContextEditor is open simultaneously, changes should be seen immediately.
2. When modifying messages in the ContextEditor, the ConversationManager should reflect changes immediately.
3. When importing data in the ContextEditor, the ConversationManager should display new data immediately.
4. When closing the ContextEditor, no save confirmation is needed; all changes should have taken effect in real-time.
5. When components communicate, they should do so through shared reactive data states, rather than event passing.

### Requirement 6: Variable Management Integration Optimization

**User Story:** As a user, I want the variable functionality to be reasonably divided between the two components.

#### Acceptance Criteria

1. When in the ConversationManager, the system should display variable statistics and missing variable warnings.
2. When clicking on a missing variable, the ConversationManager should emit a createVariable event.
3. When deep variable management is needed, users should perform batch operations in the ContextEditor.
4. When variables are updated, both components should automatically refresh relevant statistics and displays.

### Requirement 7: Maintain Existing Mature Functions

**User Story:** As a user, I want to ensure that the refactoring does not lose existing mature functionalities.

#### Acceptance Criteria

1. When viewing the ContextEditor, the system should maintain existing accessibility support.
2. When using responsive functionalities, the system should maintain existing multi-device compatibility.
3. When performing performance optimizations, the system should maintain existing rendering performance.
4. When handling user interactions, the system should maintain existing keyboard navigation and shortcut support.

## Technical Implementation Highlights

### Simplification Focus of ConversationManager
- Remove UI elements for templates, import/export, and sync functionalities.
- Retain statistics display and basic message management.
- Integrate basic editing functionalities of ConversationMessageEditor into inline editing.
- Maintain navigation functionalities such as collapsing and opening the advanced editor.

### Enhancement Focus of ContextEditor  
- Add template selection functionality migrated from ConversationManager.backup.
- Add import/export functionality migrated from ConversationManager.backup.
- Maintain existing tabbed architecture and editing functionalities.
- Ensure bidirectional data binding with ConversationManager.

### Data Binding Architecture
- Use Vue's reactive system to implement shared state.
- Both components operate on the same data source.
- Implement bidirectional synchronization through v-model and computed properties.
- Avoid complex event passing and data copying.

## Component API Design

### ConversationManager Props
```typescript
interface ConversationManagerProps {
  // Bidirectional bound data
  messages: ConversationMessage[]
  availableVariables?: Record<string, string>
  
  // Functional functions
  scanVariables?: (content: string) => string[]
  
  // UI control
  size?: 'small' | 'medium' | 'large'
  collapsible?: boolean
  readonly?: boolean
  title?: string
}
```

### ConversationManager Emits  
```typescript
interface ConversationManagerEmits {
  'update:messages': [messages: ConversationMessage[]]
  'openContextEditor': []
  'createVariable': [name: string]
  'openVariableManager': [variableName?: string]
}
```

### Enhanced Features of ContextEditor
- Maintain existing Props and Emits structure.
- Add methods related to template management.
- Add methods related to import/export functionalities.
- Ensure data binding with ConversationManager.

## Non-Functional Requirements

### Code Quality
- Clear division of component responsibilities.
- Minimize dependencies between components.
- Maintain existing code quality standards.

### Performance Requirements
- Maintain existing rendering performance.
- Optimize performance using Vue's reactive system.
- Avoid unnecessary re-renders.

### User Experience
- Maintain existing interaction experience.
- Data synchronization should be timely and natural.
- Interface transitions should be smooth.

### Compatibility
- Maintain existing browser compatibility.
- Maintain existing accessibility support.
- Maintain existing responsive design.