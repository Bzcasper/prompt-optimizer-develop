# Theme System Development Experience

## 📋 Overview

Core experiences from the development process of multi-theme functionality, focusing on handling conflicts with third-party library styles and best practices for theme systems.

## 🎨 UI Theme System and Handling Conflicts with Third-Party Library Styles

### Problem Scenario
During the development of multi-theme functionality (especially custom dark themes like purple and green), it was found that the Markdown rendering component integrated with the Tailwind Typography (`prose`) plugin could not correctly apply theme colors for background and text, instead being overridden by discordant light styles (such as a white background).

### Root Cause Analysis

The core issue lies in the project's custom color theme system based on the `data-theme` attribute, which directly conflicts with the preset color scheme of the Tailwind Typography (`prose`) plugin.

1. **Strong Assertions of `prose`**: The `@tailwindcss/typography` plugin is not just a layout tool; it injects a complete visual scheme into HTML content, which **includes fixed colors, fonts, backgrounds, and other styles**.

2. **Default Light Color Preference**: The default configuration of `prose` (such as `prose-stone`) is designed for light backgrounds, enforcing a dark text color.

3. **Limitations of `dark:` Mode**: The color inversion mechanism of `prose` (`dark:prose-invert`) heavily relies on the `dark` class on the `<html>` tag. Our custom dark themes (like `data-theme="purple"`) are visually dark but do not trigger Tailwind's `dark` mode, so `prose` continues to apply its default light styles, leading to color overrides.

### Solutions and Best Practices

When facing a third-party library with strong style assertions, a **complete isolation** strategy must be adopted, avoiding attempts to "mix" usage.

#### 1. Prohibit Partial Application
It has been proven that trying to "borrow" `prose` layout functionality through `@apply prose-sm` does not work. This still introduces unwanted color styles, leading to unpredictable overriding issues.

#### 2. Manually Rebuild Layout
The most robust solution is to **completely remove** `@apply prose` or any of its variants in components where custom themes are to be applied. Then, refer to the `prose` documentation or default styles to **manually add pure layout and spacing styles for each Markdown element (`h1`, `p`, `ul`, etc.) without colors**.

#### 3. Return Control
By manually rebuilding the layout, we regain full control over the styles within our theme system. This way, the colors, backgrounds, borders, and other styles defined for elements under various themes can be applied correctly and without interference.

### Example - Manually Rebuilt Markdown Layout

```css
/* Defined in global theme.css, not belonging to any specific theme */
.theme-markdown-content {
  @apply max-w-none;
}

.theme-markdown-content > :first-child { @apply mt-0; }
.theme-markdown-content > :last-child { @apply mb-0; }
.theme-markdown-content h1 { @apply text-2xl font-bold my-4; }
.theme-markdown-content h2 { @apply text-xl font-semibold my-3; }
.theme-markdown-content p { @apply my-3 leading-relaxed; }
.theme-markdown-content ul,
.theme-markdown-content ol { @apply my-3 pl-6 space-y-2; }
.theme-markdown-content pre { @apply my-4 p-4 rounded-lg text-sm; }
/* ... etc ... */
```

In this way, we retain beautiful typography while ensuring that the colors of the custom theme can be rendered correctly.

## 🎯 Theme System Design Principles

### 1. Theme System Based on CSS Variables
```css
/* Theme definitions */
[data-theme="purple"] {
  --theme-bg: #1a1625;
  --theme-text: #e2e8f0;
  --theme-primary: #8b5cf6;
  /* ... */
}

[data-theme="green"] {
  --theme-bg: #0f1419;
  --theme-text: #e2e8f0;
  --theme-primary: #10b981;
  /* ... */
}
```

### 2. Semantic CSS Classes
```css
/* Use semantic class names instead of directly using color values */
.theme-bg { background-color: var(--theme-bg); }
.theme-text { color: var(--theme-text); }
.theme-primary { color: var(--theme-primary); }
```

### 3. Third-Party Library Isolation Strategy
- **Complete Isolation**: Completely avoid using libraries with strong style assertions.
- **Manual Rebuilding**: Refer to the layout of third-party libraries and manually implement styles.
- **Retain Control**: Ensure that the theme system has final control over styles.

## 🔧 Implementation Experience

### Success Cases
1. **Markdown Rendering**: Completely removed the `prose` plugin and manually implemented layout styles.
2. **Code Highlighting**: Used a syntax highlighting library that supports theme switching.
3. **Icon System**: Used SVG icons, controlling colors through CSS variables.

### Traps to Avoid
1. **Partial Application of Third-Party Styles**: Attempting to use only layout while ignoring colors.
2. **Reliance on `dark:` Mode**: Custom themes should not depend on Tailwind's dark mode.
3. **Style Priority Conflicts**: Ensure that theme styles have sufficient priority.

## 💡 Core Experience Summary

1. **Complete Isolation Principle**: For third-party libraries with strong style assertions, a complete isolation strategy must be adopted.
2. **Return Control**: Regain full control over styles by manually rebuilding.
3. **Semantic Design**: Use semantic CSS classes and variables to improve maintainability.
4. **Testing Coverage**: Each theme needs comprehensive testing to ensure styles are applied correctly.
5. **Documentation**: Thoroughly document handling strategies for third-party libraries to avoid repeating mistakes.

## 🔗 Related Documents

- [Overview of Theme System](./README.md)
- [Third-Party Library Conflict Handling Guide](./third-party-conflicts.md)
- [Theme Development Guidelines](./development-guide.md)

---

**Document Type**: Experience Summary  
**Applicable Scope**: Theme System Development  
**Last Updated**: 2025-07-01