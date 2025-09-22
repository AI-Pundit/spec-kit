# Azure DevOps Pipeline and Artifact Management Script
# This script helps run pipelines and manage artifacts using Azure DevOps CLI

param(
    [Parameter(Mandatory=$true)]
    [string]$Organization,
    
    [Parameter(Mandatory=$true)]
    [string]$Project,
    
    [string]$PipelineName = "spec-kit-test-pipeline",
    
    [string]$DownloadPath = ".\artifacts"
)

Write-Host "🚀 Azure DevOps Pipeline and Artifact Management" -ForegroundColor Green
Write-Host "Organization: $Organization" -ForegroundColor Cyan
Write-Host "Project: $Project" -ForegroundColor Cyan
Write-Host "Pipeline: $PipelineName" -ForegroundColor Cyan

# Configure Azure DevOps defaults
Write-Host "⚙️  Configuring Azure DevOps defaults..." -ForegroundColor Yellow
az devops configure --defaults organization=$Organization project=$Project

# Function to check if pipeline exists
function Test-Pipeline {
    param($pipelineName)
    
    Write-Host "🔍 Checking if pipeline '$pipelineName' exists..." -ForegroundColor Yellow
    $pipelines = az pipelines list --query "[?name=='$pipelineName'].{id:id,name:name}" -o json | ConvertFrom-Json
    
    if ($pipelines.Count -gt 0) {
        Write-Host "✅ Pipeline found with ID: $($pipelines[0].id)" -ForegroundColor Green
        return $pipelines[0].id
    } else {
        Write-Host "❌ Pipeline '$pipelineName' not found" -ForegroundColor Red
        Write-Host "Available pipelines:" -ForegroundColor Yellow
        az pipelines list --query "[].{id:id,name:name}" -o table
        return $null
    }
}

# Function to create a new pipeline
function New-Pipeline {
    param($pipelineName, $yamlPath)
    
    Write-Host "📝 Creating new pipeline '$pipelineName'..." -ForegroundColor Yellow
    try {
        $pipeline = az pipelines create --name $pipelineName --yml-path $yamlPath --repository . --repository-type tfsgit -o json | ConvertFrom-Json
        Write-Host "✅ Pipeline created successfully with ID: $($pipeline.id)" -ForegroundColor Green
        return $pipeline.id
    } catch {
        Write-Host "❌ Failed to create pipeline: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to run a pipeline
function Start-Pipeline {
    param($pipelineId)
    
    Write-Host "▶️  Running pipeline with ID: $pipelineId..." -ForegroundColor Yellow
    try {
        $run = az pipelines run --id $pipelineId -o json | ConvertFrom-Json
        Write-Host "✅ Pipeline run started successfully!" -ForegroundColor Green
        Write-Host "Run ID: $($run.id)" -ForegroundColor Cyan
        Write-Host "Status: $($run.state)" -ForegroundColor Cyan
        Write-Host "URL: $($run._links.web.href)" -ForegroundColor Blue
        return $run.id
    } catch {
        Write-Host "❌ Failed to start pipeline: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to monitor pipeline run
function Watch-PipelineRun {
    param($runId)
    
    Write-Host "👀 Monitoring pipeline run $runId..." -ForegroundColor Yellow
    
    do {
        $run = az pipelines runs show --id $runId -o json | ConvertFrom-Json
        Write-Host "Status: $($run.state) | Result: $($run.result)" -ForegroundColor Cyan
        
        if ($run.state -eq "completed") {
            break
        }
        
        Start-Sleep 30
    } while ($true)
    
    Write-Host "🏁 Pipeline run completed with result: $($run.result)" -ForegroundColor Green
    return $run.result
}

# Function to list artifacts for a run
function Get-Artifacts {
    param($runId)
    
    Write-Host "📦 Listing artifacts for run $runId..." -ForegroundColor Yellow
    try {
        $artifacts = az pipelines runs artifact list --run-id $runId -o json | ConvertFrom-Json
        
        if ($artifacts.Count -gt 0) {
            Write-Host "✅ Found $($artifacts.Count) artifacts:" -ForegroundColor Green
            foreach ($artifact in $artifacts) {
                Write-Host "  - $($artifact.name) (Type: $($artifact.resource.type))" -ForegroundColor Cyan
            }
            return $artifacts
        } else {
            Write-Host "❌ No artifacts found for this run" -ForegroundColor Red
            return @()
        }
    } catch {
        Write-Host "❌ Failed to list artifacts: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Function to download artifacts
function Get-ArtifactDownload {
    param($runId, $artifactName, $downloadPath)
    
    Write-Host "⬇️  Downloading artifact '$artifactName' to '$downloadPath'..." -ForegroundColor Yellow
    
    # Create download directory if it doesn't exist
    if (!(Test-Path $downloadPath)) {
        New-Item -ItemType Directory -Path $downloadPath -Force | Out-Null
        Write-Host "📁 Created download directory: $downloadPath" -ForegroundColor Green
    }
    
    try {
        az pipelines runs artifact download --run-id $runId --artifact-name $artifactName --path $downloadPath
        Write-Host "✅ Artifact '$artifactName' downloaded successfully!" -ForegroundColor Green
        
        # List downloaded files
        $artifactPath = Join-Path $downloadPath $artifactName
        if (Test-Path $artifactPath) {
            Write-Host "📄 Downloaded files:" -ForegroundColor Cyan
            Get-ChildItem $artifactPath -Recurse | ForEach-Object { Write-Host "  - $($_.FullName)" -ForegroundColor Gray }
        }
    } catch {
        Write-Host "❌ Failed to download artifact '$artifactName': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Main execution
try {
    # Check if pipeline exists
    $pipelineId = Test-Pipeline $PipelineName
    
    if (-not $pipelineId) {
        # Create pipeline if it doesn't exist
        $yamlPath = "azure-pipelines.yml"
        if (Test-Path $yamlPath) {
            $pipelineId = New-Pipeline $PipelineName $yamlPath
        } else {
            Write-Host "❌ Pipeline YAML file not found: $yamlPath" -ForegroundColor Red
            exit 1
        }
    }
    
    if ($pipelineId) {
        # Run the pipeline
        $runId = Start-Pipeline $pipelineId
        
        if ($runId) {
            # Monitor the run
            $result = Watch-PipelineRun $runId
            
            # List and download artifacts regardless of result
            $artifacts = Get-Artifacts $runId
            
            if ($artifacts.Count -gt 0) {
                Write-Host "📥 Downloading all artifacts..." -ForegroundColor Yellow
                foreach ($artifact in $artifacts) {
                    Get-ArtifactDownload $runId $artifact.name $DownloadPath
                }
                
                Write-Host "🎉 All artifacts downloaded to: $DownloadPath" -ForegroundColor Green
            }
        }
    }
    
} catch {
    Write-Host "❌ Script execution failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Script completed successfully!" -ForegroundColor Green