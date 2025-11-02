# Technical Development Guide

> **Note:** This document integrates the original development guide and technical documentation to provide a complete overview of the technology stack and development specifications.

## 1. Project Technical Architecture

### 1.1 Overall Architecture
- Monorepo structure
  - packages/core - Core functionality package
  - packages/web - Web application
  - packages/extension - Chrome extension
  - packages/ui - Shared UI components
- Inter-package dependency management
  - Clear dependency relationships
  - Version consistency
  - Minimized code duplication
- Engineering tools
  - pnpm workspace
  - Multi-package management
  - Unified version control

### 1.2 Technology Stack Overview

#### 1.2.1 Core Package (@prompt-optimizer/core)
- TypeScript 5.3.x
  - Type system
  - Interface definitions
  - Modularity
- Native SDK integration
  - OpenAI SDK ^4.83.0
  - Google Generative AI SDK ^0.21.0
  - Model management
  - Prompt processing
  - Streaming responses
- Utility libraries
  - uuid ^11.0.5
  - zod ^3.22.4
  - Error handling
  - Type definitions

#### 1.2.2 Web Package (@prompt-optimizer/web)
- Vue 3.5.x
  - Composition API
  - Script Setup
  - Reactivity system
  - Component ecosystem
- Vite 6.0.x
  - Fast development server
  - Optimized builds
  - Plugin system
  - HMR support

#### 1.2.3 UI Framework and Styling
- TailwindCSS 3.4.x
  - Utility-first
  - Responsive design
  - Dark mode support
  - Animation system
- Vue Transitions
  - Page transition animations
  - Component switching effects
  - List animations
- Naive UI 2.42.x
  - Enterprise-level component library
  - Full TypeScript support
  - Theme customization system
  - Responsive component design

#### 1.2.4 State Management
- Vue Reactivity
  - ref/reactive
  - computed
  - watch
  - watchEffect
- Composables pattern
  - Reusability of stateful logic
  - Reactive composition
  - Lifecycle management
  - Side effect handling
- LocalStorage
  - Configuration persistence
  - History storage
  - Template management
  - Encrypted storage

#### 1.2.5 Security
- WebCrypto API
  - API key encryption
  - Secure storage
  - Key rotation
- XSS protection
  - Input validation
  - Content filtering
  - Secure coding
- CORS configuration
  - API access control
  - Security headers
  - CSP policy

#### 1.2.6 Development Tools
- TypeScript 5.3.x
  - Type checking
  - Code completion
  - Interface definitions
- ESLint 8.56.x
  - Code standards
  - Auto-fixing
  - TypeScript support
- Prettier 3.2.x
  - Code formatting
  - Consistent style
  - Editor integration

#### 1.2.7 Testing Frameworks
- Vitest 3.0.x
  - Unit testing
  - Integration testing
  - Snapshot testing
  - Coverage reports
- Vue Test Utils 2.4.x
  - Component testing
  - Behavior simulation
  - Event testing
- Playwright 1.41.x
  - E2E testing
  - Cross-browser testing
  - Visual regression testing

### 1.3 Code Organization
- Modular design
  - Organize modules by functionality
  - Single Responsibility Principle
  - Separation of Concerns
- Unified directory structure
  - src/ - Source code
  - tests/ - Test code
  - types/ - Type definitions
  - config/ - Configuration files

## 2. Core Package Development Specifications

### 2.1 Service Implementation Specifications
- Interface consistency
  - All services must implement a unified interface
  - Method naming should be consistent
  - Error handling should follow a unified pattern
  - Return value types should be consistent

- Error handling
  - Use unified error types
  - Error messages should include context
  - Implement error recovery mechanisms
  - Provide user-friendly error messages

### 2.2 SDK Integration Specifications
- Native SDK integration
  - Use official SDKs directly
  - Avoid unnecessary abstraction layers
  - Keep versions updated
  - Follow official best practices

- Error mapping
  - Map SDK-specific errors to unified error types
  - Preserve original error information
  - Implement retry mechanisms
  - Provide fallback solutions

### 2.3 Type Definition Specifications
- Type safety
  - Use precise type definitions
  - Avoid the `any` type
  - Use union types to represent possible values
  - Define interfaces for complex objects

- Type exports
  - Centralize type exports in `index.ts`
  - Organize type definitions by module
  - Use namespaces to avoid conflicts
  - Provide type documentation comments

### 2.4 Testing Specifications
- Unit testing
  - Target >80% test coverage
  - Test boundary conditions
  - Mock external dependencies
  - Validate error handling

- Integration testing
  - Test interactions between services
  - Validate end-to-end flows
  - Test performance and concurrency
  - Simulate real-world environments

## 3. Frontend Development Specifications

### 3.1 Project Architecture
- Recommended directory structure
  ```
  src/
  ├── components/    # UI components
  ├── composables/   # Composable functions
  ├── views/         # Page components
  ├── services/      # Service layer
  ├── config/        # Configuration files
  ├── assets/        # Static assets
  ├── utils/         # Utility functions
  ├── types/         # Type definitions
  ├── App.vue        # Root component
  └── main.ts        # Entry file
  ```

- Naming conventions
  - Component files: PascalCase.vue
  - Utility function files: camelCase.ts
  - Type definition files: camelCase.types.ts
  - Composable functions: useXxx.ts

### 3.2 Service Usage Specifications
- Core service integration
  - Use a unified service access pattern
  - Implement service singleton pattern
  - Handle service initialization
  - Manage service state

- Error handling
  - Use a unified error handling mechanism
  - Provide user-friendly error messages
  - Implement error recovery
  - Log errors

### 3.3 Component Development Specifications
- Vue component templates
  - Use `<script setup>` syntax
  - Clearly define props and emits
  - Use TypeScript types
  - Follow the Single Responsibility Principle

- Component design principles
  - Components should be reusable
  - Components should be testable
  - Components should be maintainable
  - Components should be extensible

### 3.4 Type System
- Vue component types
  - Define clear types for props
  - Define event types for emits
  - Define types for refs and reactives
  - Use generics to enhance type safety

- General utility types
  - Create reusable utility types
  - Use TypeScript's built-in utility types
  - Define types for complex data structures
  - Avoid type assertions

### 3.5 State Management
- Composables pattern
  - Organize composables by functional module
  - Use Composition API style
  - Implement state sharing and reuse
  - Handle asynchronous operations and side effects

- Reactive state management
  - Use `ref`/`reactive` to manage local state
  - Use `provide`/`inject` for dependency injection
  - Reuse state logic through composables
  - Manage component lifecycle and cleanup

### 3.6 TypeScript and ESLint Configuration Guide

#### 3.6.1 TypeScript Configuration Best Practices

**Project-level tsconfig.json configuration**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noEmit": true,
    "useDefineForClassFields": true
  },
  "include": ["src/**/*", "*.vue"],
  "exclude": ["node_modules", "dist"]
}
```

**Vue component type definitions**
```typescript
// Component Props type definition
interface ComponentProps {
  title: string
  items: Array<{ id: string, name: string }>
  onSelect?: (item: any) => void
}

// Component Emits type definition
const emit = defineEmits<{
  select: [item: any]
  update: [value: string]
}>()

// Reactive data type
const formData = ref<{
  username: string
  modelConfig: ModelConfig | null
}>({
  username: '',
  modelConfig: null
})
```

**Service interface type safety**
```typescript
// Service dependency injection type
interface Services {
  modelManager: IModelManager
  templateManager: ITemplateManager
  variableManager: IVariableManager
}

const services = inject<{ value: Services | null }>('services')
if (!services?.value) {
  throw new Error('Services not provided')
}
```

#### 3.6.2 ESLint Configuration Guide

**Basic ESLint configuration**
```json
{
  "root": true,
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "ecmaVersion": 2022,
    "sourceType": "module",
    "extraFileExtensions": [".vue"]
  },
  "plugins": ["@typescript-eslint", "vue"],
  "extends": [
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "vue/multi-word-component-names": "off",
    "vue/no-unused-vars": "error"
  }
}
```

**Vue file specific rules**
```json
{
  "rules": {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/prop-name-casing": ["error", "camelCase"],
    "vue/attribute-hyphenation": ["error", "always"],
    "vue/v-on-event-hyphenation": ["error", "always"],
    "vue/no-unused-components": "warn",
    "vue/require-default-prop": "off"
  }
}
```

#### 3.6.3 Development Environment Integration

**VS Code configuration (.vscode/settings.json)**
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ],
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false
}
```

### 3.7 Performance Optimization
- Dynamic imports
  - Use route-based lazy loading
  - Load components on demand
  - Import third-party libraries on demand
  - Code splitting

- Rendering optimization
  - Use virtual lists
  - Avoid unnecessary re-renders
  - Use computed properties for caching
  - Optimize large lists

### 3.8 Naive UI Usage Guide

#### 3.8.1 Component Library Features
- **Enterprise-level design**
  - Professional visual design language
  - Consistent interaction experience
  - Complete component ecosystem

- **TypeScript support**
  - Complete type definitions
  - Intelligent code completion
  - Type-safe property passing

- **Theme system**
  - Built-in multiple themes (light, dark, blue, green, purple)
  - Supports theme customization and dynamic switching
  - CSS variables support

#### 3.8.2 Configuration Guide

1. **Basic configuration**
   ```vue
   <template>
     <NConfigProvider :theme="naiveTheme" :theme-overrides="themeOverrides">
       <!-- Application content -->
     </NConfigProvider>
   </template>
   
   <script setup>
   import { useNaiveTheme } from '@prompt-optimizer/ui'
   
   const { naiveTheme, themeOverrides } = useNaiveTheme()
   </script>
   ```

2. **Theme configuration**
   ```typescript
   // config/naive-theme.ts
   export const themeConfig = {
     light: lightTheme,
     dark: darkTheme,
     blue: createCustomTheme(blueColors),
     green: createCustomTheme(greenColors),
     purple: createCustomTheme(purpleColors)
   }
   ```

3. **Component usage**
   ```vue
   <template>
     <NButton type="primary" @click="handleClick">
       Button
     </NButton>
     <NCard title="Card Title">
       <p>Card content</p>
     </NCard>
   </template>
   
   <script setup>
   import { NButton, NCard } from 'naive-ui'
   </script>
   ```

#### 3.8.3 Detailed Theme Configuration

The system provides 5 complete theme configurations, each with a full color system and component style customization:

**1. Light Mode (light)**
- Base theme: `lightTheme`
- Primary color: `#0ea5e9` (sky blue)
- Use case: Default for daytime use, clean and simple

**2. Dark Mode (dark)**
- Base theme: `darkTheme`
- Primary color: `#64748b` (slate gray)
- Use case: Low-light environments, eye-care mode

**3. Blue Mode (blue)**
- Base theme: `lightTheme` + custom background
- Primary color: `#0ea5e9` (sky blue)
- Feature: Blue-toned background colors (`#f0f9ff` for body, `#e0f2fe` for card)
- Use case: Professional, business style

**4. Green Mode (green)**
- Base theme: `darkTheme` + full green color scheme
- Primary color: `#14b8a6` (teal)
- Feature: Dark base with green theme (`#0f1e1a` for body, `#1a2e25` for card)
- Full configuration: Includes scrollbars, icons, borders, and all other UI elements

**5. Dark Purple Mode (purple)**
- Base theme: `darkTheme` + purple color scheme
- Primary color: `#a855f7` (purple)
- Feature: Dark base with purple theme (`#1a0f2e` for body, `#251a35` for card)
- Use case: Creative design, personalized interface

#### 3.8.4 Common Component Usage Patterns

**1. Form Components**
```vue
<template>
  <NForm ref="formRef" :model="formModel" :rules="formRules">
    <NFormItem label="Username" path="username">
      <NInput v-model:value="formModel.username" placeholder="Enter username" />
    </NFormItem>
    <NFormItem label="Model Selection" path="model">
      <NSelect 
        v-model:value="formModel.model" 
        :options="modelOptions"
        placeholder="Select a model"
      />
    </NFormItem>
    <NFormItem>
      <NButton type="primary" @click="handleSubmit">
        Submit
      </NButton>
    </NFormItem>
  </NForm>
</template>
```

**2. Layout Components**
```vue
<template>
  <!-- Flex layout - recommended for modern layouts -->
  <NFlex vertical :size="16">
    <NFlex justify="space-between" align="center">
      <NH3>Title</NH3>
      <NButton type="primary">Action</NButton>
    </NFlex>
    
    <!-- Card container -->
    <NCard title="Content Card" hoverable>
      <NFlex :size="12">
        <NTag type="info">Tag 1</NTag>
        <NTag type="success">Tag 2</NTag>
      </NFlex>
    </NCard>
  </NFlex>

  <!-- Traditional spacing layout -->
  <NSpace vertical :size="16">
    <NSpace justify="space-between" align="center">
      <NText strong>List Title</NText>
      <NButton quaternary>More</NButton>
    </NSpace>
  </NSpace>

  <!-- Grid layout -->
  <NGrid :cols="3" :x-gap="16" :y-gap="16">
    <NGridItem v-for="item in items" :key="item.id">
      <NCard>{{ item.content }}</NCard>
    </NGridItem>
  </NGrid>
</template>
```

**3. Feedback Components**
```vue
<script setup>
import { useMessage, useNotification } from 'naive-ui'

const message = useMessage()
const notification = useNotification()

const showToast = () => {
  message.success('Operation successful')
}

const showNotification = () => {
  notification.info({
    title: 'Notification Title',
    content: 'Notification content',
    duration: 3000
  })
}
</script>
```

**4. Variable Management Component Usage Pattern**
```vue
<script setup>
import { useVariableManager } from '@prompt-optimizer/ui'

const services = inject('services')
const {
  isReady,
  isAdvancedMode,
  customVariables,
  allVariables,
  setAdvancedMode,
  addVariable,
  updateVariable,
  deleteVariable,
  replaceVariables
} = useVariableManager(services, { autoSync: true })

// Use variable replacement
const processedContent = computed(() => {
  return replaceVariables(originalContent.value, allVariables.value)
})
</script>
```

#### 3.8.5 Best Practices

- **On-demand imports**: Only import the components you use to reduce bundle size
- **Theme consistency**: Use the theme system consistently, avoid hard-coding colors
- **Responsive design**: Prefer `NFlex` over `NSpace` for better responsive support
- **Type safety**: Fully leverage TypeScript type definitions
- **Component composition**: Use combinations of `NCard`, `NFlex`, and `NSpace` to create complex layouts
- **Theme switching**: Implement dynamic theme switching with the `switchTheme()` method

### 3.9 Testing Specifications
- Component testing
  - Test component rendering
  - Test user interactions
  - Test props and emits
  - Test boundary conditions

- Service testing
  - Mock external dependencies
  - Test asynchronous operations
  - Test error handling
  - Validate state changes

## 4. Application Flow

### 4.1 Core Service Initialization

1. **Core service loading order**
   - Import core services (modelManager, templateManager, historyManager)
   - Load model configurations
   - Load template configurations
   - Load history

2. **Service instance creation process**
   - Create LLM service instance
   - Create prompt service instance
   - Register event handlers
   - Initialize service state

### 4.2 Web Application Initialization

1. **Application configuration loading**
   - Load environment variables
   - Initialize theme settings
   - Configure Vue application

2. **Service state synchronization**
   - Initialize model state
   - Load template data
   - Synchronize history

### 4.3 Prompt Optimization Flow

1. **User input phase**
   - Input validation process
   - Error handling mechanism
   - Input sanitization and preprocessing

2. **Optimization processing phase**
   - Use native SDK to handle requests
   - Call LLM service for optimization
   - Handle streaming responses
   - Error handling and retries

3. **Result processing phase**
   - Update UI with streaming responses
   - Store results in history
   - Error recovery and fallback handling

### 4.4 Model Management Flow

1. **Model configuration management**
   - Model configuration updates: Users can update a model's name, base URL, API key, available model list, default model, and whether it's enabled.
   - **Advanced LLM Parameters (`llmParams`)**:
     - The `ModelConfig` interface includes an `llmParams?: Record<string, any>;` field.
     - This field allows users to provide a flexible key-value map for each model configuration to specify parameters specific to that LLM provider's SDK.
     - Users can add any parameters supported by their LLM's SDK.
     - **Examples**:
       - **OpenAI/OpenAI-compatible APIs (e.g., DeepSeek, Zhipu):**
         ```json
         "llmParams": {
           "temperature": 0.7,
           "max_tokens": 4096,
           "timeout": 60000, // Request timeout for the OpenAI client (in ms)
           "top_p": 0.9,
           "frequency_penalty": 0.5
           // ... other OpenAI-supported parameters
         }
         ```
       - **Gemini:**
         ```json
         "llmParams": {
           "temperature": 0.8,
           "maxOutputTokens": 2048, // Note: Gemini uses maxOutputTokens
           "topP": 0.95,
           "topK": 40
           // ... other Gemini-supported parameters
         }
         ```
     - **How `LLMService` handles `llmParams`**:
       - For OpenAI-compatible APIs, the `timeout` value, if provided, is used to configure the timeout setting of the OpenAI JavaScript SDK client instance. The remaining parameters (like `temperature`, `max_tokens`, `top_p`, etc.) are passed directly to the `chat.completions.create()` method.
       - For Gemini, parameters like `temperature`, `maxOutputTokens`, `topP`, `topK`, etc., are included in the `generationConfig` object passed to `model.startChat()`.
       - Parameters not explicitly handled by the service (i.e., not `timeout` for OpenAI, or not known Gemini parameters) are generally passed safely along in the request to the respective SDK, which will use them if they are supported.
   - Connection testing: Verifies that the API key and base URL are correct and that the model is available.
   - Configuration validation: Ensures all required fields are filled out and correctly formatted. The `llmParams` field, if provided, must be an object.
   - Error handling: Provides clear error messages for incorrect configurations or connection failures.

2. **API key management**
   - Key setting and encryption
   - Key validation
   - Secure storage
   - Error handling

### 4.5 Template Management Flow

1. **Template operation flow**
   - Save template
   - Validate template
   - Manage template categories
   - Error handling

2. **Template application flow**
   - Get template
   - Apply template
   - Validate data
   - Error handling

### 4.6 History Management

1. **Record saving flow**
   - Add record
   - Synchronize data
   - Auto-cleanup
   - Error handling

2. **Record operation flow**
   - Get records
   - Filter records
   - Delete records
   - Error handling

### 4.7 Error Handling Flow

1. **API error handling strategy**
   - Identify retryable errors
   - Exponential backoff retry mechanism
   - Error reporting
   - User notifications
   - Fallback handling

2. **Validation error handling**
   - Field validation
   - UI updates
   - Focus handling
   - Error messages

3. **Global error handling**
   - Error classification
   - Error recovery
   - Error reporting
   - User feedback

## 5. Code Review Checklist

### 5.1 General Review Items
- Code quality
  - [ ] Follows agreed-upon code style
  - [ ] No unused variables or imports
  - [ ] Appropriate comments and documentation
  - [ ] Avoids duplicate code
- Security
  - [ ] Input validation
  - [ ] Protection of sensitive information
  - [ ] Secure storage of API keys
  - [ ] Prevention of XSS attacks
- Performance
  - [ ] Avoids unnecessary computations
  - [ ] Performance handling for large datasets
  - [ ] Caching of computed results

### 5.2 Frontend Review Items
- Component design
  - [ ] Single responsibility for components
  - [ ] Clear definitions for props and events
  - [ ] Reasonable state management
  - [ ] Comprehensive error handling
- UI/UX
  - [ ] Responsive design
  - [ ] Accessibility support
  - [ ] Good error feedback
  - [ ] Handling of loading states

### 5.3 Core Package Review Items
- API design
  - [ ] Interface consistency
  - [ ] Standardized error handling
  - [ ] Complete type definitions
  - [ ] Documentation comments
- Service implementation
  - [ ] Single Responsibility Principle
  - [ ] Appropriate level of abstraction
  - [ ] Test coverage
  - [ ] Error recovery mechanisms

## 6. Development Environment Requirements

### 6.1 Development Environment
- Node.js >= 18.0.0
- pnpm >= 8.15.0
- VS Code
  - Volar 1.8.x
  - ESLint
  - Prettier
  - Cursor
  - GitLens
  - Tailwind CSS IntelliSense

### 6.2 Browser Support
- Chrome >= 90
- Firefox >= 90
- Safari >= 14
- Edge >= 90
- Mobile browsers
  - iOS Safari >= 14
  - Android Chrome >= 90

## Cross-Origin Proxy Solution

To address potential cross-origin issues when calling third-party LLM APIs in a pure frontend application, we have implemented a proxy solution based on the Vercel Edge Runtime.

### Proxy Architecture

1. **API Proxy**: For handling regular requests
   - Path: `/api/proxy`
   - Function: Forwards regular HTTP requests, handles CORS headers

2. **Streaming Proxy**: For handling streaming requests
   - Path: `/api/stream`
   - Function: Forwards streaming responses, keeps the connection open until the stream ends

### How It Works

1. In a production environment (not localhost), the system automatically detects if a proxy is needed
2. All API requests (including OpenAI) can use the proxy, controlled by the `useVercelProxy` option in the model configuration
3. The proxy preserves all original request headers and body
4. The proxy adds the necessary CORS headers to allow the browser to receive the response

### Code Implementation

The core proxy logic is located at:
- `/api/proxy.js`: Handles regular requests
- `/api/stream.js`: Handles streaming requests

The environment detection logic is located at:
- `packages/core/src/utils/environment.ts`

### How to Use

For developers, this feature is transparent and requires no extra configuration. The system automatically detects the Vercel environment and provides the proxy option in the model configuration.

In the model configuration interface, when a Vercel environment is detected, the "Use Vercel Proxy" option will be displayed. You can configure whether to enable the proxy feature for each model individually.


### Security Considerations

1. The proxy only forwards requests and does not store any data
2. API keys are still sent directly by the client and are not processed by an intermediate server
3. All requests are transmitted over HTTPS encryption

### Limitations

1. Vercel Edge Functions have a 30-second timeout limit
2. There are monthly bandwidth and request number limits
3. The first request may have a cold start delay

Last updated: 2025-01-15
