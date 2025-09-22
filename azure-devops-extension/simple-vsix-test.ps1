# Simple VSIX Test Script
Write-Host "Testing VSIX File: pundit-speckit-1.0.0.vsix" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Test 1: Check VSIX file exists
Write-Host "`n1. Checking VSIX file..." -ForegroundColor Yellow
if (Test-Path "pundit-speckit-1.0.0.vsix") {
    $vsixFile = Get-Item "pundit-speckit-1.0.0.vsix"
    $fileSizeKB = [math]::Round($vsixFile.Length / 1KB, 2)
    Write-Host "   ✓ VSIX file exists (Size: $fileSizeKB KB)" -ForegroundColor Green
} else {
    Write-Host "   ✗ VSIX file not found!" -ForegroundColor Red
    exit 1
}

# Test 2: Extract VSIX
Write-Host "`n2. Extracting VSIX..." -ForegroundColor Yellow
$extractPath = "vsix-test"
if (Test-Path $extractPath) {
    Remove-Item $extractPath -Recurse -Force
}

try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory("pundit-speckit-1.0.0.vsix", $extractPath)
    Write-Host "   ✓ VSIX extracted successfully" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed to extract VSIX: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Check manifest files
Write-Host "`n3. Checking manifest files..." -ForegroundColor Yellow
$manifestFiles = @("extension.vsixmanifest", "extension.vsomanifest")
foreach ($manifest in $manifestFiles) {
    $manifestPath = Join-Path $extractPath $manifest
    if (Test-Path $manifestPath) {
        Write-Host "   ✓ $manifest found" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $manifest missing!" -ForegroundColor Red
    }
}

# Test 4: Check task files
Write-Host "`n4. Checking task files..." -ForegroundColor Yellow
$taskDirs = @("constitution", "specify", "plan", "tasks", "validate-spec")
$validTasks = 0

foreach ($taskDir in $taskDirs) {
    $taskPath = Join-Path $extractPath "tasks\$taskDir"
    $taskJson = Join-Path $taskPath "task.json"
    $taskJs = Join-Path $taskPath "task.js"
    
    if ((Test-Path $taskJson) -and (Test-Path $taskJs)) {
        $taskSize = (Get-Item $taskJs).Length
        $taskSizeKB = [math]::Round($taskSize / 1KB, 2)
        Write-Host "   ✓ Task $taskDir (Size: $taskSizeKB KB)" -ForegroundColor Green
        $validTasks++
    } else {
        Write-Host "   ✗ Task $taskDir missing files" -ForegroundColor Red
    }
}

# Test 5: Check widget files
Write-Host "`n5. Checking widget files..." -ForegroundColor Yellow
$widgetFiles = @("ai-status.js", "spec-progress.js")
foreach ($widget in $widgetFiles) {
    $widgetPath = Join-Path $extractPath "widgets\$widget"
    if (Test-Path $widgetPath) {
        Write-Host "   ✓ Widget $widget found" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Widget $widget missing!" -ForegroundColor Red
    }
}

# Test 6: Check image files
Write-Host "`n6. Checking image files..." -ForegroundColor Yellow
$imageFiles = @("extension-icon.png", "screenshots\dashboard-widget.png", "screenshots\plan-task.png", "screenshots\specify-task.png")
foreach ($image in $imageFiles) {
    $imagePath = Join-Path $extractPath "images\$image"
    if (Test-Path $imagePath) {
        Write-Host "   ✓ Image $image found" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Image $image missing!" -ForegroundColor Red
    }
}

# Cleanup
Write-Host "`n7. Cleaning up..." -ForegroundColor Yellow
if (Test-Path $extractPath) {
    Remove-Item $extractPath -Recurse -Force
    Write-Host "   ✓ Cleanup complete" -ForegroundColor Green
}

# Results
Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host "VSIX Test Results:" -ForegroundColor Green
Write-Host "  File: pundit-speckit-1.0.0.vsix" -ForegroundColor White
Write-Host "  Size: $fileSizeKB KB" -ForegroundColor White
Write-Host "  Tasks: $validTasks/$($taskDirs.Count) valid" -ForegroundColor White

if ($validTasks -eq $taskDirs.Count) {
    Write-Host "`n🎉 VSIX file is ready for marketplace upload!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some issues found. Please review above." -ForegroundColor Yellow
}

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  1. Upload to Azure DevOps Marketplace" -ForegroundColor White
Write-Host "  2. Test in real Azure DevOps environment" -ForegroundColor White
Write-Host "  3. Verify tasks work in actual pipelines" -ForegroundColor White


