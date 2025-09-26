# TestArea Component System

The modular component system of the Test Area after refactoring provides a unified AI prompt testing interface. It includes a complete solution with functions such as input, control, and result display.

## Overview

The TestArea component system adopts a modular architecture, consisting of the following core components:
- **TestAreaPanel** - Main container component that manages layout and state uniformly
- **TestInputSection** - Component for inputting test content
- **TestControlBar** - Component for the test control bar  
- **TestResultSection** - Component for displaying test results
- **ConversationSection** - Wrapper component for session management

## Key Features

✅ **Unified Design Style** - Based on the Naive UI design system, ensuring visual consistency  
✅ **Responsive Layout** - Automatically adapts to different screen sizes and device types  
✅ **Theme Compatibility** - Fully compatible with light/dark theme switching  
✅ **Mode Switching** - Supports system prompt/user prompt modes  
✅ **Comparison Testing** - Supports parallel comparison of original vs optimized prompts  
✅ **Type Safety** - Complete TypeScript type definitions  

## Quick Start

### Basic Usage

```vue
<template>
  <TestAreaPanel
    :optimization-mode="optimizationMode"
    :is-test-running="isTestRunning"
    :test-content="testContent"
    :is-compare-mode="isCompareMode"
    @update:test-content="testContent = $event"
    @compare-toggle="handleCompareToggle"
    @test="handleTest"
  >
    <template #model-select>
      <ModelSelectUI v-model="selectedModel" />
    </template>
  </TestAreaPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TestAreaPanel, ModelSelectUI } from '@prompt-optimizer/ui'
import type { OptimizationMode } from '@prompt-optimizer/core'

const optimizationMode = ref<OptimizationMode>('system')
const isTestRunning = ref(false)
const testContent = ref('')
const isCompareMode = ref(true)
const selectedModel = ref('gpt-4')

const handleCompareToggle = () => {
  isCompareMode.value = !isCompareMode.value
}

const handleTest = async () => {
  isTestRunning.value = true
  try {
    // Execute testing logic
  } finally {
    isTestRunning.value = false
  }
}
</script>
```

### Advanced Configuration

```vue
<template>
  <TestAreaPanel
    :optimization-mode="optimizationMode"
    :is-test-running="isTestRunning"
    :advanced-mode-enabled="advancedModeEnabled"
    :test-content="testContent"
    :is-compare-mode="isCompareMode"
    :enable-compare-mode="enableCompareMode"
    :enable-fullscreen="true"
    :input-mode="inputMode"
    :control-bar-layout="controlBarLayout"
    :button-size="buttonSize"
    @update:test-content="testContent = $event"
    @compare-toggle="handleCompareToggle"
    @test="handleTest"
  >
    <!-- Model selection slot -->
    <template #model-select>
      <ModelSelectUI 
        v-model="selectedModel" 
        :size="buttonSize"
      />
    </template>
    
    <!-- Original result slot -->
    <template #original-result>
      <OutputDisplay :content="originalResult" />
    </template>
    
    <!-- Optimized result slot -->
    <template #optimized-result>
      <OutputDisplay :content="optimizedResult" />
    </template>
    
    <!-- Single result slot -->
    <template #single-result>
      <OutputDisplay :content="singleResult" />
    </template>
  </TestAreaPanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  TestAreaPanel, 
  ModelSelectUI, 
  OutputDisplay,
  useResponsiveTestLayout 
} from '@prompt-optimizer/ui'

// Responsive layout configuration
const { 
  inputMode, 
  controlBarLayout, 
  buttonSize,
  isMobile 
} = useResponsiveTestLayout()

// State management
const optimizationMode = ref<OptimizationMode>('system')
const isTestRunning = ref(false)
const advancedModeEnabled = ref(false)
const testContent = ref('')
const isCompareMode = ref(true)
const selectedModel = ref('gpt-4')

// Result data
const originalResult = ref('')
const optimizedResult = ref('')
const singleResult = computed(() => optimizedResult.value)

// Dynamically configure based on screen size
const enableCompareMode = computed(() => !isMobile.value)
</script>
```

## API Reference

### TestAreaPanel Props

| Property Name | Type | Default Value | Description |
|---------------|------|---------------|-------------|
| `optimizationMode` | `OptimizationMode` | `'system'` | Optimization mode: 'system' or 'user' |
| `isTestRunning` | `boolean` | `false` | Indicates whether the test is running |
| `advancedModeEnabled` | `boolean` | `false` | Indicates whether advanced mode is enabled |
| `testContent` | `string` | `''` | Test content (supports v-model) |
| `isCompareMode` | `boolean` | `false` | Indicates whether it is in comparison mode |
| `enableCompareMode` | `boolean` | `true` | Indicates whether switching to comparison mode is allowed |
| `enableFullscreen` | `boolean` | `true` | Indicates whether to enable fullscreen editing |
| `inputMode` | `'default' \| 'compact'` | `'default'` | Input box display mode |
| `controlBarLayout` | `'default' \| 'compact'` | `'default'` | Control bar layout mode |
| `buttonSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |

### TestAreaPanel Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| `update:testContent` | `(value: string)` | Changes in test content |
| `compare-toggle` | `()` | Toggle comparison mode |
| `test` | `()` | Start testing |

### TestAreaPanel Slots

| Slot Name | Description | Example |
|-----------|-------------|---------|
| `model-select` | Model selection component | `<ModelSelectUI v-model="model" />` |
| `original-result` | Display of original test results | `<OutputDisplay :content="result" />` |
| `optimized-result` | Display of optimized test results | `<OutputDisplay :content="result" />` |
| `single-result` | Display of single mode results | `<OutputDisplay :content="result" />` |

## Subcomponent Description

### TestInputSection

Component for inputting test content, supports intelligent height adjustment and fullscreen editing.

```vue
<TestInputSection
  v-model="content"
  :label="inputLabel"
  :placeholder="placeholder"
  :disabled="disabled"
  :mode="inputMode"
  :enable-fullscreen="true"
/>
```

**Props:**
- `modelValue: string` - Input content
- `label: string` - Input box label
- `placeholder: string` - Placeholder text
- `helpText: string` - Help text
- `disabled: boolean` - Whether it is disabled
- `mode: 'default' | 'compact'` - Display mode
- `enableFullscreen: boolean` - Whether to enable fullscreen

### TestControlBar

Component for the test control bar, providing model selection and test control functions.

```vue
<TestControlBar
  :model-label="t('test.model')"
  :show-compare-toggle="enableCompareMode"
  :is-compare-mode="isCompareMode"
  :primary-action-text="buttonText"
  :primary-action-disabled="!canTest"
  :primary-action-loading="isTestRunning"
  :layout="controlBarLayout"
  :button-size="buttonSize"
  @compare-toggle="$emit('compare-toggle')"
  @primary-action="$emit('primary-action')"
>
  <template #model-select>
    <slot name="model-select" />
  </template>
</TestControlBar>
```

### TestResultSection

Component for displaying test results, supporting comparison mode and single mode layout.

```vue
<TestResultSection
  :is-compare-mode="isCompareMode"
  :vertical-layout="verticalLayout"
  :show-original="showOriginal"
  :original-title="originalTitle"
  :optimized-title="optimizedTitle"
  :single-result-title="singleTitle"
>
  <template #original-result>
    <slot name="original-result" />
  </template>
  <template #optimized-result>
    <slot name="optimized-result" />
  </template>
  <template #single-result>
    <slot name="single-result" />
  </template>
</TestResultSection>
```

### ConversationSection

Wrapper component for session management, controlling the display of the session management panel in advanced mode.

```vue
<ConversationSection
  :visible="showConversation"
  :collapsible="true"
  :title="conversationTitle"
  :max-height="maxHeight"
>
  <ConversationManager v-model="conversations" />
</ConversationSection>
```

## Composables

### useResponsiveTestLayout

Responsive layout management hook that automatically adjusts component configuration based on screen size.

```ts
import { useResponsiveTestLayout } from '@prompt-optimizer/ui'

const {
  isMobile,           // Whether it is mobile
  isTablet,           // Whether it is tablet
  currentBreakpoint,  // Current breakpoint
  inputMode,          // Recommended input mode
  controlBarLayout,   // Recommended control bar layout
  buttonSize,         // Recommended button size
  responsiveHeights   // Responsive height configuration
} = useResponsiveTestLayout()
```

### useTestModeConfig

Test mode configuration management hook that handles display logic under different optimization modes.

```ts
import { useTestModeConfig } from '@prompt-optimizer/ui'

const {
  currentModeConfig,      // Current mode configuration
  showTestInput,          // Whether to show test input
  requiresTestContent,    // Whether test content is required
  inputLabel,             // Input box label
  canStartTest,           // Whether testing can start
  enableCompareMode,      // Whether to enable comparison mode
  showConversationManager, // Whether to show session management
  getDynamicButtonText,   // Get dynamic button text
  validateTestSetup       // Validate test configuration
} = useTestModeConfig(optimizationMode)
```

## Style Guidelines

All TestArea components follow the [Test Area Component Style Guidelines](./test-area-style-guide.md):

- Use Naive UI design system components
- Hardcoding pixel values and Tailwind CSS classes is prohibited
- Unified spacing and text style system
- Complete responsive layout support
- Theme compatibility requirements

## Best Practices

### 1. Responsive Design

```vue
<script setup>
// Use responsive layout hook
const { inputMode, controlBarLayout, buttonSize, isMobile } = useResponsiveTestLayout()

// Dynamically adjust features based on screen size
const enableAdvancedFeatures = computed(() => !isMobile.value)
</script>
```

### 2. State Management

```vue
<script setup>
// Centrally manage test-related state
const testState = reactive({
  mode: 'system' as OptimizationMode,
  content: '',
  isRunning: false,
  isCompareMode: true,
  results: {
    original: '',
    optimized: ''
  }
})

// Use computed properties to handle complex logic
const canStartTest = computed(() => {
  if (testState.mode === 'system') {
    return testState.content.length > 0
  }
  return true // User mode does not require additional input
})
</script>
```

### 3. Error Handling

```vue
<script setup>
const handleTest = async () => {
  testState.isRunning = true
  
  try {
    await promptService.testPromptStream(
      systemPrompt,
      userPrompt,
      selectedModel.value,
      {
        onToken: (token) => {
          // Handle streaming token
        },
        onComplete: () => {
          // Testing completed
        },
        onError: (error) => {
          console.error('Test failed:', error)
          // Display error message
        }
      }
    )
  } catch (error) {
    console.error('Test request failed:', error)
  } finally {
    testState.isRunning = false
  }
}
</script>
```

### 4. Internationalization Support

```vue
<template>
  <TestAreaPanel
    :optimization-mode="optimizationMode"
    <!-- Other props -->
  >
    <template #model-select>
      <ModelSelectUI 
        v-model="selectedModel"
        :placeholder="$t('common.selectModel')"
      />
    </template>
  </TestAreaPanel>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Dynamically compute label text
const inputLabel = computed(() => {
  return optimizationMode.value === 'system' 
    ? t('test.content')
    : t('test.userPromptTest')
})
</script>
```

## Testing

### Unit Testing

The TestArea component provides complete test coverage:

```bash
# Run component unit tests
pnpm -F @prompt-optimizer/ui test -- tests/unit/components/TestAreaPanel.spec.ts

# Run integration tests
pnpm -F @prompt-optimizer/ui test -- tests/unit/components/test-area-integration.spec.ts

# Run end-to-end tests
pnpm -F @prompt-optimizer/ui test -- tests/unit/components/test-area-e2e.spec.ts
```

### Test Cases

```ts
import { mount } from '@vue/test-utils'
import { TestAreaPanel } from '@prompt-optimizer/ui'

describe('TestAreaPanel', () => {
  it('should correctly handle mode switching', async () => {
    const wrapper = mount(TestAreaPanel, {
      props: {
        optimizationMode: 'system',
        testContent: 'Test content',
        isCompareMode: true
      }
    })

    // Verify initial state
    expect(wrapper.find('[data-testid="test-input-section"]').exists()).toBe(true)
    
    // Switch to user mode
    await wrapper.setProps({ optimizationMode: 'user' })
    
    // Verify state update
    expect(wrapper.find('[data-testid="test-input-section"]').exists()).toBe(false)
  })
})
```

## Troubleshooting

### Common Issues

**Q: Component styles display abnormally?**  
A: Check if the NConfigProvider from Naive UI is correctly imported to ensure the theme system works properly.

**Q: Responsive layout not working?**  
A: Confirm that the useResponsiveTestLayout hook is used and the layout configuration props are passed correctly.

**Q: Testing functionality not working?**  
A: Check if services are correctly injected via provide/inject mechanism to ensure promptService is available.

**Q: TypeScript type errors?**  
A: Confirm that the correct type definitions are imported and check the version compatibility of @prompt-optimizer/core and @prompt-optimizer/ui.

### Debugging Tools

```vue
<script setup>
// Enable debugging in development mode
if (import.meta.env.DEV) {
  // Listen for state changes
  watch(() => testState, (newState) => {
    console.log('TestArea state changed:', newState)
  }, { deep: true })
  
  // Expose component state to global
  window.__testAreaDebug = {
    state: testState,
    config: useTestModeConfig(optimizationMode),
    layout: useResponsiveTestLayout()
  }
}
</script>
```

## Changelog

### v1.0.0 (2025-01-20)
- ✨ Initial release of TestArea component system
- ✨ Supports system/user prompt modes
- ✨ Complete responsive layout system
- ✨ Comparison testing functionality
- ✨ Theme compatibility
- ✨ Complete TypeScript type support

---

**Document Last Updated:** 2025-01-20  
**Component Version:** v1.0.0  
**Compatibility:** Vue 3.x, Naive UI 2.x