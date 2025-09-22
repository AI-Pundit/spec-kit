# 🚀 Local VSIX Testing Guide for Azure DevOps Extension

## 📋 Overview

This guide provides step-by-step instructions for testing your Azure DevOps extension locally before uploading to Azure DevOps. Testing locally saves time, reduces uploads, and helps debug issues quickly.

## 🎯 Prerequisites

### Required Software
- **Node.js 16+** - For running the extension
- **Python 3.11+** - For Spec Kit CLI
- **uv package manager** - For Python dependency management
- **Azure DevOps CLI** (optional) - For advanced testing

### Installation Commands
```bash
# Install Node.js (if not already installed)
# Download from https://nodejs.org/

# Install Python 3.11+ (if not already installed)
# Download from https://python.org/

# Install uv
pip install uv

# Install Azure DevOps CLI (optional)
npm install -g @microsoft/azure-devops-cli-extension
```

## 🔧 Step 1: Build and Package the Extension

### 1.1 Navigate to Extension Directory
```bash
cd azure-devops-extension
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Build the Extension
```bash
npm run build
```

### 1.4 Package the Extension
```bash
npm run package
```

This creates a `.vsix` file (e.g., `spec-kit.spec-kit-extension-1.0.0.vsix`)

## 🧪 Step 2: Local Testing Methods

### Method 1: Direct Node.js Testing (Recommended)

#### 2.1 Create Test Environment
```bash
# Create test directory
mkdir -p /tmp/azure-devops-test
cd /tmp/azure-devops-test

# Create project structure
mkdir -p specs plans tasks validation-reports output
```

#### 2.2 Set Environment Variables
```bash
# Set required environment variables
export INPUT_PROJECTNAME="test-project"
export INPUT_PROJECTPATH="/tmp/azure-devops-test"
export INPUT_AASSISTANT="copilot"
export INPUT_SCRIPTTYPE="sh"
export INPUT_SPECPATH="/tmp/azure-devops-test/specs"
export INPUT_TECHSTACK="React with TypeScript, Node.js backend"
export INPUT_PLANPATH="/tmp/azure-devops-test/plans"
export INPUT_SPECFILE="spec.md"
export INPUT_PLANFILE="plan.md"
export INPUT_OUTPUTPATH="/tmp/azure-devops-test/output"
export INPUT_FAILONERROR="true"
export INPUT_VALIDATEPLAN="true"
export INPUT_CREATEWORKITEMS="false"
export INPUT_ASSIGNTOTEAM="false"
export INPUT_DEBUGMODE="true"
```

#### 2.3 Create Sample Specification
```bash
cat > specs/spec.md << 'EOF'
# Test Specification

## Overview
This is a test specification for local testing of the Azure DevOps extension.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality
- As a tester, I want to ensure proper output generation

## Functional Requirements
- The system should work locally without Azure DevOps
- The system should generate proper specification files
- The system should create implementation plans
- The system should generate task lists
- The system should validate specifications

## Technical Requirements
- Python 3.11+ with uv package manager
- Node.js 16+ for extension execution
- AI assistant integration (Claude, Gemini, Copilot, or Cursor)

## Acceptance Criteria
- Given a test specification
- When the extension runs locally
- Then it should generate a plan and tasks
- And it should create validation reports
- And it should handle errors gracefully
EOF
```

#### 2.4 Test Individual Tasks
```bash
# Test Specify Task
echo "🔧 Testing Specify Task..."
node /path/to/azure-devops-extension/dist/tasks/specify/task.js
if [ $? -eq 0 ]; then
    echo "✅ Specify Task passed"
else
    echo "❌ Specify Task failed"
fi

# Test Plan Task
echo "🔧 Testing Plan Task..."
node /path/to/azure-devops-extension/dist/tasks/plan/task.js
if [ $? -eq 0 ]; then
    echo "✅ Plan Task passed"
else
    echo "❌ Plan Task failed"
fi

# Test Tasks Task
echo "🔧 Testing Tasks Task..."
node /path/to/azure-devops-extension/dist/tasks/tasks/task.js
if [ $? -eq 0 ]; then
    echo "✅ Tasks Task passed"
else
    echo "❌ Tasks Task failed"
fi

# Test ValidateSpec Task
echo "🔧 Testing ValidateSpec Task..."
node /path/to/azure-devops-extension/dist/tasks/validate-spec/task.js
if [ $? -eq 0 ]; then
    echo "✅ ValidateSpec Task passed"
else
    echo "❌ ValidateSpec Task failed"
fi
```

### Method 2: PowerShell Testing (Windows)

#### 2.1 Create PowerShell Test Script
```powershell
# test-extension.ps1
Write-Host "🧪 Testing Azure DevOps Extension Locally" -ForegroundColor Green

# Create test environment
$testDir = "C:\temp\azure-devops-test"
New-Item -ItemType Directory -Path $testDir -Force
New-Item -ItemType Directory -Path "$testDir\specs" -Force
New-Item -ItemType Directory -Path "$testDir\plans" -Force
New-Item -ItemType Directory -Path "$testDir\tasks" -Force
New-Item -ItemType Directory -Path "$testDir\validation-reports" -Force
New-Item -ItemType Directory -Path "$testDir\output" -Force

# Set environment variables
$env:INPUT_PROJECTNAME = "test-project"
$env:INPUT_PROJECTPATH = $testDir
$env:INPUT_AASSISTANT = "copilot"
$env:INPUT_SCRIPTTYPE = "ps"
$env:INPUT_SPECPATH = "$testDir\specs"
$env:INPUT_TECHSTACK = "React with TypeScript, Node.js backend"
$env:INPUT_PLANPATH = "$testDir\plans"
$env:INPUT_SPECFILE = "spec.md"
$env:INPUT_PLANFILE = "plan.md"
$env:INPUT_OUTPUTPATH = "$testDir\output"
$env:INPUT_FAILONERROR = "true"
$env:INPUT_VALIDATEPLAN = "true"
$env:INPUT_CREATEWORKITEMS = "false"
$env:INPUT_ASSIGNTOTEAM = "false"
$env:INPUT_DEBUGMODE = "true"

# Create sample specification
$specContent = @"
# Test Specification

## Overview
This is a test specification for local testing of the Azure DevOps extension.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality

## Functional Requirements
- The system should work locally
- The system should generate proper outputs

## Acceptance Criteria
- Given a test specification
- When the extension runs
- Then it should generate a plan and tasks
"@

$specContent | Out-File -FilePath "$testDir\specs\spec.md" -Encoding UTF8

Write-Host "✅ Test environment created" -ForegroundColor Green

# Test tasks
$extensionPath = "C:\path\to\azure-devops-extension\dist\tasks"

# Test Specify Task
Write-Host "🔧 Testing Specify Task..." -ForegroundColor Yellow
node "$extensionPath\specify\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Specify Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ Specify Task failed" -ForegroundColor Red
}

# Test Plan Task
Write-Host "🔧 Testing Plan Task..." -ForegroundColor Yellow
node "$extensionPath\plan\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Plan Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ Plan Task failed" -ForegroundColor Red
}

# Test Tasks Task
Write-Host "🔧 Testing Tasks Task..." -ForegroundColor Yellow
node "$extensionPath\tasks\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tasks Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ Tasks Task failed" -ForegroundColor Red
}

# Test ValidateSpec Task
Write-Host "🔧 Testing ValidateSpec Task..." -ForegroundColor Yellow
node "$extensionPath\validate-spec\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ValidateSpec Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ ValidateSpec Task failed" -ForegroundColor Red
}

Write-Host "🎉 Local testing completed!" -ForegroundColor Green
```

#### 2.2 Run PowerShell Test
```powershell
# Execute the test script
.\test-extension.ps1
```

## 🔍 Step 3: Verify Test Results

### 3.1 Check Generated Files
```bash
# Check what was generated
ls -la /tmp/azure-devops-test/
ls -la /tmp/azure-devops-test/specs/
ls -la /tmp/azure-devops-test/plans/
ls -la /tmp/azure-devops-test/tasks/
ls -la /tmp/azure-devops-test/validation-reports/
ls -la /tmp/azure-devops-test/output/
```

### 3.2 Expected Outputs
After successful testing, you should see:
- **Specify Task**: Project initialization files and configuration
- **Plan Task**: Implementation plan files in `plans/` directory
- **Tasks Task**: Task list files in `tasks/` directory
- **ValidateSpec Task**: Validation reports in `validation-reports/` directory

### 3.3 Check Logs
```bash
# Check for any error logs
cat /tmp/azure-devops-test/*.log 2>/dev/null || echo "No log files found"

# Check console output for errors
echo "Check the console output above for any error messages"
```

## 🚀 Step 4: Upload to Azure DevOps

### 4.1 Prepare for Upload
```bash
# Ensure you have the latest .vsix file
ls -la *.vsix

# Verify the file size (should be reasonable, not too large)
du -h *.vsix
```

### 4.2 Upload to Azure DevOps

#### Option A: Through Azure DevOps Web Interface
1. Go to your Azure DevOps organization
2. Navigate to **Organization Settings** (gear icon)
3. Click on **Extensions** in the left sidebar
4. Click **Upload new extension**
5. Select your `.vsix` file
6. Click **Upload**
7. Once uploaded, click **Install**
8. Select the projects where you want to use the extension
9. Click **Install** to confirm

#### Option B: Using Azure DevOps CLI
```bash
# Login to Azure DevOps
az devops login

# Upload extension
az extension add --name azure-devops
az devops extension upload --publisher spec-kit --extension-id spec-kit-extension --path spec-kit.spec-kit-extension-1.0.0.vsix
```

### 4.3 Verify Installation
1. Go to any project in your organization
2. Navigate to **Pipelines** → **Pipelines**
3. Create a new pipeline or edit existing one
4. You should see the Spec Kit tasks in the task catalog:
   - **Specify**
   - **Plan**
   - **Tasks**
   - **ValidateSpec**

## 🧪 Step 5: Test in Azure DevOps Pipeline

### 5.1 Create Test Pipeline
```yaml
# azure-pipelines.yml
trigger: none

pool:
  vmImage: 'ubuntu-latest'

variables:
  AI_ASSISTANT: 'copilot'
  SCRIPT_TYPE: 'sh'

steps:
# Step 1: Initialize Spec-Driven Development
- task: Specify@1
  displayName: 'Initialize Spec-Driven Development'
  inputs:
    projectName: '$(Build.Repository.Name)'
    projectPath: '$(Build.SourcesDirectory)'
    aiAssistant: '$(AI_ASSISTANT)'
    scriptType: '$(SCRIPT_TYPE)'
    specifyVersion: 'latest'
    skipGit: false
    ignoreAgentTools: false
    debugMode: true

# Step 2: Generate Implementation Plan
- task: Plan@1
  displayName: 'Generate Implementation Plan'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    specFile: 'spec.md'
    techStack: 'The application uses React with TypeScript, Node.js backend, and PostgreSQL database.'
    architecture: 'Microservices architecture with API Gateway'
    aiAssistant: '$(AI_ASSISTANT)'
    outputPath: '$(Build.SourcesDirectory)/plans'
    validatePlan: true

# Step 3: Generate Task List
- task: Tasks@1
  displayName: 'Generate Task List'
  inputs:
    planPath: '$(Build.SourcesDirectory)/plans'
    planFile: 'plan.md'
    aiAssistant: '$(AI_ASSISTANT)'
    createWorkItems: false
    assignToTeam: false
    outputPath: '$(Build.SourcesDirectory)/tasks'

# Step 4: Validate Specifications
- task: ValidateSpec@1
  displayName: 'Validate Specifications'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    specFile: 'spec.md'
    failOnError: true
    generateReport: true
    outputPath: '$(Build.SourcesDirectory)/validation-reports'

# Step 5: Display Results
- script: |
    echo "=== Generated Files ==="
    find $(Build.SourcesDirectory) -name "*.md" -type f | head -20
    echo "=== Specs Directory ==="
    ls -la $(Build.SourcesDirectory)/specs/ || echo "No specs directory"
    echo "=== Plans Directory ==="
    ls -la $(Build.SourcesDirectory)/plans/ || echo "No plans directory"
    echo "=== Tasks Directory ==="
    ls -la $(Build.SourcesDirectory)/tasks/ || echo "No tasks directory"
    echo "=== Validation Reports ==="
    ls -la $(Build.SourcesDirectory)/validation-reports/ || echo "No validation reports"
  displayName: 'Display Generated Files'
```

### 5.2 Run the Pipeline
1. Save the pipeline
2. Click **Run pipeline**
3. Monitor the execution
4. Check the logs for any errors
5. Verify the generated files in the artifacts

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Extension Not Found in Azure DevOps
**Problem**: Tasks don't appear in the task catalog
**Solutions**:
- Ensure extension is installed in the correct organization
- Check if extension is enabled for the project
- Refresh the pipeline editor
- Verify the extension ID matches the manifest

#### 2. Python/uv Not Found
**Problem**: Tasks fail with "Python not found" or "uv not found"
**Solutions**:
```yaml
# Add Python installation step to pipeline
- task: UsePythonVersion@0
  inputs:
    versionSpec: '3.11'
    addToPath: true

# Install uv
- script: |
    pip install uv
  displayName: 'Install uv'
```

#### 3. AI Assistant Not Working
**Problem**: AI assistant integration fails
**Solutions**:
- Use `--ignore-agent-tools` flag if needed
- Check AI assistant configuration
- Verify API keys are set correctly
- Test with different AI assistants

#### 4. File Permission Issues
**Problem**: Cannot create or write files
**Solutions**:
```yaml
# Add file permission step
- script: |
    chmod -R 755 $(Build.SourcesDirectory)
  displayName: 'Set File Permissions'
```

#### 5. Module Not Found Errors
**Problem**: Node.js modules not found
**Solutions**:
```bash
# Rebuild the extension
npm run clean
npm install
npm run build
npm run package
```

### Debug Mode
Enable debug mode for detailed logging:
```yaml
- task: Specify@1
  inputs:
    debugMode: true
```

## 📊 Success Criteria

### Local Testing Success
- ✅ All tasks execute without errors
- ✅ Generated files are created correctly
- ✅ File structure matches expectations
- ✅ No critical errors in logs

### Azure DevOps Testing Success
- ✅ Extension appears in task catalog
- ✅ Tasks execute in pipeline
- ✅ Generated files are accessible
- ✅ Pipeline completes successfully
- ✅ No permission or access issues

## 🎯 Next Steps

### After Successful Testing
1. **Document Issues**: Note any problems encountered
2. **Fix Bugs**: Address any issues found during testing
3. **Update Documentation**: Update guides based on findings
4. **Prepare for Production**: Plan for wider deployment
5. **Gather Feedback**: Collect feedback from early users

### Production Deployment
1. **Version Management**: Increment version numbers
2. **Release Notes**: Document changes and improvements
3. **User Training**: Provide training materials
4. **Monitoring**: Set up monitoring and analytics
5. **Support**: Establish support channels

## 📞 Support and Resources

### Documentation
- **Extension README**: `azure-devops-extension/README.md`
- **Deployment Guide**: `azure-devops-extension/DEPLOYMENT_GUIDE.md`
- **Local Testing**: `azure-devops-extension/local-testing-setup.md`

### Getting Help
- Check Azure DevOps pipeline logs
- Enable debug mode for detailed output
- Review extension documentation
- Test locally before uploading
- Contact support if needed

---

**Ready to test your extension? Start with local testing, then move to Azure DevOps!** 🚀


