# OutputDisplay V2 Design Document

## 1. Core Design Philosophy

The core goal of version V2 is to address the issues of confusing layout and unclear scope of functional controls present in version V1. The new design adheres to the following core principles:

-   **Control Grouping**: Controls that are functionally similar or have the same scope should be visually grouped together.
-   **Scope Association**: The layout position of controls should intuitively reflect the UI area they control.
-   **High Visibility**: Frequently used functions should always be visible and easily accessible, avoiding unnecessary hover actions.

## 2. Final Layout Plan (V3)

After multiple rounds of discussion, the V3 plan has been finalized, which centers on creating a unified, always-visible top-level toolbar and achieving logical separation and visual harmony through internal grouping.

### 2.1 Visual Layout

```
+----------------------------------------------------------------------+
| [Render|Source|Diff] (fixed left)                  [Copy][Fullscreen*] (fixed right)   |  <-- Unified Top-Level Toolbar (Always Visible)
+----------------------------------------------------------------------+
|                                                                      |
| [Reasoning Process]..........................................[Expand/Collapse] (fixed) |  <-- Reasoning Process Panel
+----------------------------------------------------------------------+
|                      (Reasoning Process Content Area, optional, collapsible)                    |
|                      (can include its own copy button)                          |
+----------------------------------------------------------------------+
|                                                                      |
|                      (Main Content Area)                                    |
|                                                                      |
+----------------------------------------------------------------------+

* The fullscreen button is hidden in fullscreen view
```

### 2.2 Control Details

#### 2.2.1 Top-Level Toolbar

-   **Position and Visibility**: Fixed at the very top of the component, always visible.
-   **Function**: Serves as a unified entry point for all major operations.
-   **Internal Grouping**:
    -   **Left Group (View Control)**:
        -   **Members**: `Render`, `Source`, `Diff` button group.
        -   **Function**: Controls the presentation of the "Main Content Area" below.
    -   **Right Group (Action Execution)**:
        -   **Members**: `Copy`, `Fullscreen` buttons.
        -   **Function**: Executes single actions on content or components. The `Copy` button acts on the "Main Content," while the `Fullscreen` button acts on the entire component.
        -   **Special Rule**: The `Fullscreen` button should be hidden when the component is already in fullscreen mode. This logic is encapsulated within the `OutputDisplayFullscreen.vue` component. It automatically filters out the `'fullscreen'` option from the `enabledActions` passed in by the parent component, ensuring the consistency of component behavior.

#### 2.2.2 Reasoning Process Panel

-   **Position**: Located below the top-level toolbar and above the main content area.
-   **Structure**: A self-contained module with an independent title bar and content area.
-   **Controls**:
    -   **Expand/Collapse**: Located on the right side of the title bar, controls the visibility of the content area. The entire title bar is clickable to trigger this.
    -   **Copy Reasoning Process**: To ensure clarity of scope, this button can be placed inside the content area (e.g., bottom right corner) and is only visible when the content area is expanded.

## 3. Component Interface Design (`OutputDisplayCore`)

The external interface (Props & Events) of version V2 maintains high compatibility with version V1, with core changes reflected in internal implementation and user experience.

### Props Attributes

```typescript
type ActionName = 'fullscreen' | 'diff' | 'copy' | 'edit' | 'reasoning';

interface OutputDisplayCoreProps {
  // ... other props remain unchanged ...
  content?: string;
  originalContent?: string; // Still a prerequisite for activating the "Diff Mode" button
  reasoning?: string;
  mode: 'readonly' | 'editable'; // Defines the "capability" of the component, determining if it is editable in source mode
  enabledActions?: ActionName[]; // Still used to control toolbar functionality
  // ...
}
```

## 4. Data Flow and State Management (Draft Content Handling)

A common question is: how is the content edited by users in source mode (considered as "draft") managed?

**Core Principle**: `OutputDisplay` is a purely **Controlled Component**. It does not hold any temporary "draft" state. Its responsibility is to faithfully present the data passed in by the parent component through `props` and notify the parent component of user input behaviors through `events`.

This pattern follows the **Single Source of Truth** architectural principle, ensuring the predictability and consistency of data flow.

### Data Flow Loop

```mermaid
graph TD
    subgraph Parent Component (e.g., PromptPanel)
        A(State: optimizedPrompt)
    end

    subgraph OutputDisplay
        B(Textarea)
    end

    A -- "1. State Dispatch (Props)" --> B;
    B -- "2. User Input Triggers @input Event" --> C{emit('update:content', ...)}
    C -- "3. Change Request (Events)" --> A;
    A -- "4. View Auto Sync (Re-render)" --> B;
```

**Workflow Analysis**:
1.  **State Dispatch**: The parent component passes the `optimizedPrompt` state to `OutputDisplay` via the `:content` prop.
2.  **Change Request**: When the user inputs in the `<textarea>`, `OutputDisplay` does not store the new content in any internal variable but immediately emits the latest complete content via `emit('update:content', ...)`.
3.  **State Update**: The parent component listens for the `@update:content` event and updates its `optimizedPrompt` state with the new content received.
4.  **View Sync**: Due to Vue's reactivity mechanism, the update of `optimizedPrompt` will automatically trigger a re-render of `OutputDisplay`, keeping the displayed `content` prop in complete sync with the parent component's state, completing the data flow loop.

This process is similar to a bank terminal, which does not store deposit data but is responsible for sending user transaction requests to the central server and displaying the latest balance returned by the server.

## 5. Component Structure and State Machine

### 5.1. Internal View State Machine

The core of the component is driven by a new internal view state `internalViewMode`.

```mermaid
graph TD
    A(Render Mode) -- Click "Source" Button --> B(Source Mode);
    B -- Click "Render" Button --> A;
    A -- originalContent exists<br/>Click "Diff" Button --> C(Diff Mode);
    C -- Click "Render" Button --> A;
    B -- originalContent exists<br/>Click "Diff" Button --> C;
    C -- Click "Source" Button --> B;

    subgraph "Automatic Switching"
        D(Any Mode) -- Streaming Starts --> B;
        B -- Streaming Ends --> E{Restore Previous Mode};
    end
```

### 5.2. `OutputDisplayCore` Internal Structure

```OutputDisplayCore
├── FloatingToolbar
│   ├── ViewModeButtons (Render / Source / Diff)
│   └── ActionButtons (Copy / Fullscreen, etc.)
├── ReasoningSection (...)
└── MainContent
    ├── MarkdownRenderer (v-if="internalViewMode === 'render'")
    ├── textarea (v-if="internalViewMode === 'source'", :readonly="mode !== 'editable'")
    └── TextDiffUI (v-if="internalViewMode === 'diff'")
```

## 6. Functional Features

### 6.1. Explicit View Modes

Users can freely switch between three modes using the dedicated button group on the toolbar, with the currently active mode button displayed in a disabled/highlighted state.

-   **Render Mode (`render`)**:
    -   Default view.
    -   Uses `MarkdownRenderer` to provide rich text preview.
    -   Content is always read-only in this mode.
    -   **Quick Action**: Clicking the content area will automatically switch to `Source Mode`, facilitating quick viewing or editing.

-   **Source Mode (`source`)**:
    -   Displays unprocessed raw text using `<textarea>`.
    -   **Editability**: The text box in this mode is editable only when `props.mode` is `'editable'` and the component is **not in** streaming update state (`streaming: false`). Otherwise, it is read-only.
    -   This is the best mode for displaying streaming output.

-   **Diff Mode (`diff`)**:
    -   **Availability**: The toggle button for this mode is only **rendered** when the `originalContent` prop is passed valid content (controlled by `v-if`). If `originalContent` is empty, the button will be completely removed from the DOM, not just disabled.
    -   Uses the `TextDiffUI` component to clearly display the differences between `content` and `originalContent`.

### 6.2. Intelligent Automatic Switching

This mechanism aims to optimize the user experience during streaming updates, making it seamless and intelligent.

-   **Automatic Entry**: When `props.streaming` becomes `true`, the component will:
    1.  Internally remember the user's current view mode (e.g., `render`).
    2.  Automatically switch the view to `source` mode, as this is the best way to display the raw text stream.
-   **Automatic Recovery**: When `props.streaming` becomes `false`, the component will automatically revert to the previously remembered user-selected view mode.

This process allows users to clearly see the data generation process without losing their preferred viewing method after the process ends.

### 6.3. Intelligent Visibility of Reasoning Area

To address the potential conflict between "automatic expand/collapse" and "user manual operation," we introduced a "user intent memory" mechanism.

**Core States**:
- `isReasoningExpanded: ref(false)`: Controls the current expand/collapse state of the reasoning area.
- `userHasManuallyToggledReasoning: ref(false)`: Remembers whether the user has manually operated.

**Working Logic**:

| Scenario | Condition | Behavior |
| :--- | :--- | :--- |
| **Default State** | Component Initialization | Reasoning area is collapsed by default. |
| **Manual Operation** | User clicks expand/collapse button | 1. Toggle `isReasoningExpanded` state.<br>2. Set `userHasManuallyToggledReasoning` to `true`, **locking automatic behavior**. |
| **New Task Starts** | `props.streaming` changes from `false` to `true` | **Reset User Memory**: Set `userHasManuallyToggledReasoning` back to `false`, allowing automation logic to take over again. |
| **Automatic Expand** | 1. `userHasManuallyToggledReasoning` is `false`.<br>2. Detected that `props.reasoning` starts to have content streamed in. | Set `isReasoningExpanded` to `true`. |
| **Automatic Collapse** | 1. `userHasManuallyToggledReasoning` is `false`.<br>2. `props.streaming` changes from `true` to `false`. | Set `isReasoningExpanded` to `false`. |

This design ensures that the user's explicit actions have the highest priority, and only when the user has not intervened will the system execute intelligent automation for visibility, providing a seamless and non-intrusive user experience.

## V2 Refactoring Implementation Summary

This section documents the key decisions, implementation details, and subsequent optimizations during the refactoring process from V1 to V2, serving as a supplementary explanation for the final design plan.

### 1. Core Improvements

The core improvements achieved through the refactoring are as follows:

-   **UI Structure Optimization**:
    -   **Unified Top-Level Toolbar**: Removed the old floating toolbar and replaced it with a consistently visible top-level toolbar, greatly enhancing the discoverability and operational efficiency of frequently used functions (like view switching and copying).
    -   **Clear Functional Grouping**: The toolbar is clearly divided into a left "View Control Area" and a right "Action Execution Area," aligning with user operational intuition.
    -   **Independence of Reasoning Panel**: The "Reasoning Process" panel has been moved below the top-level toolbar and given an independent, clickable expand/collapse title bar.

-   **Enhanced Interaction Experience**:
    -   Implemented intelligent automatic switching of view modes during streaming updates (switching to source mode when entering, and reverting after completion), and the ability to remember user choices after manual intervention.
    -   Implemented intelligent expand/collapse logic for the reasoning panel, optimizing the presentation of information during content loading.

-   **Code Quality Improvement**:
    -   Significantly simplified state management logic, removing multiple old states like `isHovering`, `isEditing`, `manualToggleActive`, etc.
    -   Simplified event handling mechanisms, making component behavior more predictable.
    -   Through unified and simplified design, improved the maintainability and testability of the component, ultimately achieving good test coverage (all 35 test cases passed).

### 2. Subsequent Optimization Records (Styles and Layout)

After completing the core functional refactoring, a series of optimizations aimed at enhancing visual consistency and fixing style conflicts were conducted:

-   **Removal of Redundant Controls**: Removed the unnecessary "Copy" button from the reasoning panel, simplifying the interface.
-   **Unified Padding**:
    -   **Issue**: Discovered inconsistent padding between render mode (`MarkdownRenderer`) and source mode (`textarea`), causing visual jumps.
    -   **Solution**: Added `!p-0` to the render mode container to override the default padding provided by `theme-card`, and then uniformly applied `px-3 py-2` padding to both `MarkdownRenderer` and `textarea`, ensuring visual consistency across views.

### 3. Theme Style Conflict Resolution (Key Experience)

During the adaptation of version V2 to custom themes (such as purple and green), issues arose with third-party library styles overriding the custom styles. The final solution is recorded as an important experience:

-   **Root Cause of the Problem**: The Tailwind Typography plugin (`prose` class) injects a complete set of styles, including foreground and background colors, which overrides the background color set for Markdown content in the project's custom theme, resulting in an uncoordinated light background in dark themes.
-   **Final Solution**:
    1.  **Isolate Styles**: In `theme.css`, completely removed the definition of `.theme-markdown-content` from `@apply prose-sm ...`, thereby cutting off the strong injection of colors by `prose`.
    2.  **Manually Rebuild Layout**: Manually added pure, color-free layout and spacing styles (such as `font-size`, `margin`, `padding`, etc.) for Markdown elements like `h1`, `p`, `ul`, `code`.
    -   **Conclusion**: This "**complete isolation and manual rebuilding**" strategy is an effective way to resolve conflicts between strongly styled third-party libraries and custom theme systems. It ensures that the color system of the custom theme can be correctly applied while retaining necessary text layouts.