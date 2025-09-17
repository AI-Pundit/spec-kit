# Spec Kit Azure DevOps Extension

Integrate Spec-Driven Development practices into your Azure DevOps pipelines with AI-powered specification generation, planning, and task management.

## Overview

The Spec Kit Azure DevOps Extension brings the power of Spec-Driven Development to your Azure DevOps workflows. It provides build tasks, release tasks, dashboard widgets, and service hooks that seamlessly integrate with your existing CI/CD processes.

## Features

### Build Tasks

#### Specify Task
- **Purpose**: Initialize spec-driven development projects
- **Features**:
  - Set up project structure and templates
  - Configure AI assistant (Claude, Gemini, Copilot, Cursor)
  - Generate initial specifications
  - Support for multiple script types (PowerShell, Bash)

#### Plan Task
- **Purpose**: Generate technical implementation plans from specifications
- **Features**:
  - Create detailed implementation steps
  - Configure technology stack and architecture
  - Generate comprehensive project plans
  - Validate plan completeness

#### Tasks Task
- **Purpose**: Generate actionable task lists from implementation plans
- **Features**:
  - Create work items in Azure DevOps
  - Assign tasks to team members
  - Set up task dependencies
  - Track progress and completion

#### Validate Spec Task
- **Purpose**: Validate specifications against project requirements
- **Features**:
  - Check specification completeness
  - Validate against project constraints
  - Generate validation reports
  - Fail build if validation fails

### Release Tasks

#### Deploy Spec Task
- **Purpose**: Deploy spec-driven applications
- **Features**:
  - Deploy to multiple environments
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
