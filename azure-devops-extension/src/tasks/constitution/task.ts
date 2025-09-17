import * as tl from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

interface TaskInputs {
  projectName: string;
  projectPath: string;
  constitutionPath: string;
  aiAssistant: string;
  scriptType: string;
  constitutionVersion: string;
  updateExisting: boolean;
  debugMode: boolean;
}

class ConstitutionTask {
  private inputs: TaskInputs;

  constructor() {
    this.inputs = {
      projectName: tl.getInput('projectName', true) || '',
      projectPath: tl.getInput('projectPath', true) || '',
      constitutionPath: tl.getInput('constitutionPath', false) || '',
      aiAssistant: tl.getInput('aiAssistant', true) || 'copilot',
      scriptType: tl.getInput('scriptType', true) || 'ps',
      constitutionVersion: tl.getInput('constitutionVersion', false) || 'latest',
      updateExisting: tl.getBoolInput('updateExisting', false) || false,
      debugMode: tl.getBoolInput('debugMode', false) || false
    };
  }

  async run(): Promise<void> {
    try {
      // Validate inputs first
      await this.validateInputs();
      
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Create or update constitution
      await this.createConstitution();
      
      tl.setResult(tl.TaskResult.Succeeded, 'Constitution task completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      tl.setResult(tl.TaskResult.Failed, `Constitution task failed: ${errorMessage}`);
    }
  }

  private async createConstitution(): Promise<void> {
    const specifyCommand = `uvx --from git+https://github.com/github/spec-kit.git specify`;
    
    // Build the init command (which creates the constitution)
    const args = [
      'init',
      this.inputs.projectName,
      '--ai', this.inputs.aiAssistant,
      '--script', this.inputs.scriptType
    ];

    if (this.inputs.updateExisting) {
      args.push('--here');
    }

    if (this.inputs.debugMode) {
      args.push('--debug');
    }

    // Change to the project directory
    const originalCwd = process.cwd();
    process.chdir(this.inputs.projectPath);

    try {
      tl.debug(`Running: ${specifyCommand} ${args.join(' ')}`);
      
      const result = execSync(`${specifyCommand} ${args.join(' ')}`, {
        stdio: 'pipe',
        encoding: 'utf8',
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      tl.debug('Constitution creation output:');
      tl.debug(result);

      // Set output variables
      tl.setVariable('Constitution.ProjectName', this.inputs.projectName);
      tl.setVariable('Constitution.ProjectPath', this.inputs.projectPath);
      tl.setVariable('Constitution.AIAssistant', this.inputs.aiAssistant);
      tl.setVariable('Constitution.ScriptType', this.inputs.scriptType);
      tl.setVariable('Constitution.ConstitutionPath', path.join(this.inputs.projectPath, '.specify', 'memory', 'constitution.md'));

      tl.setResult(tl.TaskResult.Succeeded, 'Constitution created successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to create constitution: ${errorMessage}`);
    } finally {
      process.chdir(originalCwd);
    }
  }

  private async validateInputs(): Promise<void> {
    if (!this.inputs.projectName) {
      throw new Error('Project name is required');
    }

    if (!this.inputs.projectPath) {
      throw new Error('Project path is required');
    }

    // Validate AI assistant
    const validAIAssistants = ['copilot', 'claude', 'gemini', 'cursor'];
    if (!validAIAssistants.includes(this.inputs.aiAssistant)) {
      throw new Error(`Invalid AI assistant: ${this.inputs.aiAssistant}. Must be one of: ${validAIAssistants.join(', ')}`);
    }

    // Validate script type
    const validScriptTypes = ['ps', 'sh'];
    if (!validScriptTypes.includes(this.inputs.scriptType)) {
      throw new Error(`Invalid script type: ${this.inputs.scriptType}. Must be one of: ${validScriptTypes.join(', ')}`);
    }

    // Ensure project path exists
    if (!fs.existsSync(this.inputs.projectPath)) {
      tl.debug(`Creating project directory: ${this.inputs.projectPath}`);
      fs.mkdirSync(this.inputs.projectPath, { recursive: true });
    }
  }

  private async checkPrerequisites(): Promise<void> {
    // Check for Python
    const pythonPath = tl.which('python', false);
    if (!pythonPath) {
      throw new Error('Python is required but not found. Please install Python 3.11+ to use the Specify CLI.');
    }

    // Check Python version
    try {
      const pythonVersion = execSync('python --version', { encoding: 'utf8' }).trim();
      tl.debug(`Python version: ${pythonVersion}`);
      
      // Extract version number and check if it's 3.11+
      const versionMatch = pythonVersion.match(/Python (\d+)\.(\d+)/);
      if (versionMatch) {
        const major = parseInt(versionMatch[1]);
        const minor = parseInt(versionMatch[2]);
        if (major < 3 || (major === 3 && minor < 11)) {
          throw new Error(`Python 3.11+ is required, but found ${pythonVersion}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to check Python version: ${errorMessage}`);
    }

    // Check for uv
    const uvPath = tl.which('uv', false);
    if (!uvPath) {
      throw new Error('uv is required but not found. Please install uv to use the Specify CLI.');
    }
  }
}

// Main execution
async function main() {
  const task = new ConstitutionTask();
  await task.run();
}

// Run the task
main().catch((error) => {
  tl.setResult(tl.TaskResult.Failed, error.message);
});
