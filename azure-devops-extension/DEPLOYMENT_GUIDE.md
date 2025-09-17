# Azure DevOps Extension Deployment Guide

## 🚀 Deployment Options

### Option 1: Deploy to Your Organization (Recommended)

#### Step 1: Access Azure DevOps
1. Go to your Azure DevOps organization
2. Navigate to **Organization Settings** (gear icon)
3. Click on **Extensions** in the left sidebar
4. Click **Upload new extension**

#### Step 2: Upload the Extension
1. Click **Browse** and select `spec-kit.spec-kit-extension-1.0.0.vsix`
2. Click **Upload**
3. Wait for the upload to complete

#### Step 3: Install the Extension
1. Once uploaded, click **Install**
2. Select the projects where you want to use the extension
3. Click **Install** to confirm

#### Step 4: Verify Installation
1. Go to any project in your organization
2. Navigate to **Pipelines** → **Pipelines**
3. Create a new pipeline or edit existing one
4. You should see the Spec Kit tasks in the task catalog

### Option 2: Publish to Visual Studio Marketplace

#### Prerequisites
- Microsoft account
- Publisher account on Visual Studio Marketplace
- Payment method (for verification)

#### Step 1: Create Publisher Account
1. Go to [Visual Studio Marketplace](https://marketplace.visualstudio.com/)
2. Click **Publish extensions**
3. Sign in with your Microsoft account
4. Create a new publisher account
5. Note down your **Publisher ID**

#### Step 2: Update Extension Manifest
1. Edit `vss-extension.json`
2. Change the `publisher` field to your publisher ID
3. Update other metadata as needed

#### Step 3: Package and Upload
1. Run `npm run package` to create new .vsix file
2. Upload to Visual Studio Marketplace
3. Fill in the required information
4. Submit for review

## 🔧 Configuration After Deployment

### 1. Configure AI Assistant

#### For Claude Code
```bash
# Install Claude CLI
npm install -g @anthropic-ai/claude-cli
# Configure with your API key
claude auth
```

#### For GitHub Copilot
- Ensure you have GitHub Copilot subscription
- Install in VS Code or your preferred editor

#### For Gemini CLI
```bash
# Install Gemini CLI
pip install google-generativeai
# Configure with your API key
gemini auth
```

#### For Cursor
- Install Cursor IDE
- Configure with your Cursor account

### 2. Set Up Project Structure

#### Create Spec Directory
```bash
mkdir specs
mkdir plans
mkdir tasks
mkdir validation-reports
```

#### Initialize Spec Kit
```bash
# Install uv if not already installed
pip install uv

# Initialize spec-driven development
uvx --from git+https://github.com/github/spec-kit.git specify init my-project
```

### 3. Configure Azure DevOps Pipeline

#### Basic Pipeline Template
```yaml
# azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

variables:
  AI_ASSISTANT: 'copilot'  # or claude, gemini, cursor
  SCRIPT_TYPE: 'sh'        # or ps for PowerShell

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
    createWorkItems: true
    assignToTeam: true
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

# Step 5: Build and Test (your existing steps)
- script: |
    echo "Building application..."
    # Add your build commands here
  displayName: 'Build Application'

- script: |
    echo "Running tests..."
    # Add your test commands here
  displayName: 'Run Tests'
```

## 🎯 Testing the Extension

### 1. Test Individual Tasks

#### Test Specify Task
```yaml
- task: Specify@1
  displayName: 'Test Specify Task'
  inputs:
    projectName: 'test-project'
    aiAssistant: 'copilot'
    debugMode: true
```

#### Test Plan Task
```yaml
- task: Plan@1
  displayName: 'Test Plan Task'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    techStack: 'React with TypeScript'
    aiAssistant: 'copilot'
```

### 2. Verify Outputs

#### Check Generated Files
- Specifications in `specs/` directory
- Implementation plans in `plans/` directory
- Task lists in `tasks/` directory
- Validation reports in `validation-reports/` directory

#### Check Azure DevOps Variables
- `Specify.ProjectName`
- `Specify.ProjectPath`
- `Plan.OutputPath`
- `Tasks.OutputPath`
- `Validation.IsValid`

## 🔍 Troubleshooting

### Common Issues

#### 1. Extension Not Found
- **Solution**: Ensure extension is installed in the correct organization
- **Check**: Go to Organization Settings → Extensions

#### 2. Tasks Not Appearing
- **Solution**: Refresh the pipeline editor
- **Check**: Look for tasks in the task catalog

#### 3. Python/uv Not Found
- **Solution**: Install Python 3.11+ and uv
- **Check**: Add installation steps to your pipeline

#### 4. AI Assistant Not Working
- **Solution**: Configure AI assistant properly
- **Check**: Use `--ignore-agent-tools` flag if needed

### Debug Mode

Enable debug mode for detailed logging:
```yaml
- task: Specify@1
  inputs:
    debugMode: true
```

## 📊 Monitoring and Maintenance

### 1. Monitor Extension Usage
- Check Azure DevOps analytics
- Monitor task execution logs
- Track error rates and performance

### 2. Update Extension
- Update source code as needed
- Increment version number
- Repackage and redeploy

### 3. Gather Feedback
- Collect user feedback
- Monitor support requests
- Plan future enhancements

## 🎉 Success Criteria

### Extension is Successfully Deployed When:
- ✅ Extension appears in Azure DevOps organization
- ✅ Spec Kit tasks are available in pipeline editor
- ✅ Tasks execute without errors
- ✅ Generated files are created correctly
- ✅ AI assistant integration works
- ✅ Validation reports are generated

### Next Steps After Deployment:
1. **Train Team**: Educate team on spec-driven development
2. **Create Templates**: Develop organization-specific templates
3. **Monitor Usage**: Track adoption and effectiveness
4. **Iterate**: Improve based on feedback and usage patterns

## 📞 Support

### Resources
- **Extension Documentation**: README.md in the extension
- **Spec Kit Documentation**: https://github.com/github/spec-kit
- **Azure DevOps Extensions**: https://docs.microsoft.com/en-us/azure/devops/extend/

### Getting Help
- Check Azure DevOps pipeline logs
- Enable debug mode for detailed output
- Review extension documentation
- Contact support if needed
