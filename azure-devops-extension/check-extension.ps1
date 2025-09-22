# Check Azure DevOps extension status
param(
    [string]$Token = "D5wM2z4O9KXhkBFHreb98D8vIJGOjlgt5UGf0MAEpwFxvBb2RxD4JQQJ99BIACAAAAAuDpblAAASAZDO23Fj",
    [string]$Organization = "speckit"
)

Write-Host "🔍 Checking Azure DevOps extension status..." -ForegroundColor Yellow

# Set up headers
$headers = @{
    "Authorization" = "Bearer $Token"
}

try {
    # Get list of extensions
    $apiUrl = "https://dev.azure.com/$Organization/_apis/gallery/extensions?api-version=6.0-preview"
    $response = Invoke-RestMethod -Uri $apiUrl -Method Get -Headers $headers
    
    Write-Host "✅ Successfully connected to Azure DevOps" -ForegroundColor Green
    Write-Host "📋 Extensions found: $($response.count)" -ForegroundColor Cyan
    
    if ($response.value) {
        Write-Host "`n📋 Available Extensions:" -ForegroundColor Yellow
        $response.value | ForEach-Object {
            Write-Host "  - $($_.displayName) (Publisher: $($_.publisher), ID: $($_.extensionId))" -ForegroundColor White
        }
        
        # Check if our extension is there
        $ourExtension = $response.value | Where-Object { $_.extensionId -eq "spec-kit-extension" -and $_.publisher -eq "spec-kit" }
        if ($ourExtension) {
            Write-Host "`n✅ Spec Kit extension found!" -ForegroundColor Green
            Write-Host "   Status: $($ourExtension.state)" -ForegroundColor Cyan
            Write-Host "   Version: $($ourExtension.version)" -ForegroundColor Cyan
        } else {
            Write-Host "`n❌ Spec Kit extension not found" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ No extensions found" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Error checking extensions:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}