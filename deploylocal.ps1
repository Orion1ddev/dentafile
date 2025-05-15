# PowerShell script for local deployment
# This script will use Node.js if available, or guide you to install it

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js is installed: $nodeVersion"
} catch {
    Write-Host "Node.js is not installed or not in PATH."
    Write-Host "Please install Node.js from https://nodejs.org/"
    Write-Host "After installing, restart your terminal and run this script again."
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found in current directory."
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Build the project
Write-Host "Building project..."
npm run build

Write-Host "Build completed successfully!"
Write-Host "The build output is in the ./dist directory." 