#!/bin/bash
# Spec Kit Azure DevOps Extension Setup Script
# This script sets up the development environment for the Azure DevOps extension

echo "Setting up Spec Kit Azure DevOps Extension..." 

# Check if Node.js is installed
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "Node.js version: $NODE_VERSION"
else
    echo "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
echo "Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "Python version: $PYTHON_VERSION"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo "Python version: $PYTHON_VERSION"
else
    echo "Python is not installed. Please install Python 3.11+ from https://python.org/"
    exit 1
fi

# Check if uv is installed
echo "Checking uv installation..."
if command -v uv &> /dev/null; then
    UV_VERSION=$(uv --version)
    echo "uv version: $UV_VERSION"
else
    echo "uv is not installed. Installing uv..."
    if command -v pip3 &> /dev/null; then
        pip3 install uv
    elif command -v pip &> /dev/null; then
        pip install uv
    else
        echo "pip is not available. Please install uv manually: curl -LsSf https://astral.sh/uv/install.sh | sh"
        exit 1
    fi
    echo "uv installed successfully"
fi

# Install npm dependencies
echo "Installing npm dependencies..."
if npm install; then
    echo "Dependencies installed successfully"
else
    echo "Failed to install dependencies. Please check your Node.js installation."
    exit 1
fi

# Install Azure DevOps CLI tools
echo "Installing Azure DevOps CLI tools..."
if npm install -g tfx-cli; then
    echo "Azure DevOps CLI tools installed successfully"
else
    echo "Failed to install Azure DevOps CLI tools. Please install manually: npm install -g tfx-cli"
fi

# Create necessary directories
echo "Creating necessary directories..."
directories=(
    "dist"
    "images"
    "images/screenshots"
    "tasks/specify"
    "tasks/plan"
    "tasks/tasks"
    "tasks/validate-spec"
    "widgets/spec-progress"
    "widgets/ai-status"
)

for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo "Created directory: $dir"
    fi
done

# Build the extension
echo "Building the extension..."
if npm run build; then
    echo "Extension built successfully"
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi

# Package the extension
echo "Packaging the extension..."
if npm run package; then
    echo "Extension packaged successfully"
else
    echo "Packaging failed. Please check the error messages above."
    exit 1
fi

echo "Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Upload the generated .vsix file to your Azure DevOps organization"
echo "2. Or publish to the Visual Studio Marketplace"
echo "3. Configure your pipelines to use the Spec Kit tasks"
echo ""
echo "For more information, see the README.md file."
