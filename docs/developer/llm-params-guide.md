# LLM Advanced Parameter Configuration Guide

## Overview

The `llmParams` feature allows you to configure detailed parameters for each model to precisely control the behavior of the LLM. This system uses an **intelligent parameter classification** and **transparent transmission** mechanism to ensure the professionalism and reliability of parameter configuration.

## 🔧 Core Design Principles

### 1. Parameter Transparency (Updated 2024.12.20)
- **No default values**: The system will not automatically add any default values to avoid user misunderstanding
- **Direct transmission**: Whatever parameters the user configures are the parameters that are passed
- **SDK native**: Relies on the default behavior of each LLM service provider's SDK

### 2. Intelligent Parameter Classification
- **Filter by provider**: The UI automatically displays relevant parameters based on the model type
- **Avoid confusion**: OpenAI-type models only display OpenAI parameters, and Gemini models only display Gemini parameters
- **Parameter isolation**: Parameters from different providers do not interfere with each other

### 3. Scalability Guarantee
- **Custom parameters**: Supports any SDK-compatible custom parameters
- **Future compatibility**: New parameters can be used without modifying the core code
- **Type preservation**: Preserves the original type and structure of the parameters

## 🚀 Parameter Effectiveness Mechanism

### OpenAI Compatible Providers (OpenAI, DeepSeek, Zhipu, SiliconFlow, Custom)

#### Parameter Transmission Process
```typescript
// 1. Separate special parameters
const {
  timeout,           // Client configuration parameter
  model,            // Avoid overwriting the main model configuration
  messages,         // Avoid overwriting the main messages
  ...restLlmParams  // All other parameters
} = modelConfig.llmParams || {};

// 2. Create a client instance
const openai = new OpenAI({
  apiKey,
  baseURL,
  timeout: timeout || (isStream ? 90000 : 60000),  // Only timeout has special handling
  maxRetries: isStream ? 2 : 3
});

// 3. Build the API request - no default value settings
const completionConfig = {
  model: modelConfig.defaultModel,
  messages: formattedMessages,
  ...restLlmParams  // Directly pass all other parameters
};

// 4. Send the request
const response = await openai.chat.completions.create(completionConfig);
```

#### Supported Parameters

| Parameter Name | Type | Range | Description |
|---|---|---|---|
| `timeout` | integer | ≥1000 | Request timeout (milliseconds) - client configuration |
| `temperature` | number | 0.0-2.0 | Controls the randomness of the output |
| `max_tokens` | integer | ≥1 | Maximum number of tokens to generate |
| `top_p` | number | 0.0-1.0 | Nucleus sampling parameter |
| `presence_penalty` | number | -2.0-2.0 | Presence penalty |
| `frequency_penalty` | number | -2.0-2.0 | Frequency penalty |
| `stop` | array | - | Stop sequence |
| `seed` | integer | - | Random seed |
| `stream` | boolean | - | Streaming output (handled by the system automatically) |

### Gemini Provider

#### Parameter Transmission Process
```typescript
// 1. Separate known and unknown parameters
const {
  temperature,
  maxOutputTokens,
  topP,
  topK,
  candidateCount,
  stopSequences,
  ...otherSafeParams  // Unknown parameters will also be passed
} = modelConfig.llmParams || {};

// 2. Build the generation configuration - no default value settings
const generationConfig = { ...otherSafeParams };

// 3. Only add parameters explicitly configured by the user
if (temperature !== undefined) {
  generationConfig.temperature = temperature;
}
if (maxOutputTokens !== undefined) {
  generationConfig.maxOutputTokens = maxOutputTokens;
}
// ... other parameters are handled similarly

// 4. Create a chat session
const chat = model.startChat({
  history: formatHistory(messages),
  ...(Object.keys(generationConfig).length > 0 && { generationConfig })
});
```

#### Supported Parameters

| Parameter Name | Type | Range | Description |
|---|---|---|---|
| `temperature` | number | 0.0-2.0 | Controls the randomness of the output |
| `maxOutputTokens` | integer | ≥1 | Maximum number of output tokens |
| `topP` | number | 0.0-1.0 | Nucleus sampling parameter |
| `topK` | integer | ≥1 | Top-K sampling |
| `candidateCount` | integer | 1-8 | Number of candidate responses |
| `stopSequences` | array | - | Array of stop sequences |

## 🎯 UI Intelligent Parameter Management

### Automatic Parameter Type Recognition
The system automatically displays relevant parameters based on the model's `provider` field:

```typescript
// Filter parameter definitions based on the provider
const availableParams = advancedParameterDefinitions.filter(def => 
  def.appliesToProviders.includes(currentProvider) &&
  !Object.keys(currentParams).includes(def.name)
);
```

### Provider Mapping Relationship
```typescript
const providerMapping = {
  // OpenAI compatible types
  'openai': ['temperature', 'top_p', 'max_tokens', 'presence_penalty', 'frequency_penalty', 'timeout'],
  'deepseek': ['temperature', 'top_p', 'max_tokens', 'presence_penalty', 'frequency_penalty', 'timeout'],
  'zhipu': ['temperature', 'top_p', 'max_tokens', 'presence_penalty', 'frequency_penalty', 'timeout'],
  'siliconflow': ['temperature', 'top_p', 'max_tokens', 'presence_penalty', 'frequency_penalty', 'timeout'],
  'custom': ['temperature', 'top_p', 'max_tokens', 'presence_penalty', 'frequency_penalty', 'timeout'],
  
  // Gemini type
  'gemini': ['temperature', 'topP', 'maxOutputTokens', 'topK', 'candidateCount', 'stopSequences']
};
```

### UI Display Enhancement
- Displays the current provider type
- Displays the number of optional parameters
- Colored status indicators
- Automatically filters configured parameters

## 📋 Configuration Examples

### OpenAI Model Configuration
```json
{
  "name": "OpenAI GPT-4",
  "provider": "openai",
  "llmParams": {
    "temperature": 0.3,      // Low randomness, more deterministic output
    "max_tokens": 4096,      // Limit the output length
    "top_p": 0.8,           // Nucleus sampling
    "presence_penalty": 0.1, // Encourage new topics
    "timeout": 90000         // 90 second timeout
  }
}
```

### DeepSeek Model Configuration
```json
{
  "name": "DeepSeek Coder V3",
  "provider": "deepseek", 
  "llmParams": {
    "temperature": 0.1,      // Code generation requires low randomness
    "max_tokens": 8192,      // Longer code output
    "top_p": 0.95,          // Balance diversity and quality
    "timeout": 120000        // Code generation may take longer
  }
}
```

### Gemini Model Configuration
```json
{
  "name": "Gemini Pro",
  "provider": "gemini",
  "llmParams": {
    "temperature": 0.8,      // High randomness for creative tasks
    "maxOutputTokens": 2048, // Moderate output length
    "topP": 0.95,           // Nucleus sampling
    "topK": 40,             // Top-K sampling
    "candidateCount": 1,     // Single response
    "stopSequences": ["END", "STOP"] // Custom stop words
  }
}
```

### Custom Model Configuration
```json
{
  "name": "Custom LLaMA",
  "provider": "custom",
  "llmParams": {
    "temperature": 0.7,
    "max_tokens": 4096,
    
    // Custom parameter examples
    "repetition_penalty": 1.1,
    "do_sample": true,
    "pad_token_id": 0,
    "eos_token_id": 2
  }
}
```

## 🔍 Validation and Debugging

### Parameter Validation API
```typescript
import { validateLLMParams } from '@prompt-optimizer/core';

const validation = validateLLMParams(llmParams, provider);

if (!validation.isValid) {
  console.error('Parameter validation failed:', validation.errors);
  validation.errors.forEach(error => {
    console.error(`- ${error.parameterName}: ${error.message}`);
  });
}

if (validation.warnings.length > 0) {
  console.warn('Parameter warnings:', validation.warnings);
  validation.warnings.forEach(warning => {
    console.warn(`- ${warning.parameterName}: ${warning.message}`);
  });
}
```

### Test Each Parameter
The system provides independent test cases for each parameter:

```typescript
// Test the temperature parameter
await testParameter('temperature', 0.3, provider);

// Test the max_tokens parameter
await testParameter('max_tokens', 100, provider);

// Test combined parameters
await testParameters({
  temperature: 0.6,
  max_tokens: 150,
  top_p: 0.9
}, provider);
```

## ⚡ Best Practices

### 1. Parameter Selection Strategy
```typescript
// Code generation task
const codingParams = {
  temperature: 0.1,      // Low randomness
  max_tokens: 8192,      // Long output
  top_p: 0.95           // High-quality sampling
};

// Creative writing task
const creativeParams = {
  temperature: 0.8,      // High randomness
  max_tokens: 2048,      // Moderate output
  top_p: 0.9,           // Balanced sampling
  presence_penalty: 0.3  // Encourage new ideas
};

// Q&A task
const qaParams = {
  temperature: 0.3,      // Medium randomness
  max_tokens: 1024,      // Concise answer
  frequency_penalty: 0.1 // Avoid repetition
};
```

### 2. Progressive Tuning
```typescript
// Step 1: Basic configuration
let params = {
  temperature: 0.7
};

// Step 2: Add output control
params = {
  ...params,
  max_tokens: 2048,
  top_p: 0.9
};

// Step 3: Fine-tuning
params = {
  ...params,
  presence_penalty: 0.1,
  frequency_penalty: 0.1
};
```

### 3. Performance Optimization
```typescript
// Fast response scenario
const fastParams = {
  max_tokens: 512,       // Limit the output length
  timeout: 30000         // Shorter timeout
};

// High-quality scenario
const qualityParams = {
  temperature: 0.2,      // Low randomness
  top_p: 0.8,           // Precise sampling
  timeout: 120000        // Longer timeout
};
```

## 🛠️ Troubleshooting

### Common Problem Diagnosis

1. **Parameters not taking effect**
   ```typescript
   // Check if the parameter name is correct
   console.log('Supported parameters:', advancedParameterDefinitions
     .filter(def => def.appliesToProviders.includes(provider))
     .map(def => def.name));
   ```

2. **Type error**
   ```typescript
   // Make sure the parameter type is correct
   const temperature = parseFloat(userInput); // Make sure it's a number
   const maxTokens = parseInt(userInput, 10);  // Make sure it's an integer
   ```

3. **Range error**
   ```typescript
   // Check the parameter range
   if (temperature < 0 || temperature > 2) {
     throw new Error('temperature must be between 0 and 2');
   }
   ```

### Debugging Tools

1. **Enable detailed logging**
   ```typescript
   // Enable debugging in modelManager
   const debugMode = process.env.NODE_ENV === 'development';
   if (debugMode) {
     console.log('LLM parameter configuration:', llmParams);
     console.log('Current provider:', provider);
   }
   ```

2. **Parameter transmission tracking**
   ```typescript
   // View the actual parameters passed
   console.log('Parameters passed to the SDK:', {
     ...completionConfig,
     provider,
     timestamp: new Date().toISOString()
   });
   ```

## 📝 Update Log

### 2024.12.20 - Parameter Transparency Update
- ✅ Removed all automatically set default values
- ✅ Improved automatic parameter type filtering
- ✅ Optimized UI display and labels
- ✅ Enhanced test coverage
- ✅ Added parameter combination testing
- ✅ Improved troubleshooting guide

### Core Improvements
- **Transparency principle**: Only pass parameters explicitly configured by the user
- **Intelligent classification**: Automatically display relevant parameters based on the provider
- **UI optimization**: Removed redundant provider identifiers from labels
- **Test improvement**: Added independent test cases for each parameter
