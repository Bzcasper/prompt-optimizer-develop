# Technical Implementation Details

## 🔧 Architecture Design

### Overall Architecture Evolution
```
Original Architecture                Expanded Architecture
┌─────────────┐           ┌─────────────────────────────────┐
│ BasicTestPanel │    →     │ AdvancedTestPanel (Main Component) │
└─────────────┘           │ ├── BasicTestMode               │
                          │ ├── ConversationManager         │
                          │ ├── VariableManagerModal        │
                          │ └── ToolManager                 │
                          └─────────────────────────────────┘
```

### Core Design Principles
1. **Minimal Intrusion** - Minimal expansion based on the existing architecture
2. **Backward Compatibility** - All new features are optional
3. **Separation of Concerns** - UI layer manages variables, Core layer handles logic
4. **Type Safety** - Complete TypeScript type support

## 🧪 Advanced Variable Management Implementation

### 1. VariableManager Service Architecture
```typescript
export class VariableManager implements IVariableManager {
  private customVariables: Record<string, string> = {};
  private readonly predefinedVariables = [
    'originalPrompt', 
    'lastOptimizedPrompt', 
    'iterateInput',
    'currentPrompt'  // New: Used during testing phase
  ];
  
  // Variable CRUD operations
  setVariable(name: string, value: string): void {
    if (!this.validateVariableName(name)) {
      throw new Error(`Invalid variable name: ${name}`);
    }
    this.customVariables[name] = value;
    this.saveCustomVariables();
  }
  
  // Resolve all variables (predefined + custom)
  resolveAllVariables(context: TemplateContext): Record<string, string> {
    const predefinedVars = this.extractPredefinedVariables(context);
    return { ...predefinedVars, ...this.customVariables };
  }
}
```

### 2. ConversationManager Implementation
```typescript
export function useConversationManager() {
  const messages = ref<ConversationMessage[]>([]);
  
  // Detect missing variables
  const getMissingVariables = (content: string): string[] => {
    const referencedVars = variableManager.scanVariablesInContent(content);
    const availableVars = Object.keys(variableManager.listVariables());
    return referencedVars.filter(variable => !availableVars.includes(variable));
  };
  
  // Preview messages (after variable replacement)
  const previewMessages = (variables: Record<string, string>): ConversationMessage[] => {
    return messages.value.map(message => ({
      ...message,
      content: replaceVariables(message.content, variables)
    }));
  };
}
```

### 3. Interface Redesign Implementation
```vue
<!-- MainLayout Navigation Menu Integration -->
<div class="navigation-actions">
  <!-- Advanced Mode Navigation Button -->
  <ActionButtonUI
    icon="🚀"
    :text="$t('nav.advancedMode')"
    @click="toggleAdvancedMode"
    :class="{ 'active-button': advancedModeEnabled }"
  />
  
  <!-- Variable Management Button - Only displayed in Advanced Mode -->
  <ActionButtonUI
    v-if="advancedModeEnabled"
    icon="📊"
    :text="$t('nav.variableManager')"
    @click="showVariableManager = true"
  />
</div>
```

## 🛠️ Tool Invocation Functionality Implementation

### 1. Unified Tool Invocation Interface Design
```typescript
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface StreamHandlers {
  onToken: (token: string) => void;
  onReasoningToken?: (token: string) => void;
  onToolCall?: (toolCall: ToolCall) => void;  // New
  onComplete: (response?: LLMResponse) => void;
  onError: (error: Error) => void;
}
```

### 2. OpenAI Tool Invocation Implementation
```typescript
async streamOpenAIMessageWithTools(
  messages: Message[],
  modelConfig: ModelConfig,
  tools: ToolDefinition[],
  callbacks: StreamHandlers
): Promise<void> {
  const completionConfig: any = {
    model: modelConfig.defaultModel,
    messages: formattedMessages,
    tools: tools,
    tool_choice: 'auto',
    stream: true,
    ...restLlmParams
  };
  
  // Handle tool call delta
  const toolCallDeltas = chunk.choices[0]?.delta?.tool_calls;
  if (toolCallDeltas) {
    for (const toolCallDelta of toolCallDeltas) {
      // Delta handling logic
      if (callbacks.onToolCall) {
        callbacks.onToolCall(currentToolCall);
      }
    }
  }
}
```

### 3. Gemini Tool Invocation Adaptation
```typescript
async streamGeminiMessageWithTools(
  messages: Message[],
  modelConfig: ModelConfig,
  tools: ToolDefinition[],
  callbacks: StreamHandlers
): Promise<void> {
  // Convert tool format to Gemini standard
  const geminiTools = this.convertToGeminiTools(tools);
  
  // Handle Gemini tool invocation
  const functionCalls = chunk.functionCalls();
  if (functionCalls && functionCalls.length > 0) {
    for (const functionCall of functionCalls) {
      const toolCall: ToolCall = {
        id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'function' as const,
        function: {
          name: functionCall.name,
          arguments: JSON.stringify(functionCall.args)
        }
      };
      
      if (callbacks.onToolCall) {
        callbacks.onToolCall(toolCall);
      }
    }
  }
}
```

## 📝 Key Issue Resolution Records

### Issue 1: Variable State Synchronization Problem
**Problem**: AdvancedTestPanel creates independent instances of the variable manager, leading to data desynchronization.
**Solution**: Unified variable manager instance
```typescript
const variableManager: Ref<VariableManagerHooks | null> = computed(() => {
  if (props.variableManager) {
    return props.variableManager  // Use the unified instance passed from App.vue
  }
  return localVariableManager      // Backup solution
})
```

### Issue 2: TypeScript Type Safety Problem
**Problem**: Tool invocation type 'string' cannot be assigned to '"function"'.
**Solution**: Use literal type assertion
```typescript
const toolCall: ToolCall = {
  id: `call_${Date.now()}`,
  type: 'function' as const,  // Add as const assertion
  function: {
    name: functionCall.name,
    arguments: JSON.stringify(functionCall.args)
  }
};
```

### Issue 3: Theme CSS Integration Problem
**Problem**: New components use hard-coded styles, inconsistent with the theme system.
**Solution**: Use the project's unified theme CSS classes
```vue
<div class="add-message-row theme-manager-card">
  <button class="add-message-btn theme-manager-button-secondary">
    Add Message
  </button>
</div>
```

## 🔄 Apply to Test Function Innovation Implementation

### Intelligent Template Configuration System
Transition from simple advanced mode activation to intelligent test configuration:
```typescript
const applyOptimizedPromptToTest = (optimizationData: {
  originalPrompt: string
  optimizedPrompt: string
  optimizationMode: string
}) => {
  if (optimizationData.optimizationMode === 'system') {
    // System prompt optimization: system message + user interaction message
    conversationMessages.value = [
      { role: 'system', content: '{{currentPrompt}}' },
      { role: 'user', content: 'Please demonstrate your abilities and interact with me according to your role setting.' }
    ]
  } else {
    // User prompt optimization: only user message
    conversationMessages.value = [
      { role: 'user', content: '{{currentPrompt}}' }
    ]
  }
}
```

## 🧪 Testing Verification

### MCP Tool End-to-End Testing
Complete workflow verification using MCP Playwright tool:
1. **Tool Creation** - Create get_weather tool in ContextEditor
2. **Tool Synchronization** - Sync from optimization phase to testing phase  
3. **Prompt Optimization** - Optimize system prompt for weather assistant
4. **Tool Invocation Testing** - Execute Gemini tool invocation tests
5. **Result Verification** - Confirm correct transmission of tool invocation information

### Testing Results
- ✅ Tool definitions correctly created and saved
- ✅ UI displays "Tools: 1" and "Used Tool: get_weather"
- ✅ Gemini API correctly carries tool information
- ✅ Tool invocation process fully executed
- ✅ Test results show AI response and tool intent

## 📊 Architectural Advantages

### 1. Multi-Provider Compatibility
- **OpenAI** - Directly use tool_calls delta handling
- **Gemini** - Convert functionCalls() to standard ToolCall format
- **Backward Compatibility** - Existing API with non-breaking changes

### 2. Component Decoupling Design
```
ContextEditor (Tool Creation and Management)
      ↓ 
ConversationManager (Tool Statistics and Synchronization)
      ↓
AdvancedTestPanel (Tool Invocation Testing)
```

### 3. Data Flow Management
- **Tool Variable Separation** - Tool definitions do not use the variable system
- **Unified Message Structure** - ConversationMessage reused in optimization and testing phases
- **State Persistence** - Use a unified preferenceService