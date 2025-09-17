# Spec Kit Azure DevOps Extension Setup Script
# This script sets up the development environment for the Azure DevOps extension

Write-Host "Setting up Spec Kit Azure DevOps Extension..." -ForegroundColor Green

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "Python version: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python is not installed. Please install Python 3.11+ from https://python.org/" -ForegroundColor Red
    exit 1
}

# Check if uv is installed
Write-Host "Checking uv installation..." -ForegroundColor Yellow
try {
    $uvVersion = uv --version
    Write-Host "uv version: $uvVersion" -ForegroundColor Green
} catch {
    Write-Host "uv is not installed. Installing uv..." -ForegroundColor Yellow
    try {
        pip install uv
        Write-Host "uv installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "Failed to install uv. Please install manually: pip install uv" -ForegroundColor Red
        exit 1
    }
}

# Install npm dependencies
Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to install dependencies. Please check your Node.js installation." -ForegroundColor Red
    exit 1
}

# Install Azure DevOps CLI tools
Write-Host "Installing Azure DevOps CLI tools..." -ForegroundColor Yellow
try {
    npm install -g tfx-cli
    Write-Host "Azure DevOps CLI tools installed successfully" -ForegroundColor Green
} catch {
    Write-Host "Failed to install Azure DevOps CLI tools. Please install manually: npm install -g tfx-cli" -ForegroundColor Red
}

# Create necessary directories
Write-Host "Creating necessary directories..." -ForegroundColor Yellow
$directories = @(
    "dist",
    "images",
    "images/screenshots",
    "tasks/specify",
    "tasks/plan", 
    "tasks/tasks",
    "tasks/validate-spec",
    "widgets/spec-progress",
    "widgets/ai-status"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Green
    }
}

# Build the extension
Write-Host "Building the extension..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "Extension built successfully" -ForegroundColor Green
} catch {
    Write-Host "Build failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

# Package the extension
Write-Host "Packaging the extension..." -ForegroundColor Yellow
try {
    npm run package
    Write-Host "Extension packaged successfully" -ForegroundColor Green
} catch {
    Write-Host "Packaging failed. Please check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload the generated .vsix file to your Azure DevOps organization" -ForegroundColor White
Write-Host "2. Or publish to the Visual Studio Marketplace" -ForegroundColor White
Write-Host "3. Configure your pipelines to use the Spec Kit tasks" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see the README.md file." -ForegroundColor Cyan
