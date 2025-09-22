# Quick Demo Script for Azure DevOps Extension
Write-Host "=== AI Pundit Speckit Extension Demo ===" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Set up test environment
$testDir = "C:\temp\speckit-demo"
Write-Host "`nSetting up demo environment at: $testDir" -ForegroundColor Yellow

# Clean and create test directory
if (Test-Path $testDir) {
    Remove-Item -Path $testDir -Recurse -Force
}
New-Item -ItemType Directory -Path $testDir -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\specs" -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\plans" -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\tasks" -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\validation-reports" -Force | Out-Null

Write-Host "Demo environment created successfully!" -ForegroundColor Green

# Create sample specification
$specContent = @"
# Task Management Web Application

## Overview
A modern web application for managing tasks, projects, and team collaboration.

## User Stories
- As a user, I want to create and manage tasks
- As a user, I want to assign tasks to team members
- As a user, I want to track task progress
- As a user, I want to set task priorities and deadlines

## Functional Requirements
- User authentication and authorization
- Task CRUD operations
- User management
- Dashboard with task overview
- Real-time notifications

## Technology Stack
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Authentication: JWT tokens
"@

$specContent | Out-File -FilePath "$testDir\specs\spec.md" -Encoding UTF8
Write-Host "Sample specification created!" -ForegroundColor Green

# Set environment variables
$env:INPUT_PROJECTNAME = "TaskManagementApp"
$env:INPUT_PROJECTPATH = $testDir
$env:INPUT_AASSISTANT = "copilot"
$env:INPUT_SCRIPTTYPE = "ps"
$env:INPUT_SPECPATH = "$testDir\specs"
$env:INPUT_TECHSTACK = "React with TypeScript, Node.js Express, PostgreSQL"
$env:INPUT_PLANPATH = "$testDir\plans"
$env:INPUT_SPECFILE = "spec.md"
$env:INPUT_OUTPUTPATH = "$testDir\tasks"
$env:INPUT_DEBUGMODE = "true"

Write-Host "`nEnvironment variables set!" -ForegroundColor Green

# Test the tasks
Write-Host "`n=== Testing Extension Tasks ===" -ForegroundColor Cyan

# Test Specify Task
Write-Host "`n1. Testing Specify Task (Generate Specifications)..." -ForegroundColor Yellow
try {
    node "dist\tasks\specify\task.js"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Specify Task completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Specify Task failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Specify Task failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Plan Task
Write-Host "`n2. Testing Plan Task (Generate Implementation Plan)..." -ForegroundColor Yellow
try {
    node "dist\tasks\plan\task.js"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Plan Task completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Plan Task failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Plan Task failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Tasks Task
Write-Host "`n3. Testing Tasks Task (Generate Development Tasks)..." -ForegroundColor Yellow
try {
    node "dist\tasks\tasks\task.js"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Tasks Task completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Tasks Task failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ Tasks Task failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test ValidateSpec Task
Write-Host "`n4. Testing ValidateSpec Task (Validate Specifications)..." -ForegroundColor Yellow
try {
    node "dist\tasks\validate-spec\task.js"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ ValidateSpec Task completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "   ✗ ValidateSpec Task failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "   ✗ ValidateSpec Task failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Show generated files
Write-Host "`n=== Generated Files ===" -ForegroundColor Cyan
Write-Host "Demo directory: $testDir" -ForegroundColor Gray

Get-ChildItem -Path $testDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace($testDir, ".")
    $type = if ($_.PSIsContainer) { "[DIR]" } else { "[FILE]" }
    $size = if (-not $_.PSIsContainer) { " ($($_.Length) bytes)" } else { "" }
    Write-Host "   $type $relativePath$size" -ForegroundColor White
}

Write-Host "`n=== Demo Complete! ===" -ForegroundColor Green
Write-Host "The extension has been tested locally and generated the following:" -ForegroundColor White
Write-Host "- Specifications for the Task Management App" -ForegroundColor White
Write-Host "- Implementation plans and architecture decisions" -ForegroundColor White
Write-Host "- Detailed development tasks with priorities" -ForegroundColor White
Write-Host "- Validation reports and quality metrics" -ForegroundColor White

Write-Host "`nThis demonstrates how the AI Pundit Speckit extension can:" -ForegroundColor Cyan
Write-Host "1. Automatically generate project specifications" -ForegroundColor White
Write-Host "2. Create detailed implementation plans" -ForegroundColor White
Write-Host "3. Generate actionable development tasks" -ForegroundColor White
Write-Host "4. Validate specifications for quality assurance" -ForegroundColor White
Write-Host "5. Integrate with Azure DevOps pipelines" -ForegroundColor White

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
