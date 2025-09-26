# Desktop Automatic Update System - Design Document

## 🎯 Design Overview

The desktop automatic update system adopts a dual version display design, simultaneously showing update information for both the stable version and the preview version, allowing users to choose their update path.

### Core Design Principles
1. **Clear Information Hierarchy**: Current Version → Latest Stable Version → Latest Preview Version
2. **Intuitive and Clear Operations**: Independent operation buttons for each version
3. **Prominent Status Indicators**: Red "Updates Available" label in the top right corner
4. **Fixed Bottom Buttons**: Only "Close" and "Check for Updates" buttons

## 📱 Interface Layout Design

### Complete Layout Structure
```
┌─────────────────────────────────────────┐
│ Application Update                       │
├─────────────────────────────────────────┤
│ ┌─ Current Version ───────────────────┐ │
│ │ Current Version: v1.2.0              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─ Latest Stable Version ──────────────┐ │
│ │ Stable Version v1.2.1        [Updates Available] ↗ │
│ │ [Details] [Ignore] [Download]       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─ Latest Preview Version ─────────────┐ │
│ │ Preview Version v1.3.0-beta.1  [Updates Available] ↗ │
│ │ [Details] [Ignore] [Download]       │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│              [Close] [Check for Updates] │
└─────────────────────────────────────────┘
```

### Status Display Logic
- **Updates Available**: Displays a red "Updates Available" label and a link icon in the top right corner
- **Up to Date**: Displays green "Up to Date" text
- **Checking**: Displays loading animation and "Checking..." text
- **Check Failed**: Displays error message and retry prompt

## 🔧 Technical Architecture Design

### Dual Version Check Mechanism
```typescript
// Main process manages uniformly to avoid concurrency conflicts
const checkAllVersions = async () => {
  // Serially check stable version
  autoUpdater.allowPrerelease = false
  const stableResult = await autoUpdater.checkForUpdates()
  
  // Delay before checking preview version
  await new Promise(resolve => setTimeout(resolve, 1000))
  autoUpdater.allowPrerelease = true
  const prereleaseResult = await autoUpdater.checkForUpdates()
  
  return { stable: stableResult, prerelease: prereleaseResult }
}
```

### Version Comparison Logic
- **Stable Version Comparison**: Uses semver standard for comparison
- **Preview Version Comparison**: First compares base version, then compares pre-release identifiers
- **Ignore Version Handling**: Supports ignoring stable and preview versions separately

### State Management Design
```typescript
interface UpdaterState {
  // Check status
  isChecking: boolean
  hasStableUpdate: boolean
  hasPrereleaseUpdate: boolean
  
  // Version information
  currentVersion: string
  stableVersion: string | null
  prereleaseVersion: string | null
  
  // Download status
  isDownloading: boolean
  downloadProgress: number
  isDownloaded: boolean
  
  // Ignore status
  isStableVersionIgnored: boolean
  isPrereleaseVersionIgnored: boolean
}
```

## 🎨 UI Component Design

### Version Information Card
- **Title Area**: Version type + Version number + Status label
- **Action Area**: Details link + Ignore button + Download button
- **Status Indicator**: Link icon in the top right corner (shown when updates are available)

### Button State Design
- **Download Button**:
  - Updates available and not ignored: Displays "Download"
  - Downloading: Displays progress bar
  - Download complete: Displays "Install and Restart"
- **Ignore Button**: Only displayed when updates are available
- **Details Link**: Always displayed, clicking opens the GitHub release page

### Responsive Design
- **Minimum Width**: 480px
- **Maximum Width**: 600px
- **Height Adaptive**: Dynamically adjusts based on content
- **Mobile Adaptation**: Button size and spacing optimized

## 🔄 Interaction Flow Design

### Check for Updates Flow
1. User clicks "Check for Updates"
2. Displays loading status
3. Main process serially checks both versions
4. Updates UI to display results
5. Displays corresponding action buttons based on results

### Download and Install Flow
1. User selects version and clicks "Download"
2. Displays download progress
3. After download completes, displays "Install and Restart" button
4. User clicks install, application restarts and updates

### Ignore Version Flow
1. User clicks "Ignore" button
2. Saves ignore status to local storage
3. Hides update prompt for that version
4. Updates the red dot status on the main interface

## 🛡️ Error Handling Design

### Network Error Handling
- **Timeout Handling**: 30 seconds timeout, displays retry prompt
- **Connection Failure**: Displays network error message
- **Authentication Failure**: Displays permission error prompt

### Download Error Handling
- **Download Interruption**: Supports resuming downloads
- **File Corruption**: Re-downloads the file
- **Insufficient Disk Space**: Displays insufficient space prompt

### Installation Error Handling
- **Insufficient Permissions**: Prompts to run as administrator
- **File In Use**: Prompts to close related programs
- **Installation Failure**: Displays detailed error message

## 📊 Performance Optimization Design

### Caching Strategy
- **Version Information Cache**: 2 hours validity
- **Download File Cache**: Retains the latest version file
- **State Persistence**: Stores ignore status locally

### Resource Optimization
- **On-Demand Loading**: Checks for updates only when needed
- **Background Checking**: Automatically checks on application startup
- **Smart Reminders**: Avoids frequent interruptions to users

---

**Design Goal**: Provide an intuitive, reliable, and user-friendly automatic update experience, allowing users to easily manage application version updates.