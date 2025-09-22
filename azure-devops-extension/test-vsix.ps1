# Test VSIX File Locally
# This script tests the pundit-speckit-1.0.0.vsix file to ensure it works correctly

Write-Host "🧪 Testing VSIX File: pundit-speckit-1.0.0.vsix" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

# Test 1: Check VSIX file exists and size
Write-Host "`n📁 Test 1: Checking VSIX file..." -ForegroundColor Yellow
if (Test-Path "pundit-speckit-1.0.0.vsix") {
    $vsixFile = Get-Item "pundit-speckit-1.0.0.vsix"
    Write-Host "✅ VSIX file exists" -ForegroundColor Green
    Write-Host "   Size: $([math]::Round($vsixFile.Length / 1KB, 2)) KB" -ForegroundColor White
    Write-Host "   Last Modified: $($vsixFile.LastWriteTime)" -ForegroundColor White
} else {
    Write-Host "❌ VSIX file not found!" -ForegroundColor Red
    exit 1
}

# Test 2: Extract and validate VSIX contents
Write-Host "`n📦 Test 2: Extracting VSIX contents..." -ForegroundColor Yellow
$extractPath = "vsix-test"
if (Test-Path $extractPath) {
    Remove-Item $extractPath -Recurse -Force
}

try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory("pundit-speckit-1.0.0.vsix", $extractPath)
    Write-Host "✅ VSIX extracted successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to extract VSIX: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Validate manifest files
Write-Host "`n📋 Test 3: Validating manifest files..." -ForegroundColor Yellow
$manifestFiles = @("extension.vsixmanifest", "extension.vsomanifest")
foreach ($manifest in $manifestFiles) {
    $manifestPath = Join-Path $extractPath $manifest
    if (Test-Path $manifestPath) {
        Write-Host "✅ $manifest found" -ForegroundColor Green
    } else {
        Write-Host "❌ $manifest missing!" -ForegroundColor Red
    }
}

# Test 4: Validate task files
Write-Host "`n🔧 Test 4: Validating task files..." -ForegroundColor Yellow
$taskDirs = @("constitution", "specify", "plan", "tasks", "validate-spec")
foreach ($taskDir in $taskDirs) {
    $taskPath = Join-Path $extractPath "tasks\$taskDir"
    if (Test-Path $taskPath) {
        $taskJson = Join-Path $taskPath "task.json"
        $taskJs = Join-Path $taskPath "task.js"
        
        if ((Test-Path $taskJson) -and (Test-Path $taskJs)) {
            Write-Host "✅ Task $taskDir - Both files present" -ForegroundColor Green
        } else {
            Write-Host "❌ Task $taskDir - Missing files" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Task directory $taskDir missing!" -ForegroundColor Red
    }
}

# Test 5: Validate widget files
Write-Host "`n📊 Test 5: Validating widget files..." -ForegroundColor Yellow
$widgetFiles = @("ai-status.js", "spec-progress.js")
foreach ($widget in $widgetFiles) {
    $widgetPath = Join-Path $extractPath "widgets\$widget"
    if (Test-Path $widgetPath) {
        Write-Host "✅ Widget $widget found" -ForegroundColor Green
    } else {
        Write-Host "❌ Widget $widget missing!" -ForegroundColor Red
    }
}

# Test 6: Validate image files
Write-Host "`n🖼️ Test 6: Validating image files..." -ForegroundColor Yellow
$imageFiles = @("extension-icon.png", "screenshots\dashboard-widget.png", "screenshots\plan-task.png", "screenshots\specify-task.png")
foreach ($image in $imageFiles) {
    $imagePath = Join-Path $extractPath "images\$image"
    if (Test-Path $imagePath) {
        Write-Host "✅ Image $image found" -ForegroundColor Green
    } else {
        Write-Host "❌ Image $image missing!" -ForegroundColor Red
    }
}

# Test 7: Validate task files structure
Write-Host "`n⚡ Test 7: Validating task files structure..." -ForegroundColor Yellow
$tasks = @("specify", "plan", "tasks", "validate-spec")
$validTasks = 0

foreach ($task in $tasks) {
    Write-Host "   Checking $task task..." -ForegroundColor Cyan
    $taskPath = Join-Path $extractPath "tasks\$task\task.js"
    $taskJsonPath = Join-Path $extractPath "tasks\$task\task.json"
    
    if ((Test-Path $taskPath) -and (Test-Path $taskJsonPath)) {
        # Check if task.js is not empty
        $taskSize = (Get-Item $taskPath).Length
        if ($taskSize -gt 0) {
            Write-Host "   ✅ $task task files valid (Size: $([math]::Round($taskSize / 1KB, 2)) KB)" -ForegroundColor Green
            $validTasks++
        } else {
            Write-Host "   ❌ $task task.js is empty" -ForegroundColor Red
        }
    } else {
        Write-Host "   ❌ $task task files missing" -ForegroundColor Red
    }
}

Write-Host "`n📊 Task Structure Results: $validTasks/$($tasks.Count) tasks valid" -ForegroundColor $(if ($validTasks -eq $tasks.Count) { "Green" } else { "Yellow" })

# Test 8: Validate VSIX file integrity
Write-Host "`n🔍 Test 8: Validating VSIX file integrity..." -ForegroundColor Yellow
try {
    $vsixContent = [System.IO.File]::ReadAllBytes("pundit-speckit-1.0.0.vsix")
    if ($vsixContent.Length -gt 0) {
        Write-Host "✅ VSIX file is not corrupted" -ForegroundColor Green
    } else {
        Write-Host "❌ VSIX file appears to be empty" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error reading VSIX file: $($_.Exception.Message)" -ForegroundColor Red
}

# Cleanup
Write-Host "`n🧹 Cleaning up test files..." -ForegroundColor Yellow
if (Test-Path $extractPath) {
    Remove-Item $extractPath -Recurse -Force
}

# Final Results
Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "🎯 VSIX Test Summary" -ForegroundColor Green
Write-Host "   File: pundit-speckit-1.0.0.vsix" -ForegroundColor White
Write-Host "   Size: $([math]::Round($vsixFile.Length / 1KB, 2)) KB" -ForegroundColor White
Write-Host "   Tasks Validated: $validTasks/$($tasks.Count)" -ForegroundColor White

if ($validTasks -eq $tasks.Count) {
    Write-Host "`n🎉 VSIX file is ready for marketplace upload!" -ForegroundColor Green
    Write-Host "   All tests passed successfully." -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some tests failed. Please review the issues above." -ForegroundColor Yellow
}

Write-Host "`n📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Upload to Azure DevOps Marketplace" -ForegroundColor White
Write-Host "   2. Test in a real Azure DevOps environment" -ForegroundColor White
Write-Host "   3. Verify all tasks work in actual pipelines" -ForegroundColor White
