# Simple Artifact Download Script
# This script lists and downloads artifacts from Azure DevOps pipeline runs

param(
    [Parameter(Mandatory=$false)]
    [string]$Organization,
    
    [Parameter(Mandatory=$false)]
    [string]$Project,
    
    [Parameter(Mandatory=$false)]
    [int]$RunId,
    
    [string]$DownloadPath = ".\downloaded-artifacts",
    
    [switch]$ListOnly
)

Write-Host "📦 Azure DevOps Artifact Manager" -ForegroundColor Green

# Function to get recent pipeline runs
function Get-RecentRuns {
    param([int]$top = 10)
    
    Write-Host "🔍 Getting recent pipeline runs..." -ForegroundColor Yellow
    try {
        $runs = az pipelines runs list --top $top -o json | ConvertFrom-Json
        
        if ($runs.Count -gt 0) {
            Write-Host "✅ Found $($runs.Count) recent runs:" -ForegroundColor Green
            $runs | ForEach-Object { 
                Write-Host "  Run ID: $($_.id) | State: $($_.state) | Result: $($_.result) | Created: $($_.createdDate)" -ForegroundColor Cyan 
            }
            return $runs
        } else {
            Write-Host "❌ No pipeline runs found" -ForegroundColor Red
            return @()
        }
    } catch {
        Write-Host "❌ Failed to get pipeline runs: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Function to list artifacts for a specific run
function Show-RunArtifacts {
    param([int]$runId)
    
    Write-Host "📋 Listing artifacts for run $runId..." -ForegroundColor Yellow
    try {
        $artifacts = az pipelines runs artifact list --run-id $runId -o json | ConvertFrom-Json
        
        if ($artifacts.Count -gt 0) {
            Write-Host "✅ Found $($artifacts.Count) artifacts:" -ForegroundColor Green
            foreach ($artifact in $artifacts) {
                Write-Host "  📄 Name: $($artifact.name)" -ForegroundColor Cyan
                Write-Host "     Type: $($artifact.resource.type)" -ForegroundColor Gray
                Write-Host "     Size: $($artifact.resource.properties.artifactsize) bytes" -ForegroundColor Gray
                Write-Host "" 
            }
            return $artifacts
        } else {
            Write-Host "❌ No artifacts found for run $runId" -ForegroundColor Red
            return @()
        }
    } catch {
        Write-Host "❌ Failed to list artifacts for run $runId" -ForegroundColor Red
        return @()
    }
}

# Function to download all artifacts from a run
function Get-AllArtifacts {
    param([int]$runId, [string]$downloadPath)
    
    Write-Host "⬇️  Downloading all artifacts from run $runId..." -ForegroundColor Yellow
    
    # Create download directory
    if (!(Test-Path $downloadPath)) {
        New-Item -ItemType Directory -Path $downloadPath -Force | Out-Null
        Write-Host "📁 Created directory: $downloadPath" -ForegroundColor Green
    }
    
    # Get artifacts list
    $artifacts = Show-RunArtifacts $runId
    
    if ($artifacts.Count -gt 0) {
        foreach ($artifact in $artifacts) {
            Write-Host "⬇️  Downloading: $($artifact.name)..." -ForegroundColor Yellow
            try {
                az pipelines runs artifact download --run-id $runId --artifact-name $artifact.name --path $downloadPath
                Write-Host "✅ Downloaded: $($artifact.name)" -ForegroundColor Green
            } catch {
                Write-Host "❌ Failed to download: $($artifact.name)" -ForegroundColor Red
            }
        }
        
        # Show downloaded files
        Write-Host "📁 Downloaded artifacts structure:" -ForegroundColor Cyan
        Get-ChildItem $downloadPath -Recurse | Select-Object FullName, Length | Format-Table -AutoSize
    }
}

# Main execution
try {
    # Set defaults if provided
    if ($Organization) {
        az devops configure --defaults organization=$Organization
        Write-Host "✅ Organization set to: $Organization" -ForegroundColor Green
    }
    
    if ($Project) {
        az devops configure --defaults project=$Project
        Write-Host "✅ Project set to: $Project" -ForegroundColor Green
    }
    
    if ($RunId) {
        # Work with specific run
        if ($ListOnly) {
            Show-RunArtifacts $RunId | Out-Null
        } else {
            Get-AllArtifacts $RunId $DownloadPath
        }
    } else {
        # Show recent runs and let user choose
        $runs = Get-RecentRuns 5
        
        if ($runs.Count -gt 0) {
            Write-Host ""
            Write-Host "💡 To download artifacts from a specific run, use:" -ForegroundColor Yellow
            Write-Host "   .\download-artifacts.ps1 -RunId <run_id> [-DownloadPath <path>]" -ForegroundColor Gray
            Write-Host ""
            Write-Host "💡 To list artifacts only, use:" -ForegroundColor Yellow
            Write-Host "   .\download-artifacts.ps1 -RunId <run_id> -ListOnly" -ForegroundColor Gray
            
            # Ask user to select a run
            Write-Host ""
            $selectedRunId = Read-Host "Enter Run ID to download artifacts (or press Enter to skip)"
            
            if ($selectedRunId -and $selectedRunId -match '^\d+$') {
                if ($ListOnly) {
                    Show-RunArtifacts ([int]$selectedRunId) | Out-Null
                } else {
                    Get-AllArtifacts ([int]$selectedRunId) $DownloadPath
                }
            }
        }
    }
    
} catch {
    Write-Host "❌ Script execution failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Artifact management completed!" -ForegroundColor Green