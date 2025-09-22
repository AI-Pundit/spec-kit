# Direct upload to Azure DevOps Services using REST API
# This bypasses the need for local Azure DevOps Server

param(
    [string]$VsixPath = "spec-kit.spec-kit-extension-1.0.0.vsix",
    [string]$Token = "D5wM2z4O9KXhkBFHreb98D8vIJGOjlgt5UGf0MAEpwFxvBb2RxD4JQQJ99BIACAAAAAuDpblAAASAZDO23Fj",
    [string]$Organization = "speckit"
)

Write-Host "🚀 Direct Upload to Azure DevOps Services" -ForegroundColor Green
Write-Host "Organization: $Organization" -ForegroundColor Cyan

# Check if VSIX file exists
if (-not (Test-Path $VsixPath)) {
    Write-Host "❌ VSIX file not found: $VsixPath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found VSIX file: $VsixPath" -ForegroundColor Green

# Set up headers
$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/octet-stream"
}

# API endpoint for uploading extensions
$apiUrl = "https://dev.azure.com/$Organization/_apis/gallery/extensions?api-version=6.0-preview"

Write-Host "📤 Uploading extension to: $apiUrl" -ForegroundColor Yellow

try {
    # Read the VSIX file as binary data
    $vsixBytes = [System.IO.File]::ReadAllBytes($VsixPath)
    
    # Upload the extension
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $vsixBytes
    
    Write-Host "✅ Extension uploaded successfully!" -ForegroundColor Green
    Write-Host "📋 Extension ID: $($response.extensionId)" -ForegroundColor Cyan
    Write-Host "📋 Publisher: $($response.publisher)" -ForegroundColor Cyan
    Write-Host "📋 Version: $($response.version)" -ForegroundColor Cyan
    
    # Try to install the extension
    Write-Host "🔧 Attempting to install extension..." -ForegroundColor Yellow
    
    $installUrl = "https://dev.azure.com/$Organization/_apis/gallery/extensions/$($response.publisher)/$($response.extensionId)/install?api-version=6.0-preview"
    $installResponse = Invoke-RestMethod -Uri $installUrl -Method Post -Headers $headers
    
    Write-Host "✅ Extension installed successfully!" -ForegroundColor Green
    Write-Host "🎉 You can now test the extension in your Azure DevOps organization!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error uploading extension:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to https://dev.azure.com/$Organization" -ForegroundColor White
Write-Host "2. Navigate to Organization Settings > Extensions" -ForegroundColor White
Write-Host "3. Look for Spec Kit extension" -ForegroundColor White
Write-Host "4. Install it in your projects" -ForegroundColor White
Write-Host "5. Create a pipeline to test the tasks" -ForegroundColor White