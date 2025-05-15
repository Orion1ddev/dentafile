#!/bin/bash

# Exit on error
set -e

# Show Node.js version information
echo "Node.js version:"
node --version
echo "NPM version:"
npm --version

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the project
echo "Building project..."
npm run build

echo "Build completed successfully!" 