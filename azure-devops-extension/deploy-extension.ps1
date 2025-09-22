# Deploy Extension via CLI/REST API
# This script uploads the extension using REST API

Write-Host "🚀 Deploying AI Pundit Speckit Extension" -ForegroundColor Green

# Check for VSIX file
$vsixFile = "Waiin.pundit-speckit-1.0.2.vsix"
if (-not (Test-Path $vsixFile)) {
    Write-Host "❌ VSIX file not found: $vsixFile" -ForegroundColor Red
    Write-Host "Available files:" -ForegroundColor Yellow
    Get-ChildItem *.vsix | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }
    exit 1
}

$fullPath = (Get-Item $vsixFile).FullName
$fileSize = (Get-Item $vsixFile).Length
Write-Host "📦 Extension file: $vsixFile" -ForegroundColor Cyan
Write-Host "📁 Full path: $fullPath" -ForegroundColor Gray
Write-Host "📊 File size: $fileSize bytes" -ForegroundColor Gray

# Get authentication token
Write-Host "`n🔐 Authentication required..." -ForegroundColor Yellow
Write-Host "Please provide your Azure DevOps Personal Access Token:" -ForegroundColor Yellow
$secureToken = Read-Host "Token" -AsSecureString
$token = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken))

# Prepare headers
$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/octet-stream'
}

Write-Host "`n📤 Uploading extension to Azure DevOps marketplace..." -ForegroundColor Yellow

try {
    # Read the VSIX file
    $vsixBytes = [System.IO.File]::ReadAllBytes($fullPath)
    Write-Host "✅ File loaded successfully ($($vsixBytes.Length) bytes)" -ForegroundColor Green
    
    # Upload to Azure DevOps
    $response = Invoke-RestMethod -Uri 'https://extmgmt.dev.azure.com/_apis/gallery/extensions?api-version=6.0-preview' -Method Post -Headers $headers -Body $vsixBytes
    
    Write-Host "✅ Extension uploaded successfully!" -ForegroundColor Green
    Write-Host "`n📋 Extension Details:" -ForegroundColor Blue
    Write-Host "  Extension ID: $($response.extensionId)" -ForegroundColor Cyan
    Write-Host "  Display Name: $($response.displayName)" -ForegroundColor Cyan
    Write-Host "  Publisher: $($response.publisher.publisherName)" -ForegroundColor Cyan
    Write-Host "  Version: $($response.versions[0].version)" -ForegroundColor Cyan
    Write-Host "  Created: $($response.publishedDate)" -ForegroundColor Cyan
    
    # Show installation instructions
    Write-Host "`n🎯 Next Steps:" -ForegroundColor Green
    Write-Host "1. Go to your Azure DevOps organization: https://dev.azure.com/speckit" -ForegroundColor Gray
    Write-Host "2. Navigate to Organization Settings → Extensions" -ForegroundColor Gray
    Write-Host "3. Find 'AI Pundit Speckit' and click Install" -ForegroundColor Gray
    Write-Host "4. Select projects to install to and confirm" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Upload failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Handle specific error cases
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
        
        switch ($statusCode) {
            401 { 
                Write-Host "🔐 Authentication failed. Please check your Personal Access Token." -ForegroundColor Yellow
                Write-Host "   Make sure your token has 'Marketplace (publish)' scope." -ForegroundColor Yellow
            }
            400 { 
                Write-Host "📋 Bad request. Possible issues:" -ForegroundColor Yellow
                Write-Host "   - Extension with this ID already exists" -ForegroundColor Yellow
                Write-Host "   - Publisher 'Waiin' doesn't exist" -ForegroundColor Yellow
                Write-Host "   - Invalid VSIX file format" -ForegroundColor Yellow
            }
            409 { 
                Write-Host "🔄 Conflict. Extension already exists with this version." -ForegroundColor Yellow
                Write-Host "   Try incrementing the version in vss-extension.json and rebuilding." -ForegroundColor Yellow
            }
        }
        
        # Try to read response body for more details
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read response details" -ForegroundColor Gray
        }
    }
    
    Write-Host "`n💡 Alternative deployment methods:" -ForegroundColor Blue
    Write-Host "1. Use Azure DevOps web interface to upload manually" -ForegroundColor Gray
    Write-Host "2. Create publisher 'Waiin' first at https://marketplace.visualstudio.com/manage" -ForegroundColor Gray
    Write-Host "3. Check if extension already exists and needs version increment" -ForegroundColor Gray
}

Write-Host "`n✅ Deployment process completed!" -ForegroundColor Green