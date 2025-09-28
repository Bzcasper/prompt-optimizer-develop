# MCP Server Template Parameter Improvement

## Problem Description

The `template` parameter in the MCP server's tool parameters was originally an optional string type, and users did not know what values could be filled in, nor was there a default value. This led to a poor user experience because:

1. Users did not know what template options were available.
2. Without a default value, users had to guess or refer to the documentation.
3. It was easy to input an incorrect template ID, leading to errors.

## Solution

Change the `template` parameter to an enumeration type and provide default values:

### 1. New Template Options Retrieval Function

Added the `getTemplateOptions` function in `packages/mcp-server/src/config/templates.ts`:

```typescript
export async function getTemplateOptions(
  templateManager: TemplateManager, 
  templateType: 'optimize' | 'userOptimize' | 'iterate'
): Promise<Array<{value: string, label: string, description?: string}>>
```

This function:
- Retrieves all available templates based on the template type.
- Returns a formatted array of options, including value, label, and description.
- Ensures the default template is always included in the options list.
- Provides error handling and fallback mechanisms.

### 2. Modify Tool Definitions

Modified the `inputSchema` of three tools in `packages/mcp-server/src/index.ts`:

#### optimize-user-prompt
```json
{
  "template": {
    "type": "string",
    "description": "Select an optimization template. Different templates have different optimization strategies and styles.",
    "enum": ["user-prompt-professional", "user-prompt-basic", "user-prompt-planning"],
    "default": "user-prompt-basic"
  }
}
```

#### optimize-system-prompt
```json
{
  "template": {
    "type": "string",
    "description": "Select an optimization template. Different templates have different optimization strategies and styles.",
    "enum": ["general-optimize", "output-format-optimize", "analytical-optimize"],
    "default": "general-optimize"
  }
}
```

#### iterate-prompt
```json
{
  "template": {
    "type": "string",
    "description": "Select an iterative optimization template. Different templates have different iterative strategies.",
    "enum": ["iterate"],
    "default": "iterate"
  }
}
```

### 3. Add CoreServicesManager Method

Added the `getTemplateManager()` method in `packages/mcp-server/src/adapters/core-services.ts` to retrieve the template manager instance.

## Improvement Effects

1. **User-Friendly**: Users can now see all available template options without guessing.
2. **Default Values**: Each tool has a reasonable default template that users can use directly.
3. **Type Safety**: The enumeration type prevents users from entering invalid template IDs.
4. **Clear Descriptions**: Each parameter has a detailed description explaining its purpose.
5. **Dynamic Retrieval**: Template options are dynamically retrieved, supporting the future addition of new templates.

## Testing Verification

Tests confirmed that:
- The MCP server can start normally.
- All tools are correctly registered.
- The template parameter contains the correct enumeration values and default values.
- Different types of templates are correctly categorized and mapped.

## Technical Details

- Used template type mapping to handle type differences between the Core module and the MCP server.
- Implemented error handling and fallback mechanisms to ensure basic functionality even if template loading fails.
- Filtered out MCP server-specific `-default` suffix templates, displaying only the actual built-in templates.
- Modified the default template ID mapping to use built-in templates instead of the simplified templates of the MCP server.
- Maintained backward compatibility; existing template IDs are still valid.

## Final Result

The fixed template options:

- **User Optimization**: `user-prompt-professional`, `user-prompt-basic`, `user-prompt-planning` (Default: `user-prompt-basic`)
- **System Optimization**: `general-optimize`, `output-format-optimize`, `analytical-optimize` (Default: `general-optimize`)
- **Iterative Optimization**: `iterate` (Default: `iterate`)

All template IDs are real built-in templates, and users can use them with confidence.