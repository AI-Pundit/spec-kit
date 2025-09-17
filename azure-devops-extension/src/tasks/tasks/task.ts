import * as tl from 'azure-pipelines-task-lib/task';
import * as path from 'path';
import * as fs from 'fs';

interface TaskInputs {
  planPath: string;
  planFile: string;
  aiAssistant: string;
  createWorkItems: boolean;
  assignToTeam: boolean;
  outputPath: string;
}

class TasksTask {
  private inputs: TaskInputs;

  constructor() {
    this.inputs = {
      planPath: tl.getInput('planPath', true) || '',
      planFile: tl.getInput('planFile', false) || 'plan.md',
      aiAssistant: tl.getInput('aiAssistant', true) || 'copilot',
      createWorkItems: tl.getBoolInput('createWorkItems', false) || false,
      assignToTeam: tl.getBoolInput('assignToTeam', false) || false,
      outputPath: tl.getInput('outputPath', false) || ''
    };
  }

  async run(): Promise<void> {
    try {
      await this.validateInputs();
      await this.generateTasks();
      tl.setResult(tl.TaskResult.Succeeded, 'Tasks generation completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      tl.setResult(tl.TaskResult.Failed, `Tasks generation failed: ${errorMessage}`);
    }
  }

  private async validateInputs(): Promise<void> {
    if (!this.inputs.planPath) {
      throw new Error('Plan path is required');
    }

    // Check if plan path exists
    if (!fs.existsSync(this.inputs.planPath)) {
      throw new Error(`Plan path does not exist: ${this.inputs.planPath}`);
    }

    // Check if plan file exists
    const planFilePath = path.join(this.inputs.planPath, this.inputs.planFile);
    if (!fs.existsSync(planFilePath)) {
      throw new Error(`Plan file does not exist: ${planFilePath}`);
    }

    // Set default output path if not provided
    if (!this.inputs.outputPath) {
      this.inputs.outputPath = path.join(path.dirname(this.inputs.planPath), 'tasks');
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.inputs.outputPath)) {
      fs.mkdirSync(this.inputs.outputPath, { recursive: true });
    }
  }

  private async generateTasks(): Promise<void> {
    try {
      // Read the plan file
      const planFilePath = path.join(this.inputs.planPath, this.inputs.planFile);
      const planContent = fs.readFileSync(planFilePath, 'utf8');
      
      tl.debug(`Reading plan from: ${planFilePath}`);
      tl.debug(`Plan content length: ${planContent.length} characters`);

      // Generate tasks from plan
      const tasks = await this.createTasksFromPlan(planContent);
      
      // Save the tasks
      const tasksFileName = `tasks-${Date.now()}.md`;
      const tasksFilePath = path.join(this.inputs.outputPath, tasksFileName);
      fs.writeFileSync(tasksFilePath, tasks);
      
      tl.debug(`Tasks saved to: ${tasksFilePath}`);

      // Set output variables
      tl.setVariable('Tasks.OutputPath', this.inputs.outputPath);
      tl.setVariable('Tasks.FileName', tasksFileName);
      tl.setVariable('Tasks.FilePath', tasksFilePath);

      tl.setResult(tl.TaskResult.Succeeded, `Tasks generated successfully: ${tasksFileName}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate tasks: ${errorMessage}`);
    }
  }

  private async createTasksFromPlan(planContent: string): Promise<string> {
    const timestamp = new Date().toISOString();
    const tasksContent = `# Implementation Tasks

Generated on: ${timestamp}
AI Assistant: ${this.inputs.aiAssistant}
Source Plan: ${this.inputs.planFile}

## Task Overview

This document contains actionable tasks derived from the implementation plan.

## Phase 1: Project Setup

### Task 1.1: Initialize Project Structure
- **Priority**: High
- **Estimated Time**: 2 hours
- **Dependencies**: None
- **Description**: Set up the basic project structure and configuration files
- **Acceptance Criteria**:
  - Project directory structure created
  - Configuration files in place
  - Version control initialized

### Task 1.2: Set Up Development Environment
- **Priority**: High
- **Estimated Time**: 1 hour
- **Dependencies**: Task 1.1
- **Description**: Configure the development environment and tools
- **Acceptance Criteria**:
  - Development tools installed
  - Environment variables configured
  - IDE/editor configured

### Task 1.3: Configure Technology Stack
- **Priority**: High
- **Estimated Time**: 3 hours
- **Dependencies**: Task 1.2
- **Description**: Set up the chosen technology stack and frameworks
- **Acceptance Criteria**:
  - Technology stack installed
  - Dependencies configured
  - Basic configuration complete

## Phase 2: Core Implementation

### Task 2.1: Implement Data Models
- **Priority**: High
- **Estimated Time**: 4 hours
- **Dependencies**: Task 1.3
- **Description**: Create data models and schemas
- **Acceptance Criteria**:
  - Data models defined
  - Validation rules implemented
  - Database schema created

### Task 2.2: Implement Business Logic
- **Priority**: High
- **Estimated Time**: 6 hours
- **Dependencies**: Task 2.1
- **Description**: Implement core business logic and services
- **Acceptance Criteria**:
  - Business logic implemented
  - Services created
  - Error handling added

### Task 2.3: Create API Endpoints
- **Priority**: Medium
- **Estimated Time**: 4 hours
- **Dependencies**: Task 2.2
- **Description**: Implement REST API endpoints
- **Acceptance Criteria**:
  - API endpoints created
  - Request/response handling
  - API documentation

## Phase 3: User Interface

### Task 3.1: Design User Interface
- **Priority**: Medium
- **Estimated Time**: 3 hours
- **Dependencies**: Task 2.3
- **Description**: Create UI mockups and designs
- **Acceptance Criteria**:
  - UI mockups created
  - Design system established
  - User flow defined

### Task 3.2: Implement Frontend Components
- **Priority**: Medium
- **Estimated Time**: 8 hours
- **Dependencies**: Task 3.1
- **Description**: Build frontend components and pages
- **Acceptance Criteria**:
  - Components implemented
  - Pages created
  - Responsive design

### Task 3.3: Add User Interactions
- **Priority**: Medium
- **Estimated Time**: 4 hours
- **Dependencies**: Task 3.2
- **Description**: Implement user interactions and workflows
- **Acceptance Criteria**:
  - User interactions working
  - Workflows implemented
  - State management

## Phase 4: Testing and Quality

### Task 4.1: Write Unit Tests
- **Priority**: High
- **Estimated Time**: 6 hours
- **Dependencies**: Task 2.2
- **Description**: Create comprehensive unit tests
- **Acceptance Criteria**:
  - Unit tests written
  - Test coverage > 80%
  - Tests passing

### Task 4.2: Implement Integration Tests
- **Priority**: Medium
- **Estimated Time**: 4 hours
- **Dependencies**: Task 4.1
- **Description**: Create integration tests
- **Acceptance Criteria**:
  - Integration tests written
  - API tests implemented
  - End-to-end tests

### Task 4.3: Perform Code Review
- **Priority**: Medium
- **Estimated Time**: 2 hours
- **Dependencies**: Task 4.2
- **Description**: Review code quality and standards
- **Acceptance Criteria**:
  - Code reviewed
  - Standards followed
  - Issues addressed

## Phase 5: Deployment

### Task 5.1: Set Up CI/CD Pipeline
- **Priority**: High
- **Estimated Time**: 4 hours
- **Dependencies**: Task 4.3
- **Description**: Configure continuous integration and deployment
- **Acceptance Criteria**:
  - CI/CD pipeline configured
  - Automated builds
  - Deployment automation

### Task 5.2: Deploy to Staging
- **Priority**: High
- **Estimated Time**: 2 hours
- **Dependencies**: Task 5.1
- **Description**: Deploy application to staging environment
- **Acceptance Criteria**:
  - Staging deployment successful
  - Environment configured
  - Smoke tests passing

### Task 5.3: Deploy to Production
- **Priority**: High
- **Estimated Time**: 2 hours
- **Dependencies**: Task 5.2
- **Description**: Deploy application to production
- **Acceptance Criteria**:
  - Production deployment successful
  - Monitoring configured
  - Health checks passing

## Notes

- All tasks should be reviewed and customized based on specific project requirements
- Time estimates are approximate and may vary based on complexity
- Dependencies should be respected to ensure proper task sequencing
- Regular progress reviews should be conducted

## Plan Reference

${planContent.substring(0, 500)}${planContent.length > 500 ? '...' : ''}
`;

    return tasksContent;
  }
}

// Main execution
async function main() {
  const task = new TasksTask();
  await task.run();
}

// Run the task
main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  tl.setResult(tl.TaskResult.Failed, errorMessage);
});
