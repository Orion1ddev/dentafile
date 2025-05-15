#!/bin/bash

# Exit on error
set -e

# Install dependencies with npm if bun fails
if ! command -v bun &> /dev/null; then
    echo "Bun not found, using npm instead"
    npm install
else
    bun install || npm install
fi

# Run the build
npm run build 