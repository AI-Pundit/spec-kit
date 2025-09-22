# 🚀 Step-by-Step Azure DevOps CLI Guide

This guide provides complete step-by-step instructions for using Azure DevOps CLI to upload extensions, run pipelines, and download artifacts.

## 📋 Prerequisites

- Azure CLI installed and configured
- Azure DevOps organization and project access
- Personal Access Token (PAT) with appropriate permissions
- VSIX file ready for upload

## 🔧 Step 1: Initial Setup and Authentication

### 1.1 Check Azure CLI Installation
```powershell
az --version
```

### 1.2 Install Azure DevOps Extension (if not already installed)
```powershell
az extension add --name azure-devops
```

### 1.3 Login to Azure DevOps
```powershell
az devops login
# Enter your Personal Access Token when prompted
```

### 1.4 Set Default Organization and Project
```powershell
# Replace with your actual organization and project
az devops configure --defaults organization=https://dev.azure.com/yourorg project=yourproject
```

## 📤 Step 2: Upload Extension Using Azure DevOps CLI

### 2.1 Run the Upload Script
```powershell
# Execute the prepared upload script
.\upload-with-azdevops-cli.ps1
```

### 2.2 Manual Upload (Alternative)
```powershell
# Direct command to upload extension
az devops extension upload --publisher spec-kit --extension-id spec-kit-extension --path spec-kit.spec-kit-extension-1.0.0.vsix
```

### 2.3 Verify Extension Upload
```powershell
# List installed extensions
az devops extension list --output table
```

## 🏗️ Step 3: Create and Run Test Pipeline

### 3.1 Verify Pipeline YAML File
Ensure `azure-pipelines.yml` exists in your current directory with the test configuration.

### 3.2 Create Pipeline (if it doesn't exist)
```powershell
# Create a new pipeline from the YAML file
az pipelines create --name "spec-kit-test-pipeline" --yml-path azure-pipelines.yml --repository . --repository-type tfsgit
```

### 3.3 Run the Pipeline
```powershell
# List existing pipelines to get the ID
az pipelines list --output table

# Run pipeline by ID (replace <pipeline-id> with actual ID)
az pipelines run --id <pipeline-id>
```

### 3.4 Use the Automated Script
```powershell
# Run the comprehensive pipeline management script
.\manage-pipeline-artifacts.ps1 -Organization "https://dev.azure.com/yourorg" -Project "yourproject"
```

## 📦 Step 4: List Pipeline Runs and Artifacts

### 4.1 List Recent Pipeline Runs
```powershell
# Get last 10 pipeline runs
az pipelines runs list --top 10 --output table
```

### 4.2 Get Specific Run Details
```powershell
# Get details for a specific run (replace <run-id> with actual ID)
az pipelines runs show --id <run-id>
```

### 4.3 List Artifacts for a Run
```powershell
# List all artifacts for a specific run
az pipelines runs artifact list --run-id <run-id> --output table
```

## ⬇️ Step 5: Download and Verify Artifacts

### 5.1 Using the Simple Download Script
```powershell
# Run the artifact download script
.\download-artifacts.ps1
```

### 5.2 Download Specific Artifacts
```powershell
# Download specific artifact from a run
az pipelines runs artifact download --run-id <run-id> --artifact-name "specs" --path "./artifacts"
az pipelines runs artifact download --run-id <run-id> --artifact-name "plans" --path "./artifacts"
az pipelines runs artifact download --run-id <run-id> --artifact-name "tasks" --path "./artifacts"
az pipelines runs artifact download --run-id <run-id> --artifact-name "validation-reports" --path "./artifacts"
```

### 5.3 Download All Artifacts from a Run
```powershell
# Use the download script with specific run ID
.\download-artifacts.ps1 -RunId <run-id> -DownloadPath "./my-artifacts"
```

### 5.4 List Only (without downloading)
```powershell
# Just list artifacts without downloading
.\download-artifacts.ps1 -RunId <run-id> -ListOnly
```

## 🔍 Step 6: Verify Generated Files

### 6.1 Check Downloaded Artifacts Structure
```powershell
# Navigate to the download directory
cd "./downloaded-artifacts"

# List the structure
Get-ChildItem -Recurse | Select-Object FullName, Length | Format-Table -AutoSize
```

### 6.2 Verify Expected Files
The artifacts should contain:

**specs/** - Specification files
- `spec.md` - Main specification file
- Other generated spec files

**plans/** - Implementation plan files  
- `plan.md` - Implementation plan
- Supporting plan documents

**tasks/** - Task list files
- `tasks.md` - Generated task list
- Task breakdown files

**validation-reports/** - Validation results
- Validation reports and analysis
- Error reports (if any)

### 6.3 Examine File Contents
```powershell
# View content of key files
Get-Content "./downloaded-artifacts/specs/spec.md"
Get-Content "./downloaded-artifacts/plans/plan.md"
Get-Content "./downloaded-artifacts/tasks/tasks.md"
```

## 🔧 Troubleshooting Commands

### Check Authentication Status
```powershell
az account show
az devops project list --top 1
```

### Debug Pipeline Issues
```powershell
# Get detailed run information with logs
az pipelines runs show --id <run-id> --output json
```

### Re-authenticate if Needed
```powershell
az devops logout
az devops login
```

### Check Extension Status
```powershell
# Verify extension is installed
az devops extension show --publisher-id spec-kit --extension-id spec-kit-extension
```

## 📊 Success Verification Checklist

### ✅ Extension Upload Success
- [ ] Extension appears in organization extensions list
- [ ] No upload errors in CLI output
- [ ] Extension version matches expected version

### ✅ Pipeline Execution Success  
- [ ] Pipeline runs without errors
- [ ] All tasks execute successfully
- [ ] Pipeline completes with success status

### ✅ Artifact Generation Success
- [ ] All expected artifacts are created
- [ ] Artifact sizes are reasonable (not empty)
- [ ] Files contain expected content
- [ ] No critical errors in generated files

### ✅ Download Verification Success
- [ ] All artifacts download successfully
- [ ] File structure matches expectations
- [ ] Content is readable and valid
- [ ] No corruption or encoding issues

## 🎯 Quick Commands Reference

```powershell
# Quick upload extension
az devops extension upload --publisher spec-kit --extension-id spec-kit-extension --path spec-kit.spec-kit-extension-1.0.0.vsix

# Quick run pipeline
az pipelines run --name "spec-kit-test-pipeline"

# Quick list recent runs
az pipelines runs list --top 5 --output table

# Quick download latest artifacts
$latestRun = (az pipelines runs list --top 1 --query "[0].id" -o tsv)
az pipelines runs artifact download --run-id $latestRun --artifact-name "specs" --path "./latest-artifacts"
```

## 📞 Getting Help

```powershell
# Get help for specific commands
az devops extension upload --help
az pipelines run --help
az pipelines runs artifact --help
```

---

**🎉 You're now ready to use Azure DevOps CLI for complete extension testing and artifact management!**