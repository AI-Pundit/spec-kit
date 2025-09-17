import * as tl from 'azure-pipelines-task-lib/task';
import * as path from 'path';
import * as fs from 'fs';

interface TaskInputs {
  specPath: string;
  specFile: string;
  failOnError: boolean;
  generateReport: boolean;
  outputPath: string;
}

class ValidateSpecTask {
  private inputs: TaskInputs;

  constructor() {
    this.inputs = {
      specPath: tl.getInput('specPath', true) || '',
      specFile: tl.getInput('specFile', false) || 'spec.md',
      failOnError: tl.getBoolInput('failOnError', false) || false,
      generateReport: tl.getBoolInput('generateReport', false) || true,
      outputPath: tl.getInput('outputPath', false) || ''
    };
  }

  async run(): Promise<void> {
    try {
      await this.validateInputs();
      const validationResult = await this.validateSpecification();
      
      if (validationResult.isValid) {
        tl.setResult(tl.TaskResult.Succeeded, 'Specification validation passed');
      } else {
        const message = `Specification validation failed: ${validationResult.errors.join(', ')}`;
        if (this.inputs.failOnError) {
          tl.setResult(tl.TaskResult.Failed, message);
        } else {
          tl.setResult(tl.TaskResult.SucceededWithIssues, message);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      tl.setResult(tl.TaskResult.Failed, `Specification validation failed: ${errorMessage}`);
    }
  }

  private async validateInputs(): Promise<void> {
    if (!this.inputs.specPath) {
      throw new Error('Specification path is required');
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
      this.inputs.outputPath = path.join(path.dirname(this.inputs.specPath), 'validation-reports');
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.inputs.outputPath)) {
      fs.mkdirSync(this.inputs.outputPath, { recursive: true });
    }
  }

  private async validateSpecification(): Promise<{isValid: boolean, errors: string[], warnings: string[]}> {
    try {
      // Read the specification file
      const specFilePath = path.join(this.inputs.specPath, this.inputs.specFile);
      const specContent = fs.readFileSync(specFilePath, 'utf8');
      
      tl.debug(`Reading specification from: ${specFilePath}`);
      tl.debug(`Specification content length: ${specContent.length} characters`);

      const errors: string[] = [];
      const warnings: string[] = [];

      // Validate required sections
      const requiredSections = [
        '## Overview',
        '## User Stories',
        '## Functional Requirements',
        '## Acceptance Criteria'
      ];

      for (const section of requiredSections) {
        if (!specContent.includes(section)) {
          errors.push(`Missing required section: ${section}`);
        }
      }

      // Validate content quality
      if (specContent.length < 500) {
        errors.push('Specification content is too short (minimum 500 characters)');
      }

      if (specContent.length > 50000) {
        warnings.push('Specification content is very long (over 50,000 characters)');
      }

      // Check for placeholder text
      const placeholderPatterns = [
        /\[PRINCIPLE_\d+_NAME\]/g,
        /\[PRINCIPLE_\d+_DESCRIPTION\]/g,
        /\[SECTION_\d+_NAME\]/g,
        /\[SECTION_\d+_CONTENT\]/g
      ];

      for (const pattern of placeholderPatterns) {
        const matches = specContent.match(pattern);
        if (matches && matches.length > 0) {
          errors.push(`Found placeholder text: ${matches[0]}`);
        }
      }

      // Check for user stories format
      const userStoryPattern = /As a .+ I want .+ so that .+/g;
      const userStories = specContent.match(userStoryPattern);
      if (!userStories || userStories.length === 0) {
        warnings.push('No user stories found in the expected format');
      }

      // Check for acceptance criteria
      const acceptanceCriteriaPattern = /Given .+ When .+ Then .+/g;
      const acceptanceCriteria = specContent.match(acceptanceCriteriaPattern);
      if (!acceptanceCriteria || acceptanceCriteria.length === 0) {
        warnings.push('No acceptance criteria found in the expected format');
      }

      // Generate validation report if requested
      if (this.inputs.generateReport) {
        await this.generateValidationReport(specContent, errors, warnings);
      }

      const isValid = errors.length === 0;
      
      // Set output variables
      tl.setVariable('Validation.IsValid', isValid.toString());
      tl.setVariable('Validation.ErrorCount', errors.length.toString());
      tl.setVariable('Validation.WarningCount', warnings.length.toString());

      return { isValid, errors, warnings };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to validate specification: ${errorMessage}`);
    }
  }

  private async generateValidationReport(specContent: string, errors: string[], warnings: string[]): Promise<void> {
    const timestamp = new Date().toISOString();
    const reportContent = `# Specification Validation Report

Generated on: ${timestamp}
Specification: ${this.inputs.specFile}
Validation Status: ${errors.length === 0 ? 'PASSED' : 'FAILED'}

## Summary

- **Total Errors**: ${errors.length}
- **Total Warnings**: ${warnings.length}
- **Specification Length**: ${specContent.length} characters
- **Validation Status**: ${errors.length === 0 ? '✅ PASSED' : '❌ FAILED'}

## Errors

${errors.length === 0 ? 'No errors found.' : errors.map(error => `- ❌ ${error}`).join('\n')}

## Warnings

${warnings.length === 0 ? 'No warnings found.' : warnings.map(warning => `- ⚠️ ${warning}`).join('\n')}

## Specification Content Preview

\`\`\`
${specContent.substring(0, 1000)}${specContent.length > 1000 ? '...' : ''}
\`\`\`

## Recommendations

${this.generateRecommendations(errors, warnings)}

## Next Steps

${errors.length === 0 ? 
  'Specification validation passed. You can proceed with implementation planning.' :
  'Please address the errors above before proceeding with implementation planning.'
}

---
*This report was generated by the Spec Kit Azure DevOps Extension*
`;

    // Save the report
    const reportFileName = `validation-report-${Date.now()}.md`;
    const reportFilePath = path.join(this.inputs.outputPath, reportFileName);
    fs.writeFileSync(reportFilePath, reportContent);
    
    tl.debug(`Validation report saved to: ${reportFilePath}`);
    tl.setVariable('Validation.ReportPath', reportFilePath);
  }

  private generateRecommendations(errors: string[], warnings: string[]): string {
    const recommendations: string[] = [];

    if (errors.length > 0) {
      recommendations.push('1. **Address all errors** before proceeding with implementation');
      recommendations.push('2. **Review the specification template** to ensure all required sections are present');
      recommendations.push('3. **Replace placeholder text** with actual content');
    }

    if (warnings.length > 0) {
      recommendations.push('1. **Consider addressing warnings** to improve specification quality');
      recommendations.push('2. **Review user stories** to ensure they follow the proper format');
      recommendations.push('3. **Add acceptance criteria** in the Given-When-Then format');
    }

    if (errors.length === 0 && warnings.length === 0) {
      recommendations.push('1. **Specification looks good!** You can proceed with implementation planning');
      recommendations.push('2. **Consider adding more detail** if the specification seems too brief');
      recommendations.push('3. **Review with stakeholders** to ensure requirements are complete');
    }

    return recommendations.join('\n');
  }
}

// Main execution
async function main() {
  const task = new ValidateSpecTask();
  await task.run();
}

// Run the task
main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  tl.setResult(tl.TaskResult.Failed, errorMessage);
});
