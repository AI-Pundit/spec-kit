# Quick Start Demo Script
# This script demonstrates the complete Azure DevOps CLI workflow

param(
    [Parameter(Mandatory=$true)]
    [string]$Organization,
    
    [Parameter(Mandatory=$true)]
    [string]$Project,
    
    [switch]$SkipUpload,
    [switch]$SkipPipeline,
    [switch]$JustDownload
)

Write-Host "🚀 Azure DevOps CLI Quick Start Demo" -ForegroundColor Green
Write-Host "Organization: $Organization" -ForegroundColor Cyan
Write-Host "Project: $Project" -ForegroundColor Cyan

# Configure defaults
Write-Host "⚙️  Configuring Azure DevOps defaults..." -ForegroundColor Yellow
az devops configure --defaults organization=$Organization project=$Project

if (-not $JustDownload) {
    if (-not $SkipUpload) {
        # Step 1: Upload Extension
        Write-Host "`n📤 Step 1: Uploading Extension" -ForegroundColor Green
        $vsixFile = "spec-kit.spec-kit-extension-1.0.0.vsix"
        
        if (Test-Path $vsixFile) {
            Write-Host "Uploading $vsixFile..." -ForegroundColor Yellow
            try {
                az devops extension upload --publisher spec-kit --extension-id spec-kit-extension --path $vsixFile
                Write-Host "✅ Extension uploaded successfully!" -ForegroundColor Green
            } catch {
                Write-Host "❌ Extension upload failed: $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ VSIX file not found: $vsixFile" -ForegroundColor Red
        }
    }

    if (-not $SkipPipeline) {
        # Step 2: Create and Run Pipeline
        Write-Host "`n🏗️  Step 2: Creating and Running Pipeline" -ForegroundColor Green
        
        # Check if pipeline exists
        $pipelineName = "spec-kit-test-pipeline"
        $existingPipeline = az pipelines list --query "[?name=='$pipelineName'].id" -o tsv
        
        if ($existingPipeline) {
            Write-Host "Pipeline '$pipelineName' already exists with ID: $existingPipeline" -ForegroundColor Cyan
            $pipelineId = $existingPipeline
        } else {
            # Create new pipeline
            if (Test-Path "azure-pipelines.yml") {
                Write-Host "Creating new pipeline..." -ForegroundColor Yellow
                try {
                    $pipeline = az pipelines create --name $pipelineName --yml-path "azure-pipelines.yml" --repository . --repository-type tfsgit -o json | ConvertFrom-Json
                    $pipelineId = $pipeline.id
                    Write-Host "✅ Pipeline created with ID: $pipelineId" -ForegroundColor Green
                } catch {
                    Write-Host "❌ Pipeline creation failed: $($_.Exception.Message)" -ForegroundColor Red
                    $pipelineId = $null
                }
            } else {
                Write-Host "❌ azure-pipelines.yml not found" -ForegroundColor Red
                $pipelineId = $null
            }
        }
        
        # Run the pipeline
        if ($pipelineId) {
            Write-Host "Running pipeline..." -ForegroundColor Yellow
            try {
                $run = az pipelines run --id $pipelineId -o json | ConvertFrom-Json
                Write-Host "✅ Pipeline run started!" -ForegroundColor Green
                Write-Host "Run ID: $($run.id)" -ForegroundColor Cyan
                Write-Host "URL: $($run._links.web.href)" -ForegroundColor Blue
                
                # Store run ID for artifact download
                $runId = $run.id
                
                # Wait a bit for the run to progress
                Write-Host "⏱️  Waiting for pipeline to progress..." -ForegroundColor Yellow
                Start-Sleep 10
                
            } catch {
                Write-Host "❌ Pipeline run failed: $($_.Exception.Message)" -ForegroundColor Red
                $runId = $null
            }
        }
    }
} else {
    # Just download from existing runs
    Write-Host "`n📋 Listing recent pipeline runs for artifact download..." -ForegroundColor Green
}

# Step 3: List and Download Artifacts
Write-Host "`n📦 Step 3: Managing Artifacts" -ForegroundColor Green

# Get recent runs
Write-Host "Getting recent pipeline runs..." -ForegroundColor Yellow
$recentRuns = az pipelines runs list --top 5 -o json | ConvertFrom-Json

if ($recentRuns.Count -gt 0) {
    Write-Host "✅ Found $($recentRuns.Count) recent runs:" -ForegroundColor Green
    
    foreach ($run in $recentRuns) {
        Write-Host "  Run $($run.id): $($run.state) | $($run.result) | $($run.createdDate)" -ForegroundColor Cyan
        
        # Check for artifacts in completed runs
        if ($run.state -eq "completed") {
            Write-Host "    Checking artifacts..." -ForegroundColor Gray
            try {
                $artifacts = az pipelines runs artifact list --run-id $run.id -o json | ConvertFrom-Json
                if ($artifacts.Count -gt 0) {
                    Write-Host "    ✅ $($artifacts.Count) artifacts available" -ForegroundColor Green
                    
                    # Download artifacts from the first completed run with artifacts
                    if (-not $artifactsDownloaded) {
                        Write-Host "⬇️  Downloading artifacts from run $($run.id)..." -ForegroundColor Yellow
                        
                        $downloadPath = ".\quick-demo-artifacts"
                        if (!(Test-Path $downloadPath)) {
                            New-Item -ItemType Directory -Path $downloadPath -Force | Out-Null
                        }
                        
                        foreach ($artifact in $artifacts) {
                            try {
                                az pipelines runs artifact download --run-id $run.id --artifact-name $artifact.name --path $downloadPath
                                Write-Host "    ✅ Downloaded: $($artifact.name)" -ForegroundColor Green
                            } catch {
                                Write-Host "    ❌ Failed to download: $($artifact.name)" -ForegroundColor Red
                            }
                        }
                        
                        # Show what was downloaded
                        Write-Host "`n📁 Downloaded artifacts:" -ForegroundColor Cyan
                        Get-ChildItem $downloadPath -Recurse | Select-Object Name, Length | Format-Table -AutoSize
                        
                        $artifactsDownloaded = $true
                    }
                } else {
                    Write-Host "    ❌ No artifacts" -ForegroundColor Red
                }
            } catch {
                Write-Host "    ❌ Failed to check artifacts" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "❌ No pipeline runs found" -ForegroundColor Red
}

# Summary
Write-Host "`n🎉 Quick Start Demo Summary:" -ForegroundColor Green
Write-Host "✅ Azure DevOps CLI configured" -ForegroundColor Green
if (-not $SkipUpload) { Write-Host "✅ Extension upload attempted" -ForegroundColor Green }
if (-not $SkipPipeline) { Write-Host "✅ Pipeline creation/run attempted" -ForegroundColor Green }
Write-Host "✅ Artifact management demonstrated" -ForegroundColor Green

Write-Host "`n💡 Next steps:" -ForegroundColor Yellow
Write-Host "1. Check the Azure DevOps web interface for pipeline status" -ForegroundColor Gray
Write-Host "2. Review downloaded artifacts in the quick-demo-artifacts folder" -ForegroundColor Gray
Write-Host "3. Use the detailed scripts for more specific operations" -ForegroundColor Gray

Write-Host "`n📚 Available scripts:" -ForegroundColor Cyan
Write-Host "  .\upload-with-azdevops-cli.ps1 - Upload extension" -ForegroundColor Gray
Write-Host "  .\manage-pipeline-artifacts.ps1 - Full pipeline management" -ForegroundColor Gray
Write-Host "  .\download-artifacts.ps1 - Simple artifact download" -ForegroundColor Gray

Write-Host "`n✅ Demo completed!" -ForegroundColor Green