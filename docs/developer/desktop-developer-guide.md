# Prompt Optimizer Desktop Application Developer Guide

## 1. Project Background and Goals

The user wants to transform the existing Prompt Optimizer Web application into a desktop application. The core goal is to **use the Electron main process to proxy API requests, thereby completely solving the browser's CORS cross-origin issue**.

### Technology Selection: Why Choose Electron?

-   **Unified Technology Stack**: Electron allows us to reuse the existing JavaScript/TypeScript and Vue technology stack without introducing new technologies like Rust (Tauri solution), reducing the team's learning curve and development barrier.
-   **Minimal Code Intrusion**: Through Electron's inter-process communication (IPC) mechanism, we can implement a seamless API request proxy. We only need to inject a custom network request function during SDK initialization, which has minimal intrusion into the core business logic (`packages/core`).
-   **Mature Ecosystem**: Electron has a large and mature community and ecosystem, providing strong support for future feature extensions (such as automatic updates, system notifications).

## 2. Architecture Design

The application adopts a **high-level service proxy** architecture with clear responsibilities and strong maintainability. The main process acts as a backend service provider, and the renderer process acts as a frontend consumer.

### Overall Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Electron Desktop Application                       │
├─────────────────────────────────────────────────────────────┤
│                  Main Process (main.js) - Server Side                  │
│  - Window Management                                                 │
│  - **Directly consumes the @prompt-optimizer/core package**            │
│  - **Instantiates and holds core services (LLMService, ModelManager)** │
│  - **As a backend, provides high-level service interfaces (e.g., testConnection) via IPC** │
├─────────────────────────────────────────────────────────────┤
│              Preload Script (preload.js) - Secure Bridge               │
│  - Exposes the main process's high-level service interfaces (`llm.testConnection`) │
│  - Securely to the renderer process (`window.electronAPI.llm.*`)        │
├─────────────────────────────────────────────────────────────┤
│            Renderer Process (Vue Application) - Pure Frontend Consumer             │
│  - UI interface and user interaction                                    │
│  - **Through the proxy object in the `core` package (`ElectronLLMProxy`)** │
│  - **Calls `window.electronAPI.llm.testConnection()`**                  │
│  - **Does not directly handle network requests, only calls defined service interfaces** │
└─────────────────────────────────────────────────────────────┘
```

### Service Call Data Flow

```
1. User operates on the UI, triggering a method in a Vue component
2. The Vue component calls the Electron-oriented proxy service (`ElectronLLMProxy`) in the `core` package
3. The proxy service calls the `window.electronAPI.llm.testConnection()` exposed by the preload script (IPC call)
4. The preload script sends the request to the main process via `ipcRenderer`
5. The `ipcMain` listener in the main process captures the request and directly calls the **real LLMService instance held in the main process**
6. The LLMService instance, running in the Node.js environment, uses `node-fetch` to make the actual API request
7. The final result (JSON data, not a Response object) is returned along the original path: main process → preload script → proxy service → Vue component → UI update
```

### Core Architecture Explained: Proxy Pattern and Inter-Process Communication (IPC)

To fully understand the robustness of the new architecture, one must understand the core concept behind it: **the main process is the "brain," and the renderer process is the "limbs."** All memory, thinking, and decision-making (core services) must be made uniformly by the "brain," while the "limbs" (UI) are only responsible for perception and action.

#### 1. Why can't the `core` module be called directly from the UI layer?

In a pure web application, the UI and Core live in the same world (single process) and can communicate directly. However, in Electron, the main process and the renderer process are two **completely isolated operating system processes** with their own independent memory spaces.

What happens if `createModelManager()` is called directly from the UI layer (renderer process)?
- **Data Islands**: A **brand new, empty** `ModelManager` instance will be created in the renderer process. It is **not connected** to the instance in the main process that holds the real data, resulting in data that can never be synchronized.
- **Missing Capabilities**: Some functions of the `core` module (such as future file I/O) depend on the Node.js environment. The renderer process (based on Chromium) does not have these capabilities, and calling related functions will directly cause the **application to crash**.

#### 2. `ipcRenderer` and `ipcMain`: Telephones for Two Worlds

Inter-process communication (IPC) is the only bridge connecting these two isolated worlds.
- **`ipcRenderer`**: A "telephone" installed in the **renderer process**, specifically for "making calls" (sending requests) to the main process.
- **`ipcMain`**: A "switchboard" installed in the **main process**, specifically for "answering calls" (handling requests).

We mainly use the `invoke`/`handle` **two-way communication** model, which perfectly simulates the "request-response" asynchronous flow.

#### 3. `ElectronModelManagerProxy`: The Elegant "Plenipotentiary"

Allowing the UI layer to directly operate low-level "telephone commands" like `ipcRenderer.invoke('channel-name', ...)` is chaotic and insecure. For this reason, we have introduced the **Proxy Pattern**.

The core role of proxy classes like `ElectronModelManagerProxy` is to **"pretend" to be the real `ModelManager`**, so that the UI layer code can be called seamlessly as before, without having to worry about the complex cross-process communication behind the scenes.

Its workflow is a precise "intercept-forward-return" process:
1. **UI Call**: The UI calls `modelManager.getModels()`.
2. **Proxy Interception**: The call is actually made to the method of the same name on the `ElectronModelManagerProxy` instance.
3. **Proxy Forwarding**: This method contains no business logic, it is only responsible for calling `ipcRenderer.invoke('model-getModels')` through the `electronAPI` exposed by `preload.js`.
4. **Main Process Handling**: `ipcMain.handle` captures the request, calls the **single, real `ModelManager` instance in the main process**, processes and returns the data.
5. **Data Return**: The result is returned along the original path and finally delivered to the UI component.

Although this pattern requires adding "boilerplate code" in multiple files (`main.js`, `preload.js`, `proxy.ts`) when adding new methods, this is not a meaningless repetition. It is a very cost-effective price to pay for a **single source of data, secure boundaries, and an elegant, type-safe abstraction**.

## 3. Quick Start (Development Mode)

### System Requirements

-   Windows 10/11, macOS, or Linux
-   Node.js 18+
-   pnpm 8+

### Startup Steps

```bash
# 1. (First time) Install all dependencies in the project root directory
pnpm install

# 2. Run the desktop application in development mode
pnpm dev:desktop
```

This command will start both the Vite development server (for the frontend interface) and the Electron application instance, and enable hot reloading.

## 4. Core Technology Implementation

The current architecture abandons the fragile low-level `fetch` proxy in favor of a more stable and easier-to-maintain **high-level service proxy model**.

### Service Consumption Model

The main process (`main.js`) now acts as a backend service, directly consuming the capabilities of `packages/core` and fully reusing its business logic, avoiding code redundancy.

```javascript
// main.js - The main process directly imports and uses the core package
const { 
    createLLMService, 
    createModelManager,
    // ... other services
} = require('@prompt-optimizer/core');

// Instantiate services when the main process starts
let llmService;
app.whenReady().then(() => {
    // A storage solution suitable for Node.js is needed here (see below)
    const modelManager = createModelManager(/* ... */);
    
    // Create a real LLMService instance that runs in the Node.js environment
    llmService = createLLMService(modelManager);
    
    // Pass the service instance to the IPC setup function
    setupIPC(llmService);
});
```

### High-level IPC Interface

The "contract" for communication between the renderer process and the main process has been upgraded from the unstable `fetch` API to our own stable `ILLMService` interface.

```javascript
// main.js - Provide the service interface
function setupIPC(llmService) {
    ipcMain.handle('llm-testConnection', async (event, provider) => {
        try {
            await llmService.testConnection(provider);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
    // ... implementation of other interfaces
}

// preload.js - Expose the service interface
contextBridge.exposeInMainWorld('electronAPI', {
    llm: {
        testConnection: (provider) => ipcRenderer.invoke('llm-testConnection', provider),
        // ... exposure of other interfaces
    }
});
```

### Storage Strategy

Since the renderer process's `IndexedDB` is not available in the main process (Node.js), we have designed a phased storage solution for the desktop end:

-   **Phase 1 (Current Implementation):** A temporary **in-memory storage** solution is adopted. This allows the new architecture to run quickly, but data will be lost when the application is closed.
-   **Phase 2 (Future Plan):** Implement a **file storage (`FileStorageProvider`)** to persist data such as models and templates as JSON files on the user's local disk, taking full advantage of the desktop environment.

## 5. Build and Deployment

### Development Scripts

-   `pnpm dev:desktop`: Starts both the frontend development server and the Electron application for daily development.
-   `pnpm build:web`: Only builds the frontend web application, with the output in `packages/desktop/web-dist`.
-   `pnpm build:desktop`: Builds the final distributable desktop application (e.g., `.exe` or `.dmg`).

### Production Version Build Process

```bash
# Complete build process, will automatically build the web content first
pnpm build:desktop

# After the build is complete, the executable file is located in the following directory
# packages/desktop/dist/
```

### Electron Builder Configuration

The packaging configuration is located in the `build` field of `packages/desktop/package.json`.

```json
{
  "build": {
    "appId": "com.promptoptimizer.desktop",
    "productName": "Prompt Optimizer",
    "directories": { "output": "dist" },
    "files": [
      "main.js", 
      "preload.js", 
      "web-dist/**/*", // Package the built frontend application
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis", // Windows installer format
      "icon": "icon.ico" // Application icon
    }
  }
}
```

## 6. Troubleshooting

**1. Application fails to start or shows a blank screen**
-   Make sure `pnpm install` has been executed successfully.
-   Confirm that `pnpm build:web` has been executed successfully and that the `packages/desktop/web-dist` directory has been generated and is not empty.
-   Try cleaning and reinstalling: `pnpm store prune && pnpm install`.

**2. Incomplete Electron installation**
-   This is usually a network issue. You can try configuring the `electron_mirror` environment variable or installing it manually.
-   Manual installation command:
    ```bash
    # (The path may vary depending on the pnpm version)
    cd node_modules/.pnpm/electron@<version>/node_modules/electron
    node install.js
    ```

**3. API call fails**
-   Check if the API key is correctly configured on the "Model Management" page of the desktop application.
-   Open the developer tools (`Ctrl+Shift+I`) to view the `Console` of the renderer process.
-   **Key:** Since the core API call logic has been moved to the main process, be sure to **check the log output in the terminal (command line window) where the desktop application was started**, as it will contain the most direct `node-fetch` error messages.
-   Confirm that the network connection is normal.

## 7. Future Architecture Improvement Directions

The current manual maintenance of IPC "boilerplate code" in multiple files is clear and robust, but as features expand, development efficiency and consistency will become challenges. In the future, we can adopt a **Code Generation** solution to completely solve this problem.

### Core Concept

The only file that we need to maintain manually should be the **interface definition** of the service (e.g., `IModelManager`). We will use this interface as the **"Single Source of Truth"**.

### Automated Workflow

1.  **Define the Blueprint**: Maintain interfaces like `IModelManager` in the `types.ts` file of the `core` package.
2.  **Write a Generator Script**: Use a library like `ts-morph` to write a Node.js script that can read and parse the structure of a TypeScript interface (method names, parameters, return values, etc.).
3.  **Automatically Generate Boilerplate Code**: The script iterates over each method in the interface and, based on a preset template, automatically generates the `ipcMain.handle` in `main.js`, the `ipcRenderer` call in `preload.js`, and the proxy method in `electron-proxy.ts`.
4.  **One-click Update**: Integrate this script into `package.json`. In the future, when adding/modifying/deleting an interface method, the developer only needs to modify the interface definition and then run a command (e.g., `pnpm generate:ipc`), and all related IPC code will be automatically and correctly updated.

### Alternative Solutions

The mature `tRPC` framework in the community also provides a similar idea, its core being a "zero code generation" type-safe API layer. We can draw on its ideas and even try to integrate it into Electron's IPC mechanism.

By adopting this solution, our development process will become extremely efficient and safe, completely eliminating all potential errors that may be caused by manually maintaining IPC calls.
