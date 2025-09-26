# To-Do List

## 🎯 Core Task: Core Service Interface Isolation Refactoring

### Priority: High

- **Goal**: Ensure the UI layer interacts with core services entirely through interfaces, unifying the Web and Desktop architecture.
- **Deadline**: To be determined

---

### ✅ Completed

1.  **Refactor `ModelManager`**
    - [x] Create `modelManagerAdapter` in `useAppInitializer`
    - [x] Complete `IModelManager` interface
    - [x] Add `isInitialized`, `getModelOptions` to `ModelManager` implementation
    - [x] Update `ElectronModelManagerProxy`
    - [x] Update `preload.js`
    - [x] Update `main.js`

2.  **Refactor `HistoryManager`**
    - [x] Create `historyManagerAdapter` in `useAppInitializer`
    - [x] Complete `IHistoryManager` interface (fix `addIteration`, add `deleteChain`)
    - [x] Add `deleteChain` to `HistoryManager` implementation
    - [x] Update `ElectronHistoryManagerProxy`
    - [x] Update `preload.js`
    - [x] Update `main.js`

---

### 📋 Pending

3.  **Refactor `TemplateManager`**
    - [ ] Create `templateManagerAdapter` in `useAppInitializer`
    - [ ] Check and complete `ITemplateManager` interface based on compilation errors
    - [ ] Update `ElectronTemplateManagerProxy` for new interface methods
    - [ ] Update `preload.js` for new interface methods
    - [ ] Update `main.js` for new interface methods

4.  **Refactor `LLMService`**
    - [ ] Create `llmServiceAdapter` in `useAppInitializer`
    - [ ] Complete `ILLMService` interface
    - [ ] Update `ElectronLLMProxy`
    - [ ] Update `preload.js`
    - [ ] Update `main.js`

5.  **Refactor `PromptService`**
    - [ ] Create `promptServiceAdapter` in `useAppInitializer`
    - [ ] Complete `IPromptService` interface
    - [ ] Update `ElectronPromptServiceProxy`
    - [ ] Update `preload.js`
    - [ ] Update `main.js`

6.  **Final Validation**
    - [ ] Run complete unit tests and integration tests
    - [ ] Start Web and Desktop applications separately, manually test all core functionalities

---

### 📝 Notes
- The refactoring of `DataManager` and `PreferenceService` will be done as needed, and it currently seems unnecessary.

## 🔥 Urgent Tasks

### Must be completed this week
- [ ] [Task Description] - [Deadline] - [Responsible Person]
- [ ] [Task Description] - [Deadline] - [Responsible Person]

### Today's Focus
- [ ] [Task Description] - [Estimated Time]
- [ ] [Task Description] - [Estimated Time]

## ⭐ Important Tasks

### Feature Development
- [ ] [Feature Name] - [Priority] - [Estimated Duration]
- [ ] [Feature Name] - [Priority] - [Estimated Duration]

### Technical Debt
- [ ] [Technical Debt Description] - [Impact Level] - [Estimated Duration]
- [ ] [Technical Debt Description] - [Impact Level] - [Estimated Duration]

### Document Updates
- [ ] [Document Name] - [Update Content] - [Estimated Time]
- [ ] [Document Name] - [Update Content] - [Estimated Time]

## 📋 General Tasks

### Optimization Improvements
- [ ] [Optimization Project] - [Expected Outcome]
- [ ] [Optimization Project] - [Expected Outcome]

### Learning and Research
- [ ] [Learning Content] - [Learning Objective]
- [ ] [Learning Content] - [Learning Objective]

### Tool Configuration
- [ ] [Tool Name] - [Configuration Objective]
- [ ] [Tool Name] - [Configuration Objective]

## ✅ Completed

### Completed this Week
- [x] [Task Description] - [Completion Date] - [Notes]
- [x] [Task Description] - [Completion Date] - [Notes]

## 🗓️ Future Plans

### Plans for Next Week
- [Plan Content] - [Expected Goal]
- [Plan Content] - [Expected Goal]

### Goals for This Month
- [Monthly Goal] - [Key Milestone]
- [Monthly Goal] - [Key Milestone]

---

## 📝 Usage Instructions

1. **Priority Management** - Categorize tasks by urgency
2. **Time Estimation** - Estimate the time required for each task
3. **Regular Updates** - Update progress daily, review and adjust weekly
4. **Completion Marking** - Timely mark completed tasks and record notes