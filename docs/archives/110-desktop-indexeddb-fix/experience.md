# "Desktop IndexedDB Repair" Task Experience Summary

## Core Experience

### Architecture Design
- **Enforcing Explicitness Over Convenience**: The core of this task was the removal of convenience methods like `createDefault()`. This forces developers to explicitly specify the storage type when creating services, thereby avoiding the accidental creation of IndexedDB in unsuitable environments like Electron. This is an important architectural principle that helps prevent hidden side effects caused by the environment.
- **Avoiding Module-Level Side Effects**: We found that creating instances (such as storage providers) in the top-level scope of modules like `factory.ts` is a significant risk. Modules should not perform any substantive operations with side effects when imported. All instantiation should be done through explicit function calls and dependency injection.

### Debugging and Troubleshooting
- **Beware of Legacy Data**: This is a key lesson. Even if the code has been fixed, residual IndexedDB data in the browser can lead to abnormal application behavior, obscuring the true effects of the fix. When dealing with issues related to persistent data, "cleaning up historical data" must be part of the validation steps.
- **Avoid Over-Fixing**: In the early stages of troubleshooting, we added some complex environment checks and warning logic to the code. While the intention was good, this increased the complexity of the code. Ultimately, through more fundamental architectural fixes (removing `createDefault`), these complex logics became redundant. This reminds us to review and clean up any temporary or overly defensive code added during the fixing process.

## Specific Pitfall Guide

- **Issue**: IndexedDB should not appear in the Electron renderer process.
- **Consequence**: Violates the core architecture of the desktop side (data should be managed uniformly by the main process), potentially leading to data inconsistency and unexpected disk I/O.
- **Correct Approach**: The renderer process should operate on data entirely through IPC proxies communicating with the main process and should not directly create any storage instances. All storage-related logic should be encapsulated in the main process.

- **Issue**: Convenient factory methods (like `createDefault()`) may hide environmental dependencies.
- **Consequence**: Leads to inconsistent behavior of modules in different environments, increasing debugging difficulty.
- **Correct Approach**: Remove such implicit instance creation methods. Enforce the use of dependency injection, making all dependencies explicit, controllable, and easy to test.