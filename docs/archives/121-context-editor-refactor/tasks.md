# Context Editor Refactoring - Task Breakdown (Engineering Optimization Version)

## Phase 1: Lightweight Confirmation and Enhancement of ConversationManager

### 1.1 Current Status Analysis and API Alignment

- [x] 1.1.1 Confirm the current state of ConversationManager
  - File: packages/ui/src/components/ConversationManager.vue
  - Confirm that the current version has no quick templates/import/export/sync to test UI elements
  - Confirm that v-model + update:messages two-way binding is currently implemented
  - Analyze the alignment degree between existing functions and requirement designs
  - Purpose: Clarify the current baseline to avoid unnecessary modifications
  - _Leverage: Existing implementation of ConversationManager.vue_
  - _Requirements: Requirement 2_

- [x] 1.1.2 Update the type definitions of ConversationManager
  - File: packages/ui/src/types/components.ts
  - Clarify type and default value strategy: change scanVariables/replaceVariables/isPredefinedVariable to optional
  - Unify maxHeight to number type to avoid string concatenation errors
  - Review places where maxHeight is involved in calculations to ensure px concatenation logic is correct
  - Ensure type definitions are consistent with actual API usage
  - Purpose: Standardize API interfaces and resolve consistency issues between types and implementations
  - _Leverage: Existing types/components.ts_
  - _Requirements: API design specifications_

### 1.2 Enhancements to ConversationManager Functionality

- [x] 1.2.1 Confirm that lightweight UI design is in place
  - File: packages/ui/src/components/ConversationManager.vue
  - Confirm that the current version has no templates/import/export/sync to test UI elements
  - Establish future development guidelines: do not reintroduce these complex function entries in the Manager
  - Validate that the current UI meets lightweight design requirements
  - Purpose: Maintain lightweight architectural design
  - _Leverage: Existing simplified UI structure_
  - _Requirements: Requirement 2, Requirement 3_

- [x] 1.2.2 Enhance inline editing experience (lightweight boundary)
  - File: packages/ui/src/components/ConversationManager.vue
  - Prioritize using NInput.autosize({ minRows, maxRows }) to meet 80% of scenarios
  - Enhance inline prompts for missing variables: maintain restraint (small tag + hover details), avoid excessive complexity
  - Supplement fine dynamic row count optimization only when necessary to avoid complicating
  - Optimize interaction experience for role selection and text input
  - Purpose: Improve user experience of basic editing functions while maintaining lightweight
  - _Leverage: NInput.autosize + editing logic reference from ConversationMessageEditor.vue_
  - _Requirements: Requirement 2_

- [x] 1.2.3 Maintain the existing data binding mode
  - File: packages/ui/src/components/ConversationManager.vue
  - Maintain the current v-model + update:messages mode
  - Confirm the correctness of props and events
  - Do not change to directly manipulate the parent ref
  - Purpose: Maintain Vue best practices for data flow patterns
  - _Leverage: Existing data binding implementation_
  - _Requirements: Requirement 5_

### 1.3 Implementation of Default Values for Functions

- [x] 1.3.1 Provide reasonable default implementations for functional functions
  - File: packages/ui/src/components/ConversationManager.vue
  - Use withDefaults to provide default implementations for optional props:
    - scanVariables: default returns an empty array
    - replaceVariables: default content passthrough
    - isPredefinedVariable: default returns false
  - Ensure default implementations are consistent with type definitions (optional types + withDefaults)
  - Purpose: Resolve consistency between types and implementations, provide degradation support for function props
  - _Leverage: Existing variable handling logic_
  - _Requirements: API design specifications_

### 1.4 Test Updates

- [x] 1.4.1 Update unit tests for ConversationManager
  - File: packages/ui/tests/unit/components/ConversationManager.spec.ts
  - Update test cases to match the current API
  - Add tests for default function implementations
  - Validate enhanced inline editing functionality
  - Purpose: Ensure correctness and stability of functionality
  - _Leverage: Existing testing framework_
  - _Requirements: Requirement 2_

## Phase 2: Migration and Enhancement of ContextEditor Functionality

### 2.1 Parent Parameter Configuration (Advance for Easier Debugging)

- [x] 2.1.1 Update the parent component to pass optimizationMode to ContextEditor
  - File: packages/web/src/App.vue (and other places using ContextEditor)
  - Add optimizationMode parameter at the call site of ContextEditor
  - Ensure parameters are correctly passed from the parent to ContextEditor
  - Purpose: Establish a complete link for template filtering functionality in advance, facilitating subsequent development debugging
  - _Leverage: Existing parent state management_
  - _Requirements: Requirement 4_

### 2.2 Template Management Functionality Migration

- [x] 2.2.1 Analyze the template management implementation of the backup component
  - File: packages/ui/src/components/ConversationManager.vue.backup
  - Extract the usage of quickTemplateManager
  - Analyze the UI and logic for template selection, preview, and application
  - Understand the implementation categorized by optimizationMode and language
  - Purpose: Prepare for the migration of template functionality
  - _Leverage: Template functionality from ConversationManager.vue.backup:420-469_
  - _Requirements: Requirement 4_

- [x] 2.2.2 Implement template management in ContextEditor
  - File: packages/ui/src/components/ContextEditor.vue
  - Add a template management functional area (can be a new tab)
  - Implement template list display and categorization
  - Implement template preview and application functionality
  - Use the previously configured optimizationMode parameter for filtering
  - Purpose: Migrate template functionality to ContextEditor, completing the link
  - _Leverage: Existing ContextEditor tab structure + optimizationMode parameter_
  - _Requirements: Requirement 4_

- [x] 2.2.3 Add support for optimizationMode parameter to ContextEditor
  - File: packages/ui/src/components/ContextEditor.vue
  - Add optimizationMode?: 'system' | 'user' in Props
  - Filter and categorize templates based on the mode
  - Ensure correctness of template filtering
  - Purpose: Implement mode-based template categorization
  - _Leverage: Existing template categorization logic + previously configured parent parameter passing_
  - _Requirements: API design specifications_

### 2.3 Import and Export Functionality Migration

- [x] 2.3.1 Analyze the existing import and export capabilities of useContextEditor
  - File: packages/ui/src/composables/useContextEditor.ts
  - Confirm smartImport/convertFromOpenAI/convertFromLangFuse/convertFromConversation methods
  - Confirm importFromFile/exportToFile file operation methods
  - Understand existing error handling and validation mechanisms
  - Purpose: Understand reusable existing import and export capabilities
  - _Leverage: Existing implementation of useContextEditor composable_
  - _Requirements: Requirement 4_

- [x] 2.3.2 Implement import and export functionality in ContextEditor
  - File: packages/ui/src/components/ContextEditor.vue
  - Add import and export entry in the bottom action bar or new area
  - Reuse existing methods from useContextEditor: smartImport/convertFromOpenAI/convertFromLangFuse/convertFromConversation
  - Reuse importFromFile/exportToFile for file operations
  - Clarify priorities: support JSON/OpenAI/LangFuse/Conversation first; CSV/TXT will be scheduled later (not blocking the main process)
  - Purpose: Migrate import and export functionality to ContextEditor, reusing existing logic
  - _Leverage: Existing implementation of useContextEditor composable_
  - _Requirements: Requirement 4_

### 2.4 ContextEditor Data Synchronization Alignment

- [x] 2.4.1 Ensure real-time state synchronization of ContextEditor
  - File: packages/ui/src/components/ContextEditor.vue
  - Maintain the synchronization pattern of "edit emits update:state → parent updates shared ref → Manager reflects in real-time"
  - Ensure ContextEditor emits update:state events in a timely manner
  - Validate that the parent can correctly receive and update optimizationContext
  - Validate that ConversationManager can see changes through v-model
  - Purpose: Improve the data synchronization mechanism between the two components, maintaining the existing architecture
  - _Leverage: Existing parent state management mechanism_
  - _Requirements: Requirement 5_

### 2.5 ContextEditor Functionality Testing

- [x] 2.5.1 Write tests for new functionalities
  - File: packages/ui/tests/unit/components/ContextEditor.spec.ts
  - Write test cases for template management functionality
  - Write test cases for import and export functionality (reuse the testing patterns of useContextEditor)
  - Write tests for passing optimizationMode parameters
  - Purpose: Ensure stability of migrated functionalities
  - _Leverage: Existing testing tools and useContextEditor testing references_
  - _Requirements: Requirement 4_

## Phase 3: Integration Verification and Optimization

### 3.1 Data Synchronization Integrity Verification

- [x] 3.1.1 Verify data synchronization between Manager and Editor
  - File: packages/ui/tests/integration/context-editor-sync.spec.ts
  - Test that modifications in ConversationManager are reflected in ContextEditor in real-time
  - Test that modifications in ContextEditor are reflected in ConversationManager in real-time
  - Test the impact of template application, import, and export on data synchronization
  - Validate the complete link of "edit emits → parent updates → real-time reflection"
  - Purpose: Verify the correctness of bidirectional data synchronization
  - _Leverage: Existing parent state management and v-model mechanism_
  - _Requirements: Requirement 5_

### 3.2 Variable Management Collaboration Optimization

- [x] 3.2.1 Optimize cross-component collaboration for variable management
  - File: packages/ui/src/components/ConversationManager.vue & ContextEditor.vue
  - Ensure both components use consistent variable handling functions
  - Optimize prompts for missing variables and quick creation processes
  - Validate the correctness of event communication in the variable manager
  - Purpose: Improve user experience in variable management
  - _Leverage: Existing variable management system_
  - _Requirements: Requirement 6_

### 3.3 Performance Optimization

- [-] 3.3.1 Optimize component rendering and data processing performance
  - File: Relevant component files
  - Use shallowRef and other techniques to optimize large data rendering
  - Add debounce handling to avoid frequent updates
  - Optimize lazy loading for templates and import/export
  - Purpose: Ensure performance of the refactored system
  - _Leverage: Vue 3 performance optimization techniques_
  - _Requirements: Performance considerations_

### 3.4 End-to-End Verification

- [x] 3.4.1 Complete user flow testing
  - File: packages/ui/tests/e2e/context-editor-refactor.spec.ts
  - Test the complete flow from lightweight management to deep editing
  - Test the user experience of template selection and application
  - Test import/export and format conversion functionalities (JSON/OpenAI/LangFuse/Conversation)
  - Test cross-component collaboration in variable management
  - Purpose: Verify the user experience of the entire refactored system
  - _Leverage: E2E testing tools_
  - _Requirements: All requirements_

## Phase 4: Deprecated Component Cleanup

### 4.1 Final Confirmation of Functional Integrity

- [x] 4.1.1 Compare and verify functional integrity
  - File: Create a functional comparison verification checklist
  - Compare the functional integrity of the new system with the original backup component
  - Confirm that no functionality is lost or experience degraded
  - Record verification results and any issues that need to be corrected
  - Purpose: Ensure all functionalities have been correctly migrated before cleanup
  - _Leverage: Requirement documents and original components_
  - _Requirements: All requirements_

### 4.2 Cleanup of Deprecated Files and References

- [ ] 4.2.1 Delete ConversationMessageEditor.vue and ConversationSection.vue
  - File: packages/ui/src/components/ConversationMessageEditor.vue & ConversationSection.vue
  - Confirm that all functionalities have been migrated before deleting these two component files
  - Delete related unit test files
  - Purpose: Clean up deprecated component files
  - _Leverage: Version control system_
  - _Requirements: Requirement 1_

- [ ] 4.2.2 Update component export configuration
  - File: packages/ui/src/index.ts
  - Remove ConversationMessageEditor and ConversationSection from the export list
  - Update type export configuration
  - Purpose: Clean up external API interfaces
  - _Leverage: Existing export configuration_
  - _Requirements: Requirement 1_

### 4.3 Cleanup of Tests and References

- [ ] 4.3.1 Clean up deprecated component references in tests
  - File: Relevant test files
  - Remove mocks of ConversationSection in tests
  - Correct any references to deprecated components
  - Purpose: Clean up deprecated references in the testing environment
  - _Leverage: Testing framework_
  - _Requirements: Requirement 1_

- [ ] 4.3.2 Update invalid props and events in the Web App
  - File: packages/web/src/App.vue
  - Remove invalid props from ConversationManager (optimization-mode, compact-mode)
  - Remove invalid event bindings (e.g., @create-variable)
  - Purpose: Clean up deprecated API calls in the parent component
  - _Leverage: Around line 155 in packages/web/src/App.vue_
  - _Requirements: API cleanup_

### 4.4 Final Verification

- [ ] 4.4.1 Execute complete regression testing
  - File: Run the complete test suite
  - Execute all unit tests, ensuring 100% pass rate
  - Execute integration tests and E2E tests
  - Fix any issues discovered
  - Purpose: Ensure the integrity and stability of the system after cleanup
  - _Leverage: Complete testing framework_
  - _Requirements: All requirements_

- [ ] 4.4.2 Update related documentation
  - File: Relevant development documentation
  - Update component usage documentation, removing deprecated component descriptions
  - Update API documentation to reflect new interface designs
  - Document refactoring experiences and best practices
  - Purpose: Keep documentation in sync with code
  - _Leverage: Existing documentation system_
  - _Requirements: Documentation maintenance_

## Key Checkpoints and Acceptance Criteria

### Phase 1 Completion Check
- [ ] Confirmation of the current state of ConversationManager is complete, with no unnecessary modifications
- [ ] Consistency of type definitions and default value implementations resolved (optional types + withDefaults)
- [ ] maxHeight type unified to number, px concatenation logic correct
- [ ] Inline editing enhancement maintains lightweight boundaries (NInput.autosize prioritized)
- [ ] Data binding maintains Vue best practices

### Phase 2 Completion Check
- [ ] The parameter passing link for optimizationMode established in advance
- [ ] Template management functionality successfully migrated to ContextEditor, debugging complete
- [ ] Import and export functionality fully migrated, reusing existing capabilities of useContextEditor
- [ ] All priority formats (JSON/OpenAI/LangFuse/Conversation) fully supported
- [ ] ContextEditor's state synchronization mechanism functions normally

### Phase 3 Completion Check
- [ ] Bidirectional data synchronization between Manager and Editor is fully normal
- [ ] Variable management cross-component collaboration experience is good
- [ ] System performance meets expected requirements
- [ ] End-to-end user flow tests all pass

### Phase 4 Completion Check
- [ ] Functional integrity verification passed, with no functionality lost
- [ ] Deprecated components and references completely cleaned up
- [ ] Regression tests all passed
- [ ] Related documentation updates completed

## Engineering Optimization Key Points

### Consistency Strategy for Types and Implementations
```typescript
// Recommended: Optional types + withDefaults
interface Props {
  scanVariables?: (content: string) => string[]
}

const props = withDefaults(defineProps<Props>(), {
  scanVariables: () => []
})
```

### maxHeight Handling Strategy
```typescript
// Unified to number type, component internally concatenates px
interface Props {
  maxHeight?: number  // instead of number | string
}

// Inside the component
const style = computed(() => ({
  maxHeight: props.maxHeight ? `${props.maxHeight}px` : undefined
}))
```

### Lightweight Boundary Control
```vue
<!-- Prioritize using NInput's built-in capabilities -->
<NInput 
  :autosize="{ minRows: 1, maxRows: 3 }" 
  @update:value="handleUpdate"
/>

<!-- Maintain restraint in missing variable prompts -->
<NTag v-if="missingCount > 0" size="small" type="warning">
  Missing: {{ missingCount }}
</NTag>
```

### Task Sequence Optimization
- 2.1.1 Advance configuration of optimizationMode parameter
- 2.2.2 Template debugging dependent on parameter from 2.1.1
- Avoid issues of incomplete links during development

These are very pragmatic engineering optimization suggestions that avoid common issues such as type inconsistencies, string concatenation errors, and difficulties in development debugging.