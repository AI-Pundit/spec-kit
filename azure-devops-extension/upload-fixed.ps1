# Fixed PowerShell script for uploading Azure DevOps extension
param(
    [string]$VsixPath = "spec-kit.spec-kit-extension-1.0.0.vsix",
    [string]$Token = "D5wM2z4O9KXhkBFHreb98D8vIJGOjlgt5UGf0MAEpwFxvBb2RxD4JQQJ99BIACAAAAAuDpblAAASAZDO23Fj",
    [string]$Organization = "speckit"
)

Write-Host "🚀 Uploading Azure DevOps Extension" -ForegroundColor Green
Write-Host "Organization: $Organization" -ForegroundColor Cyan
Write-Host "VSIX File: $VsixPath" -ForegroundColor Cyan

# Check if VSIX file exists
if (-not (Test-Path $VsixPath)) {
    Write-Host "❌ VSIX file not found: $VsixPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ VSIX file found" -ForegroundColor Green

# Set up headers
$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/octet-stream"
}

# API endpoint
$apiUrl = "https://dev.azure.com/$Organization/_apis/gallery/extensions?api-version=6.0-preview"

Write-Host "📤 Uploading to: $apiUrl" -ForegroundColor Yellow

try {
    # Read VSIX file
    Write-Host "📖 Reading VSIX file..." -ForegroundColor Yellow
    $vsixBytes = [System.IO.File]::ReadAllBytes($VsixPath)
    Write-Host "✅ File read successfully (Size: $($vsixBytes.Length) bytes)" -ForegroundColor Green
    
    # Upload extension
    Write-Host "📤 Uploading extension..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $vsixBytes
    
    Write-Host "✅ Extension uploaded successfully!" -ForegroundColor Green
    Write-Host "📋 Extension ID: $($response.extensionId)" -ForegroundColor Cyan
    Write-Host "📋 Publisher: $($response.publisher)" -ForegroundColor Cyan
    Write-Host "📋 Version: $($response.version)" -ForegroundColor Cyan
    
    # Try to install
    Write-Host "🔧 Installing extension..." -ForegroundColor Yellow
    $installUrl = "https://dev.azure.com/$Organization/_apis/gallery/extensions/$($response.publisher)/$($response.extensionId)/install?api-version=6.0-preview"
    $installResponse = Invoke-RestMethod -Uri $installUrl -Method Post -Headers $headers
    
    Write-Host "✅ Extension installed successfully!" -ForegroundColor Green
    Write-Host "🎉 Extension is ready to use!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://dev.azure.com/$Organization" -ForegroundColor White
Write-Host "2. Organization Settings > Extensions" -ForegroundColor White
Write-Host "3. Find and install the extension" -ForegroundColor White
Write-Host "4. Test in a pipeline" -ForegroundColor White

