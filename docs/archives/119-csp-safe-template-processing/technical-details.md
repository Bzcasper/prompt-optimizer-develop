# CSP-Safe Template Processing

## Problem Background

There are strict Content Security Policy (CSP) restrictions in the browser extension environment that prohibit the use of `unsafe-eval`. This prevents Handlebars.compile() from functioning properly in browser extensions, as it internally uses the `Function` constructor or `eval()` to dynamically compile templates.

## Error Message

```
OptimizationError: Optimization failed: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".
```

## Solution

We have implemented a CSP-compatible template processor specifically for the browser extension environment:

### 1. CSPSafeTemplateProcessor

Location: `packages/core/src/services/template/csp-safe-processor.ts`

**Features:**
- Supports basic `{{variable}}` variable replacement
- Does not use `eval()` or the `Function` constructor
- Automatically detects the browser extension environment
- Provides warnings for unsupported Handlebars features

**Supported Syntax:**
- ✅ `{{variableName}}` - Basic variable replacement
- ✅ `{{ variableName }}` - Variable with spaces
- ✅ Predefined variables: `{{originalPrompt}}`, `{{lastOptimizedPrompt}}`, `{{iterateInput}}`

**Unsupported Syntax:**
- ❌ `{{#if condition}}` - Conditional statements
- ❌ `{{#each items}}` - Loop statements
- ❌ `{{#unless condition}}` - Negation condition
- ❌ `{{> partial}}` - Partial templates
- ❌ `{{{unescaped}}}` - Unescaped output

### 2. Automatic Environment Detection

`TemplateProcessor` will automatically detect the running environment:

```typescript
// Detect if in a browser extension environment
if (CSPSafeTemplateProcessor.isExtensionEnvironment()) {
  // Use CSP-safe processor
  return CSPSafeTemplateProcessor.processContent(msg.content, context);
} else {
  // Use full Handlebars functionality
  return Handlebars.compile(msg.content, { noEscape: true })(context);
}
```

### 3. Environment Detection Logic

```typescript
static isExtensionEnvironment(): boolean {
  try {
    return typeof chrome !== 'undefined' && 
           typeof chrome.runtime !== 'undefined' && 
           typeof chrome.runtime.getManifest === 'function';
  } catch (error) {
    return false;
  }
}
```

## Usage Example

### Basic Variable Replacement

```typescript
const content = 'Hello {{name}}, you are {{age}} years old.';
const context = { name: 'Alice', age: '25' };
const result = CSPSafeTemplateProcessor.processContent(content, context);
// Result: "Hello Alice, you are 25 years old."
```

### Predefined Template Variables

```typescript
const content = 'Original: {{originalPrompt}}, Input: {{iterateInput}}';
const context = {
  originalPrompt: 'Write a story',
  iterateInput: 'Make it more dramatic'
};
const result = CSPSafeTemplateProcessor.processContent(content, context);
// Result: "Original: Write a story, Input: Make it more dramatic"
```

## Compatibility

| Environment     | Template Engine                | Feature Support        |
|------------------|-------------------------------|-------------------------|
| Browser Extension | CSPSafeTemplateProcessor       | Basic variable replacement |
| Web Application   | Handlebars                    | Full functionality      |
| Desktop Application| Handlebars                   | Full functionality      |

## Testing

Related test files:
- `packages/core/tests/unit/template/csp-safe-processor.test.ts`
- `packages/core/tests/unit/template/extension-environment.test.ts`

Run tests:
```bash
cd packages/core
npm test -- csp-safe-processor.test.ts
npm test -- extension-environment.test.ts
```

## Notes

1. **Feature Limitations**: In the browser extension environment, only basic variable replacement is supported; complex Handlebars features are not supported.
2. **Backward Compatibility**: Other environments still use the full Handlebars functionality.
3. **Warning Messages**: Warnings will be displayed in the console when templates contain unsupported features.
4. **Variable Handling**: Undefined variables will be replaced with an empty string.

## Related Files

- `packages/core/src/services/template/csp-safe-processor.ts` - CSP-safe processor
- `packages/core/src/services/template/processor.ts` - Main template processor (modified)
- `packages/extension/public/manifest.json` - Extension manifest file (CSP configuration)

## 🔄 Technical Migration Update (2025-08-29)

### Unified Migration from Handlebars to Mustache

**Problem Evolution**: The original environment-specific solution addressed the CSP issue but maintained two different template processing logics, increasing system complexity.

**Final Solution**: 
1. **Unified Use of Mustache.js**: All environments will use the same template engine, Mustache, which natively supports CSP environments.
2. **Removal of Environment Detection**: The `isExtensionEnvironment()` detection logic is no longer needed.
3. **Simplification of Processor**: The `CSPSafeTemplateProcessor` is deprecated, and `Mustache.render()` is used uniformly.

**Technical Advantages**:
- ✅ **Architecture Unification**: A single code path eliminates environmental differences.
- ✅ **Maintenance Simplification**: No need to maintain two sets of template processing logic.
- ✅ **Native CSP Support**: Mustache inherently does not use eval, avoiding CSP compatibility issues.
- ✅ **Consistent Functionality**: All environments enjoy the same template features.

**Implementation Comparison**:
```typescript
// Old solution: environment check
if (CSPSafeTemplateProcessor.isExtensionEnvironment()) {
  return CSPSafeTemplateProcessor.processContent(msg.content, context);
} else {
  return Handlebars.compile(msg.content, { noEscape: true })(context);
}

// New solution: unified processing
return Mustache.render(msg.content, context);
```

**Migration Results**:
- 📁 Deleted files: `csp-safe-processor.ts`, `csp-safe-processor.test.ts`
- 📝 Updated dependencies: `handlebars` → `mustache`
- 🔧 Simplified processing: Removed all environment detection logic
- 📖 Documentation updated: User documentation synchronized with template technology description

This migration upgrades CSP-safe processing from a "compatibility solution" to a "native support solution," marking an important milestone in architectural simplification.