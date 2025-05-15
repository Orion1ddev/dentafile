#!/bin/bash

# Exit on error
set -e

# Install Node.js if not available
if ! command -v node &> /dev/null; then
    echo "Node.js not found, installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
fi

# Install dependencies and build
npm install
npm run build 