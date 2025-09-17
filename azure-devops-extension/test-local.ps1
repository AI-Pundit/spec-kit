# Local Testing Script for Azure DevOps Extension
# This script tests the extension tasks locally before deploying to Azure DevOps

Write-Host "🧪 Testing Azure DevOps Extension Tasks Locally" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Set the extension path
$extensionPath = Get-Location
$distPath = Join-Path $extensionPath "dist"

Write-Host "Extension Path: $extensionPath" -ForegroundColor Cyan
Write-Host "Dist Path: $distPath" -ForegroundColor Cyan

# Create test environment
$testDir = "C:\temp\azure-devops-test"
Write-Host "Creating test environment at: $testDir" -ForegroundColor Yellow

# Remove existing test directory
if (Test-Path $testDir) {
    Remove-Item -Path $testDir -Recurse -Force
}

# Create test directories
New-Item -ItemType Directory -Path $testDir -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\specs" -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\plans" -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\tasks" -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\validation-reports" -Force | Out-Null
New-Item -ItemType Directory -Path "$testDir\output" -Force | Out-Null

Write-Host "✅ Test environment created" -ForegroundColor Green

# Create sample specification
$specContent = @"
# Test Specification

## Overview
This is a test specification for local testing of the Azure DevOps extension.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality
- As a team lead, I want to ensure quality before deployment

## Functional Requirements
- The system should work locally without Azure DevOps
- The system should generate proper outputs
- The system should handle errors gracefully
- The system should validate inputs correctly

## Acceptance Criteria
- Given a test specification
- When the extension runs locally
- Then it should generate a plan and tasks
- And it should create validation reports
- And it should handle errors appropriately

## Technical Requirements
- Python 3.11+ support
- Node.js 16+ support
- AI assistant integration
- File system operations
- Error handling and logging
"@

$specContent | Out-File -FilePath "$testDir\specs\spec.md" -Encoding UTF8
Write-Host "✅ Sample specification created" -ForegroundColor Green

# Set environment variables for testing
Write-Host "Setting environment variables..." -ForegroundColor Yellow

$env:INPUT_PROJECTNAME = "test-project"
$env:INPUT_PROJECTPATH = $testDir
$env:INPUT_AASSISTANT = "copilot"
$env:INPUT_SCRIPTTYPE = "ps"
$env:INPUT_SPECPATH = "$testDir\specs"
$env:INPUT_TECHSTACK = "React with TypeScript, Node.js backend, PostgreSQL database"
$env:INPUT_PLANPATH = "$testDir\plans"
$env:INPUT_SPECFILE = "spec.md"
$env:INPUT_PLANFILE = "plan.md"
$env:INPUT_OUTPUTPATH = "$testDir\output"
$env:INPUT_FAILONERROR = "true"
$env:INPUT_VALIDATEPLAN = "true"
$env:INPUT_CREATEWORKITEMS = "false"
$env:INPUT_ASSIGNTOTEAM = "false"
$env:INPUT_DEBUGMODE = "true"

Write-Host "✅ Environment variables set" -ForegroundColor Green

# Test functions
function Test-Task {
    param(
        [string]$TaskName,
        [string]$TaskPath,
        [string]$Description
    )
    
    Write-Host "🔧 Testing $TaskName..." -ForegroundColor Yellow
    Write-Host "   Description: $Description" -ForegroundColor Gray
    
    try {
        $result = node $TaskPath 2>&1
        $exitCode = $LASTEXITCODE
        
        if ($exitCode -eq 0) {
            Write-Host "   ✅ $TaskName passed" -ForegroundColor Green
            return $true
        } else {
            Write-Host "   ❌ $TaskName failed (Exit Code: $exitCode)" -ForegroundColor Red
            Write-Host "   Output: $result" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "   ❌ $TaskName failed with exception: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test all tasks
Write-Host "`n🚀 Starting task tests..." -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan

$testResults = @{}

# Test Specify Task
$testResults["Specify"] = Test-Task -TaskName "Specify Task" -TaskPath "$distPath\tasks\specify\task.js" -Description "Initialize spec-driven development project"

# Test Plan Task
$testResults["Plan"] = Test-Task -TaskName "Plan Task" -TaskPath "$distPath\tasks\plan\task.js" -Description "Generate implementation plan from specifications"

# Test Tasks Task
$testResults["Tasks"] = Test-Task -TaskName "Tasks Task" -TaskPath "$distPath\tasks\tasks\task.js" -Description "Generate actionable task list from plans"

# Test ValidateSpec Task
$testResults["ValidateSpec"] = Test-Task -TaskName "ValidateSpec Task" -TaskPath "$distPath\tasks\validate-spec\task.js" -Description "Validate specifications against requirements"

# Display test results
Write-Host "`n📊 Test Results Summary" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan

$passedTests = 0
$totalTests = $testResults.Count

foreach ($task in $testResults.Keys) {
    $status = if ($testResults[$task]) { "✅ PASSED" } else { "❌ FAILED" }
    $color = if ($testResults[$task]) { "Green" } else { "Red" }
    Write-Host "   $task`: $status" -ForegroundColor $color
    
    if ($testResults[$task]) {
        $passedTests++
    }
}

Write-Host "`n📈 Overall Results: $passedTests/$totalTests tests passed" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

# Check generated files
Write-Host "`n📁 Checking generated files..." -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$generatedFiles = @(
    "$testDir\specs\spec.md",
    "$testDir\plans\plan-*.md",
    "$testDir\tasks\tasks-*.md",
    "$testDir\validation-reports\validation-report-*.md"
)

foreach ($pattern in $generatedFiles) {
    $files = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue
    if ($files) {
        Write-Host "   ✅ Found: $($files.Count) file(s) matching $pattern" -ForegroundColor Green
        foreach ($file in $files) {
            Write-Host "      - $($file.Name) ($($file.Length) bytes)" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  No files found matching: $pattern" -ForegroundColor Yellow
    }
}

# Display test directory contents
Write-Host "`n📂 Test Directory Contents:" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

Get-ChildItem -Path $testDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace($testDir, ".")
    $type = if ($_.PSIsContainer) { "📁" } else { "📄" }
    $size = if (-not $_.PSIsContainer) { " ($($_.Length) bytes)" } else { "" }
    Write-Host "   $type $relativePath$size" -ForegroundColor Gray
}

# Final summary
Write-Host "`n🎉 Local Testing Completed!" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green

if ($passedTests -eq $totalTests) {
    Write-Host "✅ All tests passed! Extension is ready for Azure DevOps deployment." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please review the errors above before deploying." -ForegroundColor Yellow
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review any failed tests" -ForegroundColor White
Write-Host "2. Fix any issues found" -ForegroundColor White
Write-Host "3. Run tests again if needed" -ForegroundColor White
Write-Host "4. Deploy to Azure DevOps when ready" -ForegroundColor White

Write-Host "`n🔍 Test files are available at: $testDir" -ForegroundColor Gray
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
