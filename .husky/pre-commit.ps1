# PowerShell version of pre-commit hook

# Check if package-lock.json or yarn.lock files exist
if (Test-Path "package-lock.json") {
  Write-Host "Error: package-lock.json file detected." -ForegroundColor Red
  Write-Host "This project mandates pnpm as the package manager. Please delete package-lock.json and use pnpm install to install dependencies." -ForegroundColor Red
  exit 1
}

if (Test-Path "yarn.lock") {
  Write-Host "Error: yarn.lock file detected." -ForegroundColor Red
  Write-Host "This project mandates pnpm as the package manager. Please delete yarn.lock and use pnpm install to install dependencies." -ForegroundColor Red
  exit 1
}

# Ensure pnpm-lock.yaml exists
if (-not (Test-Path "pnpm-lock.yaml")) {
  Write-Host "Warning: pnpm-lock.yaml file not detected." -ForegroundColor Yellow
  Write-Host "Please ensure you use pnpm install to install dependencies." -ForegroundColor Yellow
}