import * as tl from 'azure-pipelines-task-lib/task';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

interface TaskInputs {
  specPath: string;
  specFile: string;
  techStack: string;
  architecture: string;
  aiAssistant: string;
  outputPath: string;
  validatePlan: boolean;
}

class PlanTask {
  private inputs: TaskInputs;

  constructor() {
    this.inputs = {
      specPath: tl.getInput('specPath', true) || '',
      specFile: tl.getInput('specFile', false) || 'spec.md',
      techStack: tl.getInput('techStack', true) || '',
      architecture: tl.getInput('architecture', false) || '',
      aiAssistant: tl.getInput('aiAssistant', true) || 'copilot',
      outputPath: tl.getInput('outputPath', false) || '',
      validatePlan: tl.getBoolInput('validatePlan', false) || true
    };
  }

  async run(): Promise<void> {
    try {
      await this.validateInputs();
      await this.checkPrerequisites();
      await this.generatePlan();
      tl.setResult(tl.TaskResult.Succeeded, 'Plan generation completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      tl.setResult(tl.TaskResult.Failed, `Plan generation failed: ${errorMessage}`);
    }

  }

  private async validateInputs(): Promise<void> {
    if (!this.inputs.specPath) {
      throw new Error('Specification path is required');
    }

    if (!this.inputs.techStack) {
      throw new Error('Technology stack is required');
    }

    // Validate AI assistant
    const validAIAssistants = ['copilot', 'claude', 'gemini', 'cursor'];
    if (!validAIAssistants.includes(this.inputs.aiAssistant)) {
      throw new Error(`Invalid AI assistant: ${this.inputs.aiAssistant}. Must be one of: ${validAIAssistants.join(', ')}`);
    }

    // Check if spec path exists
    if (!fs.existsSync(this.inputs.specPath)) {
      throw new Error(`Specification path does not exist: ${this.inputs.specPath}`);
    }

    // Check if spec file exists
    const specFilePath = path.join(this.inputs.specPath, this.inputs.specFile);
    if (!fs.existsSync(specFilePath)) {
      throw new Error(`Specification file does not exist: ${specFilePath}`);
    }

    // Set default output path if not provided
    if (!this.inputs.outputPath) {
      this.inputs.outputPath = path.join(path.dirname(this.inputs.specPath), 'plans');
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.inputs.outputPath)) {
      fs.mkdirSync(this.inputs.outputPath, { recursive: true });
    }
  }

  private async checkPrerequisites(): Promise<void> {
    // Check for Python
    const pythonPath = tl.which('python', false);
    if (!pythonPath) {
      throw new Error('Python is required but not found. Please install Python 3.11+ to use the Specify CLI.');
    }

    // Check for uv
    const uvPath = tl.which('uv', false);
    if (!uvPath) {
      throw new Error('uv is required but not found. Please install uv to use the Specify CLI.');
    }
  }

  private async generatePlan(): Promise<void> {
    try {
      // Read the specification file
      const specFilePath = path.join(this.inputs.specPath, this.inputs.specFile);
      const specContent = fs.readFileSync(specFilePath, 'utf8');
      
      tl.debug(`Reading specification from: ${specFilePath}`);
      tl.debug(`Specification content length: ${specContent.length} characters`);

      // Create plan content based on tech stack and architecture
      const planContent = await this.createPlanContent(specContent);
      
      // Save the plan
      const planFileName = `plan-${Date.now()}.md`;
      const planFilePath = path.join(this.inputs.outputPath, planFileName);
      fs.writeFileSync(planFilePath, planContent);
      
      tl.debug(`Plan saved to: ${planFilePath}`);

      // Validate plan if requested
      if (this.inputs.validatePlan) {
        await this.validatePlan(planContent);
      }

      // Set output variables
      tl.setVariable('Plan.OutputPath', this.inputs.outputPath);
      tl.setVariable('Plan.FileName', planFileName);
      tl.setVariable('Plan.FilePath', planFilePath);
      tl.setVariable('Plan.TechStack', this.inputs.techStack);

      tl.setResult(tl.TaskResult.Succeeded, `Plan generated successfully: ${planFileName}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate plan: ${errorMessage}`);
    }
  }

  private async createPlanContent(specContent: string): Promise<string> {
    // This is a simplified plan generation
    // In a real implementation, this would use the AI assistant to generate the plan
    
    const timestamp = new Date().toISOString();
    const planContent = `# Implementation Plan

Generated on: ${timestamp}
AI Assistant: ${this.inputs.aiAssistant}
Technology Stack: ${this.inputs.techStack}

## Overview

This implementation plan is generated from the specification and outlines the technical approach for building the specified solution.

## Technology Stack

${this.inputs.techStack}

${this.inputs.architecture ? `## Architecture

${this.inputs.architecture}` : ''}

## Implementation Steps

### Phase 1: Project Setup
1. Initialize the project structure
2. Set up the development environment
3. Configure the technology stack
4. Set up version control and CI/CD

### Phase 2: Core Implementation
1. Implement the core functionality
2. Set up data models and APIs
3. Implement business logic
4. Add error handling and validation

### Phase 3: User Interface
1. Design and implement the user interface
2. Add user interactions and workflows
3. Implement responsive design
4. Add accessibility features

### Phase 4: Testing and Quality Assurance
1. Write unit tests
2. Implement integration tests
3. Perform user acceptance testing
4. Code review and refactoring

### Phase 5: Deployment and Monitoring
1. Set up deployment pipeline
2. Configure monitoring and logging
3. Deploy to production
4. Monitor and maintain

## Dependencies

- Python 3.11+
- ${this.inputs.aiAssistant} AI Assistant
- Git for version control
- CI/CD pipeline (Azure DevOps)

## Notes

This plan is generated automatically and should be reviewed and customized based on specific project requirements.

## Specification Reference

${specContent.substring(0, 500)}${specContent.length > 500 ? '...' : ''}
`;

    return planContent;
  }

  private async validatePlan(planContent: string): Promise<void> {
    // Basic validation checks
    const requiredSections = [
      'Implementation Steps',
      'Technology Stack',
      'Dependencies'
    ];

    for (const section of requiredSections) {
      if (!planContent.includes(section)) {
        throw new Error(`Plan validation failed: Missing required section '${section}'`);
      }
    }

    // Check if plan has reasonable length
    if (planContent.length < 500) {
      throw new Error('Plan validation failed: Plan content is too short');
    }

    tl.debug('Plan validation passed');
  }
}

// Main execution
async function main() {
  const task = new PlanTask();
  await task.run();
}

// Run the task
main().catch((error) => {
  tl.setResult(tl.TaskResult.Failed, error.message);
});

