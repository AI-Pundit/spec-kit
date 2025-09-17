import * as tl from 'azure-pipelines-task-lib/task';
import * as toolLib from 'azure-pipelines-tool-lib/tool';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

interface TaskInputs {
  projectName: string;
  projectPath: string;
  aiAssistant: string;
  scriptType: string;
  specifyVersion: string;
  skipGit: boolean;
  ignoreAgentTools: boolean;
  debugMode: boolean;
}

class SpecifyTask {
  private inputs: TaskInputs;

  constructor() {
    this.inputs = {
      projectName: tl.getInput('projectName', true) || '',
      projectPath: tl.getInput('projectPath', true) || '',
      aiAssistant: tl.getInput('aiAssistant', true) || 'copilot',
      scriptType: tl.getInput('scriptType', true) || 'ps',
      specifyVersion: tl.getInput('specifyVersion', false) || 'latest',
      skipGit: tl.getBoolInput('skipGit', false) || false,
      ignoreAgentTools: tl.getBoolInput('ignoreAgentTools', false) || false,
      debugMode: tl.getBoolInput('debugMode', false) || false
    };
  }

  async run(): Promise<void> {
    try {
      // Validate inputs first
      await this.validateInputs();
      
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Initialize the project
      await this.initializeProject();
      
      tl.setResult(tl.TaskResult.Succeeded, 'Specify task completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      tl.setResult(tl.TaskResult.Failed, `Specify task failed: ${errorMessage}`);
    }
  }

  private async installSpecifyCLI(): Promise<string> {
    try {
      // Check if uv is available
      const uvPath = tl.which('uv', false);
      if (!uvPath) {
        throw new Error('uv is not installed. Please install uv to use the Specify CLI.');
      }

      // Use uvx to run specify directly without installing
      const specifyCommand = `uvx --from git+https://github.com/github/spec-kit.git specify`;
      tl.debug(`Using Specify CLI via uvx: ${specifyCommand}`);
      
      return specifyCommand;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to access Specify CLI: ${errorMessage}`);
    }
  }

  private async initializeProject(): Promise<void> {
    const specifyPath = await this.installSpecifyCLI();
    
    // Build the specify init command
    const args = [
      'init',
      this.inputs.projectName,
      '--ai', this.inputs.aiAssistant,
      '--script', this.inputs.scriptType
    ];

    if (this.inputs.skipGit) {
      args.push('--no-git');
    }

    if (this.inputs.ignoreAgentTools) {
      args.push('--ignore-agent-tools');
    }

    if (this.inputs.debugMode) {
      args.push('--debug');
    }

    // Change to the project directory
    const originalCwd = process.cwd();
    process.chdir(this.inputs.projectPath);

    try {
      tl.debug(`Running: ${specifyPath} ${args.join(' ')}`);
      
      const result = execSync(`${specifyPath} ${args.join(' ')}`, {
        stdio: 'pipe',
        encoding: 'utf8',
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      tl.debug('Specify init output:');
      tl.debug(result);

      // Set output variables
      tl.setVariable('Specify.ProjectName', this.inputs.projectName);
      tl.setVariable('Specify.ProjectPath', this.inputs.projectPath);
      tl.setVariable('Specify.AIAssistant', this.inputs.aiAssistant);
      tl.setVariable('Specify.ScriptType', this.inputs.scriptType);

      tl.setResult(tl.TaskResult.Succeeded, 'Project initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to initialize project: ${errorMessage}`);
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

    // Check for git if not skipping
    if (!this.inputs.skipGit) {
      const gitPath = tl.which('git', false);
      if (!gitPath) {
        tl.warning('Git is not available. Consider using --skip-git option or installing Git.');
      }
    }
  }
}

// Main execution
async function main() {
  const task = new SpecifyTask();
  await task.run();
}

// Run the task
main().catch((error) => {
  tl.setResult(tl.TaskResult.Failed, error.message);
});
