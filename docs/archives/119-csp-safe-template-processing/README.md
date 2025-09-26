# 119-CSP Security Template Processing 🔒

## 📋 Overview

**Issue**: The strict Content Security Policy (CSP) in the browser extension environment causes Handlebars template compilation to fail, resulting in an "unsafe-eval" error.

**Solution**: Implement a CSP-compatible template processor that uses simple variable replacement in the browser extension environment, while maintaining full Handlebars functionality in other environments.

**Scope of Impact**: 
- ✅ Fix: Browser extension template functionality works normally
- ✅ Maintain: Full functionality of Web and Desktop applications is unaffected
- ✅ Enhance: Environment detection is more accurate, avoiding false positives in Electron

## 🚨 Problem Background

### Error Phenomenon
```
OptimizationError: Optimization failed: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".
```

### Root Cause
1. **CSP Restriction**: A strict CSP policy is set in the browser extension manifest.json
2. **Dynamic Compilation**: `Handlebars.compile()` internally uses the `Function` constructor or `eval()`
3. **Environmental Differences**: Only the extension module is affected; web/desktop modules function normally

### Technical Details
- **Problem Location**: `packages/core/src/services/template/processor.ts:89`
- **CSP Configuration**: `packages/extension/public/manifest.json`
- **Affected Functionality**: Variable replacement functionality in advanced templates

## 🎯 Solution

### 1. CSP Safe Processor
Create the `CSPSafeTemplateProcessor` class to provide basic variable replacement functionality:

**Supported Features**:
- ✅ `{{variableName}}` - Basic variable replacement
- ✅ `{{ variableName }}` - Variable with spaces
- ✅ Predefined variables: `{{originalPrompt}}`, `{{lastOptimizedPrompt}}`, `{{iterateInput}}`
- ✅ Automatic support for newly added variables

**Unsupported Features**:
- ❌ `{{#if condition}}` - Conditional statements
- ❌ `{{#each items}}` - Loop statements
- ❌ `{{> partial}}` - Partial templates
- ❌ Other complex Handlebars features

### 2. Intelligent Environment Detection
Enhance the `isExtensionEnvironment()` function to accurately distinguish different runtime environments:

**Detection Logic**:
1. Exclude Node.js environments
2. Exclude Electron environments (multiple checks)
3. Validate Chrome extension API
4. Verify manifest validity

**Environment Support**:
- 🌐 **Regular Web**: Uses full Handlebars
- 🖥️ **Electron**: Uses full Handlebars  
- 🧩 **Browser Extension**: Uses CSP safe processor

### 3. Automatic Switching Mechanism
`TemplateProcessor` automatically selects the appropriate processor based on the environment, requiring no manual configuration.

## 📁 File Structure

```
packages/core/src/services/template/
├── processor.ts                    # Main template processor (modified)
├── csp-safe-processor.ts          # CSP safe processor (new)
└── minimal.ts                     # Handlebars export

packages/core/tests/unit/template/
├── csp-safe-processor.test.ts     # CSP processor tests (new)
└── extension-environment.test.ts   # Extension environment tests (new)

packages/core/docs/
└── csp-safe-template-processing.md # Technical documentation (new)
```

## 🧪 Test Coverage

### Test Types
- **Unit Tests**: CSP safe processor functionality tests
- **Environment Tests**: Behavior validation in different environments
- **Integration Tests**: Overall functionality tests of the template processor

### Test Results
- ✅ All tests passed (84 tests)
- ✅ Covers all environment detection scenarios
- ✅ Validates correct exclusion of Electron environment
- ✅ Validates correct identification of extension environment

## 🎉 Implementation Effects

### Functionality Restoration
- ✅ Browser extension can use template functionality normally
- ✅ System prompt optimization works correctly
- ✅ User prompt optimization works correctly
- ✅ Iterative optimization functionality works correctly

### Compatibility Assurance
- ✅ Web application functionality is completely unaffected
- ✅ Desktop application functionality is completely unaffected
- ✅ Existing templates are 100% backward compatible
- ✅ Automatic support for newly added variables

### Security Enhancement
- ✅ Complies with browser extension CSP requirements
- ✅ Does not compromise security on other platforms
- ✅ Environment detection is more accurate and reliable

## 📚 Related Documentation

- **Technical Documentation**: `packages/core/docs/csp-safe-template-processing.md`
- **Testing Documentation**: Detailed comments in test files
- **API Documentation**: JSDoc comments in the code

## 🔄 Follow-up Optimization Suggestions

### Short-term Optimizations
- Consider an explicit environment identification scheme to further improve detection accuracy
- Monitor the accuracy of environment detection in actual usage

### Long-term Planning
- If complex template functionality is needed, consider a pre-compilation scheme
- Assess whether more template functionalities should be provided for the extension environment

## 💡 Experience Summary

### Technical Experience
1. **Environment Detection**: Multi-layer detection mechanisms ensure accuracy, and exception handling guarantees stability
2. **Backward Compatibility**: Progressive enhancement strategy that does not affect existing functionality
3. **Test-Driven**: Complete test coverage ensures the reliability of the solution

### Architectural Experience
1. **Adapter Pattern**: Selects the appropriate processor based on the environment
2. **Minimal Impact Principle**: Simplified functionality is used only when necessary
3. **Scalability Design**: Zero-cost support for newly added variables

## 📝 Subsequent Updates (2025-08-29)

### Unified Migration of Template Technology

**Background**: To further simplify the architecture and provide unified CSP security guarantees, we have completed a comprehensive migration from Handlebars to Mustache.

**Major Changes**:
1. **Complete Removal of Handlebars Dependency**: All environments use Mustache.js as the template engine
2. **Decommissioning of CSPSafeTemplateProcessor**: No longer needed as an environment-specific processor; Mustache natively supports CSP security
3. **Unified Template Syntax**: All templates use standard Mustache syntax `{{#variable}}...{{/variable}}`
4. **Simplified Architecture**: Removed environment detection logic; all environments use the same processing flow

**Technical Advantages**:
- ✅ **Simpler Architecture**: Single template engine, no need for environment checks
- ✅ **Native CSP Security**: Mustache.js inherently supports CSP environments
- ✅ **Better Maintainability**: Unified template syntax and processing logic
- ✅ **Complete Compatibility**: Existing variable replacement functionality remains unchanged

**File Changes**:
```diff
- packages/core/src/services/template/csp-safe-processor.ts (deleted)
- packages/core/tests/unit/template/csp-safe-processor.test.ts (deleted)
+ All template processing now uses Mustache.render()
+ Dependency updated from handlebars to mustache
```

**Documentation Updates**:
- The "Handlebars Template Technology" in the syntax guide has been updated to "Mustache Template Technology"
- All user-facing documentation has been synchronized with the updates

This migration is a natural evolution of the CSP security processing solution, upgrading from "environment-specific compatibility solutions" to "unified native support solutions".

---

**🏷️ Tags**: CSP Security, Template Processing, Browser Extension, Environment Detection, Compatibility, Mustache Migration