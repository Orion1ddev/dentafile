# PowerShell script for local deployment
# This script will download and use Node.js locally if not already installed

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js is installed: $nodeVersion"
} catch {
    Write-Host "Node.js is not installed or not in PATH. Installing locally..."
    
    # Create a directory for Node.js if it doesn't exist
    New-Item -ItemType Directory -Force -Path ".\nodejs" | Out-Null
    
    # Download Node.js
    $nodeUrl = "https://nodejs.org/dist/v18.17.1/node-v18.17.1-win-x64.zip"
    $nodeZip = ".\nodejs\node.zip"
    
    Write-Host "Downloading Node.js..."
    Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeZip
    
    # Extract Node.js
    Write-Host "Extracting Node.js..."
    Expand-Archive -Path $nodeZip -DestinationPath ".\nodejs" -Force
    
    # Set path for this session
    $env:PATH = "$PWD\nodejs\node-v18.17.1-win-x64;$env:PATH"
}

# Create package-lock.json
Write-Host "Generating package-lock.json..."
node -e "const fs = require('fs'); const pkg = require('./package.json'); fs.writeFileSync('package-lock.json', JSON.stringify({name: pkg.name, version: pkg.version, lockfileVersion: 2, requires: true, packages: {'': {name: pkg.name, version: pkg.version}}}, null, 2));"

# Build the project
Write-Host "Building project..."
if (Test-Path ".\nodejs\node-v18.17.1-win-x64\npm.cmd") {
    .\nodejs\node-v18.17.1-win-x64\npm.cmd install
    .\nodejs\node-v18.17.1-win-x64\npm.cmd run build
} else {
    npm install
    npm run build
}

Write-Host "Done!" 