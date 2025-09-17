# 🚀 Azure DevOps Extension Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Azure DevOps Access**
- [ ] Have access to Azure DevOps organization
- [ ] Admin permissions to install extensions
- [ ] Organization URL ready

### 2. **Extension Package**
- [x] Extension packaged successfully (`spec-kit.spec-kit-extension-1.0.0.vsix`)
- [x] All tasks implemented and tested
- [x] Documentation complete

### 3. **Environment Setup**
- [ ] Python 3.11+ installed
- [ ] uv package manager installed
- [ ] AI assistant configured (Claude/Gemini/Copilot/Cursor)
- [ ] Git configured

## 🚀 Deployment Steps

### **Step 1: Upload Extension to Azure DevOps**

1. **Access Azure DevOps**
   - Go to your Azure DevOps organization
   - Click on **Organization Settings** (gear icon)
   - Navigate to **Extensions** in the left sidebar

2. **Upload Extension**
   - Click **Upload new extension**
   - Select `spec-kit.spec-kit-extension-1.0.0.vsix`
   - Click **Upload**
   - Wait for upload to complete

3. **Install Extension**
   - Click **Install** after upload
   - Select projects where you want to use the extension
   - Click **Install** to confirm

### **Step 2: Verify Installation**

1. **Check Extension Availability**
   - Go to any project in your organization
   - Navigate to **Pipelines** → **Pipelines**
   - Create a new pipeline or edit existing one
   - Look for Spec Kit tasks in the task catalog

2. **Test Basic Functionality**
   - Create a simple test pipeline
   - Add a Spec Kit task
   - Run the pipeline to verify it works

### **Step 3: Configure Your Environment**

1. **Set Up AI Assistant**
   ```bash
   # For Claude
   npm install -g @anthropic-ai/claude-cli
   claude auth
   
   # For Gemini
   pip install google-generativeai
   gemini auth
   
   # For Copilot - Install in VS Code
   # For Cursor - Install Cursor IDE
   ```

2. **Install Spec Kit CLI**
   ```bash
   pip install uv
   uvx --from git+https://github.com/github/spec-kit.git specify init test-project
   ```

### **Step 4: Create Test Pipeline**

```yaml
# azure-pipelines.yml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: Specify@1
  displayName: 'Initialize Spec-Driven Development'
  inputs:
    projectName: '$(Build.Repository.Name)'
    aiAssistant: 'copilot'
    debugMode: true

- task: Plan@1
  displayName: 'Generate Implementation Plan'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    techStack: 'React with TypeScript, Node.js backend'

- task: ValidateSpec@1
  displayName: 'Validate Specifications'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    failOnError: true
```

## 🔍 Post-Deployment Verification

### **Check These Items:**

1. **Extension Installation**
   - [ ] Extension appears in Organization Settings → Extensions
   - [ ] Extension is installed in target projects
   - [ ] No installation errors

2. **Task Availability**
   - [ ] Specify task appears in task catalog
   - [ ] Plan task appears in task catalog
   - [ ] Tasks task appears in task catalog
   - [ ] ValidateSpec task appears in task catalog

3. **Task Execution**
   - [ ] Tasks can be added to pipelines
   - [ ] Tasks execute without errors
   - [ ] Generated files are created
   - [ ] Output variables are set correctly

4. **AI Assistant Integration**
   - [ ] AI assistant is configured
   - [ ] Tasks can communicate with AI assistant
   - [ ] No authentication errors

5. **File Generation**
   - [ ] Specifications are generated
   - [ ] Implementation plans are created
   - [ ] Task lists are generated
   - [ ] Validation reports are produced

## 🚨 Troubleshooting

### **Common Issues & Solutions:**

1. **Extension Not Found**
   - **Issue**: Extension doesn't appear in task catalog
   - **Solution**: Refresh pipeline editor, check organization settings

2. **Python/uv Not Found**
   - **Issue**: Tasks fail with "Python not found" error
   - **Solution**: Add Python installation step to pipeline

3. **AI Assistant Not Working**
   - **Issue**: AI assistant tasks fail
   - **Solution**: Configure AI assistant properly or use `--ignore-agent-tools`

4. **File Generation Issues**
   - **Issue**: Generated files not created
   - **Solution**: Check file paths and permissions

## 📊 Success Metrics

### **Extension is Successfully Deployed When:**
- ✅ All tasks are available in Azure DevOps
- ✅ Tasks execute without errors
- ✅ Generated files are created correctly
- ✅ AI assistant integration works
- ✅ Validation reports are generated
- ✅ Team can use spec-driven development workflow

## 🎯 Next Steps After Deployment

1. **Train Your Team**
   - Educate team on spec-driven development
   - Show how to use the new tasks
   - Create best practices guide

2. **Create Templates**
   - Develop organization-specific templates
   - Create example pipelines
   - Document common use cases

3. **Monitor and Iterate**
   - Track usage and effectiveness
   - Gather feedback from team
   - Plan future enhancements

## 📞 Support Resources

- **Extension Documentation**: `README.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Spec Kit Documentation**: https://github.com/github/spec-kit
- **Azure DevOps Extensions**: https://docs.microsoft.com/en-us/azure/devops/extend/

---

**🎉 Ready to deploy your Spec Kit Azure DevOps extension!**
