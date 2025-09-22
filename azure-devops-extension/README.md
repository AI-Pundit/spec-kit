# AI Pundit Speckit - Azure DevOps Extension

Integrate Spec-Driven Development practices into your Azure DevOps pipelines with AI-powered specification generation, planning, and task management.

## Overview

The AI Pundit Speckit is a comprehensive Azure DevOps extension that brings the power of Spec-Driven Development to your workflows. It provides pipeline tasks, dashboard widgets, and AI-powered automation that seamlessly integrates with your existing CI/CD processes.

## Extension Details

- **Name**: AI Pundit Speckit
- **Publisher**: Waiin
- **Version**: 1.0.0
- **Type**: Private Extension (for testing)
- **Package Size**: ~265 KB
- **License**: Apache-2.0

## Testing Flow Overview

This extension follows Microsoft's recommended testing approach: **Local Testing → Private Marketplace → Public Release**.

## Features

### Pipeline Tasks (5 Total)

#### 1. Specify@1 Task
- **Purpose**: Generate specifications using AI providers
- **Features**:
  - AI-powered specification generation (Claude, Gemini, Copilot)
  - Support for multiple project types
  - Configurable output formats
  - Integration with existing codebases

#### 2. Plan@1 Task  
- **Purpose**: Create development plans from specifications
- **Features**:
  - Generate detailed implementation plans
  - Technology stack recommendations
  - Architecture planning
  - Task breakdown and estimation

#### 3. Tasks@1 Task
- **Purpose**: Generate actionable tasks from development plans
- **Features**:
  - Create work items in Azure DevOps
  - Task dependency mapping
  - Progress tracking integration
  - Team assignment capabilities

#### 4. ValidateSpec@1 Task
- **Purpose**: Validate specifications against standards
- **Features**:
  - Specification completeness checking
  - Standards compliance validation
  - Quality assessment reports
  - Build failure on validation errors

#### 5. Constitution@1 Task
- **Purpose**: Update and maintain project constitution
- **Features**:
  - Constitution document management
  - Version control integration
  - Change tracking and approval
  - Template-based updates

### Dashboard Widgets (2 Total)

#### 1. Spec Progress Widget
- **Purpose**: Track specification development progress
- **Features**:
  - Visual progress indicators
  - Timeline tracking
  - Milestone visualization
  - Team performance metrics

#### 2. AI Assistant Status Widget
- **Purpose**: Monitor AI assistant status and usage
- **Features**:
  - AI provider status monitoring
  - Usage statistics and analytics
  - Performance metrics
  - Cost tracking capabilities

## Local Testing Flow

### Phase 1: Development Testing ✅ (Current Phase)

#### Prerequisites
- Node.js and npm installed
- Azure DevOps organization with admin permissions
- TFX CLI installed (`npm install -g tfx-cli`)

#### Building the Extension
```bash
# Navigate to extension directory
cd azure-devops-extension

# Install dependencies
npm install

# Build the extension
npm run build

# Create VSIX package
npm run package
```
**Output**: `Waiin.pundit-speckit-1.0.0.vsix` (~265 KB)

#### Testing Options

##### Option 1: Direct Organization Upload (Recommended for Development)
**Fastest way to test changes during development**

1. **Access Organization Extensions**
   ```
   https://dev.azure.com/{your-organization}/_settings/extensions
   ```

2. **Upload Extension**
   - Click "Upload extension"
   - Select `Waiin.pundit-speckit-1.0.0.vsix`
   - Install to organization immediately

3. **Immediate Testing**
   - Extension appears in installed extensions
   - All 5 tasks available in pipeline editor
   - Both widgets available in dashboards

**Benefits:**
- ✅ Instant testing after upload
- ✅ No marketplace dependency
- ✅ Perfect for development iterations
- ✅ Private to your organization only

##### Option 2: Marketplace Private Upload (Production-like Testing)
**Tests the complete marketplace experience**

1. **Publisher Management**
   - Go to [Marketplace Management Portal](https://marketplace.visualstudio.com/manage/publishers)
   - Ensure publisher "Waiin" exists

2. **Upload to Marketplace**
   - Select publisher "Waiin"
   - Click "New extension" > "Azure DevOps"
   - Upload `Waiin.pundit-speckit-1.0.0.vsix`
   - Extension remains private by default

3. **Share with Organization**
   - Right-click extension > "Share/Unshare"
   - Enter your organization name
   - Extension becomes installable

4. **Install from Marketplace**
   - Access through Azure DevOps marketplace
   - Install like any other extension

**Benefits:**
- ✅ Full marketplace workflow testing
- ✅ Simulates production environment
- ✅ Can share with multiple organizations
- ✅ Privacy maintained during testing

### Phase 2: Validation Testing

#### Installation Validation Checklist
- [ ] Extension appears in Organization Settings > Extensions > Installed
- [ ] Version displays as 1.0.0
- [ ] Publisher shows as "Waiin"
- [ ] No installation errors or warnings

#### Pipeline Tasks Validation
- [ ] All 5 tasks appear in pipeline editor task catalog
- [ ] Tasks searchable by name (Specify, Plan, Tasks, ValidateSpec, Constitution)
- [ ] Tasks can be added to pipeline YAML
- [ ] Pipeline with extension tasks saves successfully
- [ ] Pipeline executes without critical errors
- [ ] Task inputs and outputs work correctly

#### Dashboard Widgets Validation
- [ ] Both widgets appear in dashboard widget catalog
- [ ] Spec Progress Widget adds to dashboard successfully
- [ ] AI Assistant Status Widget adds to dashboard successfully
- [ ] Widgets display without JavaScript errors
- [ ] Widget configuration options function properly

#### Sample Test Pipeline
```yaml
trigger: none
pool:
  vmImage: ubuntu-latest

variables:
  specPath: '$(System.DefaultWorkingDirectory)/specs'
  planPath: '$(System.DefaultWorkingDirectory)/plans'

stages:
- stage: TestSpecKitExtension
  displayName: Test AI Pundit Speckit Extension
  jobs:
  - job: TestAllTasks
    displayName: Test All Extension Tasks
    steps:
    
    - task: Specify@1
      displayName: Test Specify Task
      inputs:
        targetPath: '$(System.DefaultWorkingDirectory)'
        outputPath: '$(specPath)'
        aiProvider: 'claude'
        
    - task: Plan@1
      displayName: Test Plan Task
      inputs:
        specPath: '$(specPath)'
        outputPath: '$(planPath)'
        aiProvider: 'claude'
        
    - task: Tasks@1
      displayName: Test Tasks Task
      inputs:
        planPath: '$(planPath)'
        outputPath: './tasks'
        aiProvider: 'claude'
        
    - task: ValidateSpec@1
      displayName: Test ValidateSpec Task
      inputs:
        specPath: '$(specPath)'
        outputPath: './validation-reports'
        
    - task: Constitution@1
      displayName: Test Constitution Task
      inputs:
        constitutionPath: './constitution.md'
        outputPath: './updated-constitution.md'
        
    # Publish test artifacts
    - publish: '$(specPath)'
      artifact: 'test-specifications'
      displayName: Publish Test Specifications
      
    - publish: '$(planPath)'
      artifact: 'test-plans'
      displayName: Publish Test Plans
```

### Phase 3: Production Deployment (Future)

#### Requirements for Public Release
- [ ] All local testing completed successfully
- [ ] Multiple organization testing completed
- [ ] Comprehensive documentation available
- [ ] Support and privacy policies defined
- [ ] Extension stability verified

#### Making Extension Public
1. **Update Configuration**
   ```json
   {
     "private": false,
     "public": true
   }
   ```

2. **Rebuild and Upload**
   ```bash
   npm run build
   npm run package
   # Upload new version to marketplace
   ```

## Quick Start Commands

### Validation and Testing
```bash
# Quick validation
powershell -ExecutionPolicy Bypass -File "start-local-testing.ps1"

# Build and package
npm run build && npm run package

# Create test pipeline
# Copy contents from test-pipeline.yml
```

### Development Workflow

#### Making Changes
1. **Edit Source Code**
   - Modify files in `src/tasks/` or `src/widgets/`
   - Update `vss-extension.json` if needed

2. **Test Locally**
   ```bash
   npm run build
   npm run package
   ```

3. **Upload to Organization**
   - Use Option 1 (Direct Upload) for rapid testing
   - Verify functionality works as expected

4. **Iterate Until Stable**
   - Repeat build-test cycle
   - Move to marketplace when ready

## File Structure
```
azure-devops-extension/
├── vss-extension.json              # Extension manifest
├── package.json                    # Node.js dependencies  
├── webpack.config.js               # Build configuration
├── src/
│   ├── tasks/
│   │   ├── specify/               # Specify@1 task
│   │   ├── plan/                  # Plan@1 task
│   │   ├── tasks/                 # Tasks@1 task
│   │   ├── validate-spec/         # ValidateSpec@1 task
│   │   └── constitution/          # Constitution@1 task
│   └── widgets/
│       ├── spec-progress/         # Spec Progress widget
│       └── ai-status/             # AI Status widget
├── images/
│   ├── extension-icon.png         # Extension icon (128x128)
│   └── screenshots/               # Marketplace screenshots
├── Waiin.pundit-speckit-1.0.0.vsix # Generated VSIX package
├── start-local-testing.ps1        # Testing helper script
├── test-pipeline.yml              # Sample test pipeline
├── TESTING_AND_PUBLICATION_GUIDE.md # Detailed guide
└── README.md                      # This documentation
```

## Troubleshooting

### Common Issues and Solutions

#### Extension Not Appearing After Upload
- **Symptoms**: Extension doesn't show in installed list
- **Solutions**: 
  - Clear browser cache and refresh page
  - Verify upload completed successfully
  - Check organization permissions
  - Try different browser

#### Tasks Not Available in Pipeline Editor
- **Symptoms**: Tasks don't appear in task catalog
- **Solutions**:
  - Refresh pipeline editor page
  - Verify extension installation status
  - Check task definitions in manifest
  - Clear browser cache

#### Pipeline Execution Failures
- **Symptoms**: Pipeline fails when using extension tasks
- **Solutions**:
  - Review task execution logs
  - Verify task input parameters
  - Check AI provider configuration
  - Validate required files exist

#### Widget Loading Issues
- **Symptoms**: Widgets don't display on dashboard
- **Solutions**:
  - Refresh dashboard page
  - Check browser console for errors
  - Verify widget permissions
  - Try re-adding widget to dashboard

#### Upload/Installation Failures
- **Symptoms**: VSIX upload fails or installation errors
- **Solutions**:
  - Verify publisher "Waiin" exists
  - Check VSIX file size (must be < 50MB)
  - Validate JSON syntax in manifest
  - Ensure proper permissions

### Debugging Tips
- Review pipeline execution logs for specific error messages
- Check browser developer console for JavaScript errors
- Verify organization admin permissions
- Test with minimal configuration first
- Use provided test pipeline as baseline

## Support and Resources

### Getting Help
- **Documentation**: Review this README and TESTING_AND_PUBLICATION_GUIDE.md
- **Microsoft Docs**: [Azure DevOps Extension Development](https://docs.microsoft.com/en-us/azure/devops/extend/)
- **Testing**: Use provided test scripts and pipelines
- **Validation**: Follow the testing checklists

### Reporting Issues
1. Check troubleshooting section above
2. Verify issue with test pipeline
3. Document error messages and steps to reproduce
4. Check browser console for additional errors

## Success Criteria

The extension is ready for production deployment when:
- ✅ All 5 tasks appear and function correctly in pipeline editor
- ✅ Pipelines with extension tasks execute successfully
- ✅ Both widgets display properly on dashboards
- ✅ No critical errors during normal operation
- ✅ Extension installs and uninstalls cleanly
- ✅ All validation checklists completed
- ✅ Multiple test scenarios pass

## Current Status and Next Steps

### Current Status: Ready for Local Testing ✅
- Extension built and packaged successfully
- All components included and functional
- Testing scripts and documentation prepared
- VSIX file ready for upload

### Immediate Next Steps
1. **Start Local Testing** - Use Option 1 (Direct Organization Upload)
2. **Complete Validation** - Follow testing checklists
3. **Iterate if Needed** - Fix any issues found during testing
4. **Marketplace Upload** - Move to Option 2 when stable
5. **Broader Testing** - Share with additional organizations

### Future Roadmap
- [ ] Complete local testing and validation
- [ ] Upload to marketplace as private extension
- [ ] Conduct multi-organization testing
- [ ] Add comprehensive documentation
- [ ] Consider public release when stable

---

**Extension**: AI Pundit Speckit v1.0.0  
**Publisher**: Waiin  
**Testing Phase**: Local Development → Private Marketplace → Public Release  
**Last Updated**: September 19, 2025  
**Status**: Ready for Local Testing
│   ├── extension-icon.png         # Extension icon (128x128)
│   └── screenshots/               # Marketplace screenshots
├── Waiin.pundit-speckit-1.0.0.vsix # Generated VSIX package
├── start-local-testing.ps1        # Testing helper script
├── test-pipeline.yml              # Sample test pipeline
├── TESTING_AND_PUBLICATION_GUIDE.md # Detailed guide
└── README.md                      # This documentation
```
  - Configure deployment settings
  - Run post-deployment validation
  - Update deployment status

#### Update Constitution Task
- **Purpose**: Update project constitution based on deployment
- **Features**:
  - Sync with Azure DevOps project settings
  - Maintain consistency across environments
  - Update project governance

### Dashboard Widgets

#### Spec Progress Widget
- **Purpose**: Monitor spec-driven development progress
- **Features**:
  - Show completion percentages
  - Display active specifications
  - Track AI assistant usage
  - Visual progress indicators

#### AI Assistant Status Widget
- **Purpose**: Monitor AI assistant availability and usage
- **Features**:
  - Display AI assistant status
  - Show usage statistics
  - Monitor performance metrics
  - Alert on issues

### Service Hooks

#### Work Item to Spec Hook
- **Purpose**: Convert work items to specifications
- **Features**:
  - Automatically generate spec templates
  - Link work items to specifications
  - Maintain traceability
  - Streamline spec creation

#### Pull Request Spec Validation
- **Purpose**: Validate pull requests against specifications
- **Features**:
  - Check spec compliance
  - Generate validation reports
  - Block PRs if validation fails
  - Ensure quality gates

## Installation

### Prerequisites

- Azure DevOps organization
- Node.js 16+ (for development)
- Python 3.11+ (for Spec Kit CLI)
- uv package manager
- AI assistant (Claude, Gemini, Copilot, or Cursor)

### Installation Steps

1. **Download the Extension**
   ```bash
   # Clone the repository
   git clone https://github.com/github/spec-kit.git
   cd spec-kit/azure-devops-extension
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```

4. **Package the Extension**
   ```bash
   npm run package
   ```

5. **Install in Azure DevOps**
   - Upload the generated `.vsix` file to your Azure DevOps organization
   - Or publish to the Visual Studio Marketplace

## Usage

### Basic Pipeline Setup

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
    projectPath: '$(Build.SourcesDirectory)'
    aiAssistant: 'copilot'
    scriptType: 'sh'

- task: Plan@1
  displayName: 'Generate Implementation Plan'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    techStack: 'The application uses .NET Aspire with Postgres as the database. The frontend should use Blazor server.'
    aiAssistant: 'copilot'

- task: Tasks@1
  displayName: 'Generate Task List'
  inputs:
    planPath: '$(Build.SourcesDirectory)/plans'
    aiAssistant: 'copilot'

- task: ValidateSpec@1
  displayName: 'Validate Specifications'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    failOnError: true
```

### Advanced Configuration

```yaml
# Advanced pipeline with all tasks
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

variables:
  AI_ASSISTANT: 'claude'
  SCRIPT_TYPE: 'sh'

steps:
- task: Specify@1
  displayName: 'Initialize Project'
  inputs:
    projectName: '$(Build.Repository.Name)'
    projectPath: '$(Build.SourcesDirectory)'
    aiAssistant: '$(AI_ASSISTANT)'
    scriptType: '$(SCRIPT_TYPE)'
    specifyVersion: 'latest'
    skipGit: false
    ignoreAgentTools: false
    debugMode: true

- task: Plan@1
  displayName: 'Generate Plan'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    specFile: 'spec.md'
    techStack: 'The application uses React with TypeScript, Node.js backend, and PostgreSQL database.'
    architecture: 'Microservices architecture with API Gateway'
    aiAssistant: '$(AI_ASSISTANT)'
    outputPath: '$(Build.SourcesDirectory)/plans'
    validatePlan: true

- task: Tasks@1
  displayName: 'Generate Tasks'
  inputs:
    planPath: '$(Build.SourcesDirectory)/plans'
    aiAssistant: '$(AI_ASSISTANT)'
    createWorkItems: true
    assignToTeam: true

- task: ValidateSpec@1
  displayName: 'Validate Specs'
  inputs:
    specPath: '$(Build.SourcesDirectory)/specs'
    failOnError: true
    generateReport: true
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPECIFY_VERSION` | Specify CLI version to use | `latest` |
| `AI_ASSISTANT` | Default AI assistant | `copilot` |
| `SCRIPT_TYPE` | Default script type | `ps` (Windows) / `sh` (Linux) |
| `DEBUG_MODE` | Enable debug output | `false` |

### Task Parameters

Each task supports various parameters for customization. See the individual task documentation for detailed parameter descriptions.

## Troubleshooting

### Common Issues

1. **Python Not Found**
   - Ensure Python 3.11+ is installed
   - Add Python to your PATH
   - Use the `python` command (not `python3`)

2. **uv Not Found**
   - Install uv: `pip install uv`
   - Or use the official installer: `curl -LsSf https://astral.sh/uv/install.sh | sh`

3. **AI Assistant Not Available**
   - Install the required AI assistant
   - Use `--ignore-agent-tools` flag if needed
   - Check AI assistant configuration

4. **Specification Not Found**
   - Verify the spec path is correct
   - Check if the spec file exists
   - Ensure proper file permissions

### Debug Mode

Enable debug mode to get detailed logging:

```yaml
- task: Specify@1
  inputs:
    debugMode: true
```

### Logs

Check the Azure DevOps build logs for detailed error messages and debugging information.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Run tests: `npm test`
5. Package: `npm run package`

### Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all
```

## Support

- **Documentation**: [Spec Kit Documentation](https://github.com/github/spec-kit)
- **Issues**: [GitHub Issues](https://github.com/github/spec-kit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/github/spec-kit/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Spec Kit Team for the amazing Spec-Driven Development toolkit
- Azure DevOps team for the extension platform
- AI assistant providers (Anthropic, Google, Microsoft, Cursor) for their tools
