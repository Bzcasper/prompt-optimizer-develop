# Version Synchronization Mechanism

## Overview

To ensure that the version numbers of all components in the project remain consistent, we have established an automatic version synchronization mechanism. This mechanism automatically synchronizes the version number in the root `package.json` file to other files that require a version number.

## Automatically Synchronized Files

Currently, the files that automatically synchronize the version number include:

- `packages/extension/public/manifest.json` - Browser extension manifest file

## How to Use

### Method 1: Use the pnpm version command (recommended)

Use the standard pnpm version management command, and the version number will be automatically synchronized:

```bash
# Upgrade patch version (1.0.7 -> 1.0.8)
pnpm version patch

# Upgrade minor version (1.0.7 -> 1.1.0)
pnpm version minor

# Upgrade major version (1.0.7 -> 2.0.0)
pnpm version major
```

### Method 2: Manual Synchronization

If you have directly modified the version number in `package.json`, you can manually run the synchronization command:

```bash
pnpm run version:sync
```

## How It Works

1. **pnpm version command**: Updates the version number in `package.json`
2. **version hook**: Runs the synchronization script and stages the changes before creating a commit
   - Executes `pnpm run version:sync` to synchronize the version numbers of other files
   - Executes `git add -A` to add all changes to the staging area
3. **Synchronization script**: `scripts/sync-versions.js` reads the new version number and updates other files
4. **git commit**: pnpm creates a commit and tag containing all version number changes

## Adding New Synchronized Files

If you need to add version synchronization for more files, edit the `versionFiles` array in the `scripts/sync-versions.js` file:

```javascript
const versionFiles = [
  {
    path: 'packages/extension/public/manifest.json',
    field: 'version',
    description: 'Browser extension manifest file'
  },
  {
    path: 'path/to/your/file.json',
    field: 'version',
    description: 'Your file description'
  }
];
```

## Notes

- Ensure that the target file is in valid JSON format
- The version field must exist in the target file
- The script will exit and display an error message if an error occurs
- All version number changes will be logged to the console

## Troubleshooting

If the synchronization fails, please check:

1. Whether the target file exists and is in the correct format
2. Whether the version field exists in the target file
3. Whether there are any file permission issues
4. Whether the Node.js version is compatible

If you have any problems, you can directly run the synchronization script for debugging:

```bash
node scripts/sync-versions.js
```
