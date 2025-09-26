# Development Draft

Record the progress and thoughts of the current development tasks.

## Current Tasks

### [Task Name] - [Start Date]
**Goal**: [Specific goal description]  
**Status**: In Progress

#### Planned Steps
[ ] 1. Requirement Analysis  
[ ] 2. Technical Solution Design  
[ ] 3. Function Implementation  
[ ] 4. Testing and Validation  
[ ] 5. Documentation Update  

#### Progress Record
- [Date] [Specific progress description]  
- [Date] [Problems encountered and solutions]

#### Important Discoveries
- [Record important technical discoveries or experiences]

---

## Historical Tasks

### [Completed Task Name] - [Completion Date] ✅
**Summary**: [Brief summary]  
**Experience**: [Key experiences extracted]

---

## To-Do List

### Urgent
- [ ] [Urgent Task 1]  
- [ ] [Urgent Task 2]  

### Important
- [ ] [Important Task 1]  
- [ ] [Important Task 2]  

### General
- [ ] [General Task 1]  
- [ ] [General Task 2]  

---

## Issue Record

### Unresolved
- [Issue description] - [Discovery date]

### Resolved
- [Issue description] - [Solution] - [Resolution date]

---

## Notes
[Other information that needs to be recorded]

## Task: Core Service Interface Isolation Refactoring - 2025-07-03

### Goal
Check each reference of the `ui` module to the `core` module to ensure all calls are made through interfaces (such as `IModelManager`) rather than concrete implementation classes (such as `ModelManager`). Standardize the calling conventions for both Web and Desktop versions, and fix the IPC communication link issues that arise from this.

### Planned Steps
*See `todo.md`*

### Progress Record
- **2025-07-03**: **Milestone Achieved: Core Manager Refactoring**
  - **Outcome**: Successfully refactored `ModelManager` and `HistoryManager`. An adapter was created in `useAppInitializer.ts` to enforce that the UI layer only calls through interfaces.
  - **Discovery**: The "shortcut" that allows the Web application to work (directly calling instances) is the root cause of the failure in the Desktop version (multi-process IPC). Architecturally, implementation details must be masked at the source of initialization.
  - **Status**: Updates to `IModelManager`, `IHistoryManager`, and their corresponding implementations, proxies, and IPC links have been completed.

### Issue Record
*None*

### Milestones
- [x] Refactor ModelManager  
- [x] Refactor HistoryManager  
- [ ] Refactor TemplateManager  
- [ ] Refactor LLMService  
- [ ] Refactor PromptService  
- [ ] Refactor Other Services  
- [ ] Complete Final Testing