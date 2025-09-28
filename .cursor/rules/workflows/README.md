# AI Development Workflow v5.0

Simplified 3-core process architecture, focused on complete task lifecycle management.

## 🎯 Core Concepts

**3 Core Workflows**:
1. **Task Initialization** - Set up new tasks, analyze requirements, formulate plans
2. **Task Execution** - Iterative development, update progress, record discoveries
3. **Task Archiving** - Organize results, create documentation, reset environment

**Key Principles**:
- Keep workspace clean, only handle current tasks
- Provide timely feedback, use mcp-feedback-enhanced tool for active communication
- Complete records, provide reference for subsequent development

## 📋 Workflow Selection Guide

### When to use Workflow 1: Task Initialization
**Trigger Conditions**:
- Start new feature development
- Start major refactoring work
- workspace is empty or in template state
- User proposes new development requirements

**Documentation**: [1-task-initialization.md](./1-task-initialization.md)

### When to use Workflow 2: Task Execution
**Trigger Conditions**:
- Task has been initialized, in development process
- Need to record development progress
- Encounter technical issues that need recording
- Task status changes

**Documentation**: [2-task-execution.md](./2-task-execution.md)

### When to use Workflow 3: Task Archiving
**Trigger Conditions**:
- Task basically completed, needs organization
- workspace content is excessive, needs cleanup
- Important experience needs permanent preservation
- Preparing to start new major tasks

**Documentation**: [3-task-archiving.md](./3-task-archiving.md)

## 🤖 AI Assistant Usage Standards

### Must Use Feedback Tool
Each workflow requires AI assistant to use `mcp-feedback-enhanced` tool at key nodes:
- **At task start** - Confirm understanding and plans
- **At key milestones** - Report progress and obtain feedback
- **When encountering problems** - Seek guidance and confirmation
- **At task completion** - Confirm results and next steps

### Feedback Timing Requirements
- **Don't wait until the end to provide feedback** - Actively communicate during the process
- **Must provide feedback before important decisions** - Obtain user confirmation before continuing
- **Provide immediate feedback when problems are discovered** - Don't continue in wrong directions

### Feedback Content Requirements
- **Concise and clear** - Use 1-2 sentences to explain current status and content needing confirmation
- **Provide options** - Give specific solution options for user selection
- **Include context** - Explain why this feedback is needed

## 🔧 Common Tool Commands

### Workspace Reset
```batch
del docs\workspace\*.md
copy docs\workspace-template\*.md docs\workspace\
ren docs\workspace\scratchpad-template.md scratchpad.md
ren docs\workspace\todo-template.md todo.md
ren docs\workspace\experience-template.md experience.md
```

### Create New Archive
```batch
mkdir "docs\archives\[编号]-[功能名称]"
```

### Check workspace Status
Should only have 3 files, and content is in template format:
- `scratchpad.md` - Contains placeholders like `[任务名称]`
- `todo.md` - Contains placeholders like `[任务描述]`
- `experience.md` - Contains placeholders like `[经验描述]`

## 📚 Related Documentation

- [quick-reference.md](./quick-reference.md) - Quick reference cards
- [ai-development-workflow-v4.0-backup.mdc](./ai-development-workflow-v4.0-backup.mdc) - Historical version backup

## 📊 Version Information

- **Current Version**: v5.0
- **Update Time**: 2025-01-01
- **Main Improvements**: Simplified to 3 core processes, strengthened feedback mechanism, removed complexity classification
- **Backward Compatibility**: v4.0 backup files retained in the same directory

---

**Core Principles**: Simple, timely, complete
