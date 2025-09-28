# Test Area Component Style Guidelines

This document defines the unified style guidelines for the refactored Test Area components, ensuring visual consistency with the Naive UI design system and the left optimization area.

## Basic Style Principles

### 1. Spacing System

- **Primary Spacing**: `NSpace vertical :size="16"` - Used for the main separation between components
- **Secondary Spacing**: `NSpace vertical :size="8"` - Used for separation between internal elements of components  
- **Tight Spacing**: `NFlex :size="12"` - Used for button groups or related controls
- **Minimum Spacing**: `NFlex :size="8"` - Used for densely packed elements

### 2. Typography

```vue
<!-- Main Title (18px, Depth 1) -->
<NText :depth="1" style="font-size: 18px; font-weight: 500;">Main Title</NText>

<!-- Subtitle/Label (14px, Depth 2) -->
<NText :depth="2" style="font-size: 14px; font-weight: 500;">Label Text</NText>

<!-- Help Text (12px, Depth 3) -->
<NText :depth="3" style="font-size: 12px;">Help Description</NText>

<!-- Card Title (16px, Bold) -->
<NText style="font-size: 16px; font-weight: 600;">Card Title</NText>
```

### 3. Layout System

#### NFlex Layout
```vue
<!-- Horizontal Layout -->
<NFlex justify="space-between" align="center" :wrap="false">

<!-- Vertical Layout -->
<NFlex vertical :style="{ height: '100%' }">

<!-- Button Group Layout -->
<NFlex align="center" :size="8">
```

#### NGrid Responsive Layout
```vue
<NGrid :cols="24" :x-gap="12" responsive="screen">
  <NGridItem :span="8" :xs="24" :sm="8">
    <!-- Content -->
  </NGridItem>
</NGrid>
```

### 4. Height Management

```vue
<!-- Fixed Height Container -->
:style="{ height: '100%' }"

<!-- Flex Shrink Control -->
:style="{ flexShrink: 0 }"

<!-- Fill Remaining Space -->
:style="{ flex: 1, minHeight: 0 }"
```

## Component Specific Guidelines

### TestInputSection
- Use `NSpace vertical :size="8"` as the main container
- Title uses `depth="2"`, `14px`, `font-weight: 500`
- Help text uses `depth="3"`, `12px`
- Full-screen button style: `type="tertiary"`, `size="small"`, `ghost`, `round`

### TestControlBar  
- Based on `NGrid :cols="24" :x-gap="12"` responsive layout
- Label text follows subtitle guidelines
- Button spacing uses `:size="8"`
- Primary button `type="primary"`, secondary button `type="default"`

### ConversationSection
- Use `NCard size="small"` as the container
- Collapsible state managed by `NCollapse`
- Maximum height configured via props, avoiding hard coding

### TestResultSection
- Comparison mode uses `NFlex` horizontal layout, spacing `gap: 12px`
- Card title uses `16px`, `font-weight: 600`
- Single mode occupies full container height

### TestAreaPanel
- Root container uses `NFlex vertical`
- Margins uniformly use `marginBottom: '16px'`
- Avoid all Tailwind CSS classes, pure Naive UI implementation

## Forbidden Practices

### ❌ Hard-coded Pixel Values
```vue
<!-- Incorrect -->
<div style="height: 200px; margin-bottom: 20px;">

<!-- Correct -->
<div :style="{ marginBottom: '16px' }">
```

### ❌ Tailwind CSS Classes
```vue
<!-- Incorrect -->
<div class="flex flex-col h-full mb-4">

<!-- Correct -->
<NFlex vertical :style="{ height: '100%', marginBottom: '16px' }">
```

### ❌ Native HTML Element Layout
```vue
<!-- Incorrect -->
<div class="grid grid-cols-2 gap-4">

<!-- Correct -->
<NGrid :cols="2" :x-gap="16">
```

## Responsive Breakpoints

Follow the Naive UI responsive system:
- `xs`: < 576px (Mobile)
- `sm`: 576px (Small Screen)  
- `md`: 768px (Tablet)
- `lg`: 992px (Desktop)
- `xl`: 1200px (Large Screen)
- `xxl`: 1600px (Extra Large Screen)

## Theme Compatibility

All components must be compatible with:
- Light theme / Dark theme
- Naive UI theme variable system
- Dynamic theme switching

## Validation Checklist

Component style validation checklist:
- [ ] No hard-coded pixel values
- [ ] No Tailwind CSS classes
- [ ] Use Naive UI spacing system
- [ ] Text styles conform to guidelines
- [ ] Responsive layout is correct
- [ ] Theme compatibility tests passed
- [ ] Visual consistency with the left optimization area