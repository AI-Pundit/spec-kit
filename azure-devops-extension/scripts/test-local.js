#!/usr/bin/env node

/**
 * Local test script for Azure DevOps Extension
 * Tests all tasks locally before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running local tests for Azure DevOps Extension...\n');

// Test configuration
const testConfig = {
  projectName: 'test-project',
  projectPath: './test-env',
  aiAssistant: 'copilot',
  scriptType: 'sh',
  debugMode: true
};

// Set up test environment
function setupTestEnvironment() {
  console.log('📁 Setting up test environment...');
  
  const testDirs = ['specs', 'plans', 'tasks', 'validation-reports'];
  testDirs.forEach(dir => {
    const dirPath = path.join(testConfig.projectPath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
  
  // Create sample specification
  const specContent = `# Test Specification

## Overview
This is a test specification for local testing of the Azure DevOps extension.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality

## Functional Requirements
- The system should work locally without Azure DevOps
- The system should generate proper outputs
- The system should handle errors gracefully

## Acceptance Criteria
- Given a test specification
- When the extension runs locally
- Then it should generate a plan and tasks
- And it should create validation reports
`;

  fs.writeFileSync(
    path.join(testConfig.projectPath, 'specs', 'spec.md'),
    specContent
  );
  
  console.log('✅ Test environment set up');
}

// Set environment variables
function setEnvironmentVariables() {
  console.log('🔧 Setting environment variables...');
  
  const envVars = {
    INPUT_PROJECTNAME: testConfig.projectName,
    INPUT_PROJECTPATH: path.resolve(testConfig.projectPath),
    INPUT_AIASSISTANT: testConfig.aiAssistant,
    INPUT_SCRIPTTYPE: testConfig.scriptType,
    INPUT_SPECIFYVERSION: 'latest',
    INPUT_SKIPGIT: 'true',
    INPUT_IGNOREAGENTTOOLS: 'true',
    INPUT_DEBUGMODE: testConfig.debugMode.toString()
  };
  
  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });
  
  console.log('✅ Environment variables set');
}

// Test individual task
function testTask(taskName, taskPath) {
  console.log(`\n🔧 Testing ${taskName} task...`);
  
  try {
    const result = execSync(`node ${taskPath}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log(`✅ ${taskName} task passed`);
    return true;
  } catch (error) {
    console.log(`❌ ${taskName} task failed: ${error.message}`);
    return false;
  }
}

// Run all tests
function runTests() {
  console.log('\n🚀 Running task tests...\n');
  
  const tasks = [
    { name: 'Specify', path: 'dist/tasks/specify/task.js' },
    { name: 'Plan', path: 'dist/tasks/plan/task.js' },
    { name: 'Tasks', path: 'dist/tasks/tasks/task.js' },
    { name: 'ValidateSpec', path: 'dist/tasks/validate-spec/task.js' }
  ];
  
  let passed = 0;
  let total = tasks.length;
  
  tasks.forEach(task => {
    if (testTask(task.name, task.path)) {
      passed++;
    }
  });
  
  console.log(`\n📊 Test Results: ${passed}/${total} tasks passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Extension is ready for deployment.');
    return true;
  } else {
    console.log('❌ Some tests failed. Please fix the issues before deploying.');
    return false;
  }
}

// Clean up test environment
function cleanup() {
  console.log('\n🧹 Cleaning up test environment...');
  
  if (fs.existsSync(testConfig.projectPath)) {
    fs.rmSync(testConfig.projectPath, { recursive: true, force: true });
  }
  
  console.log('✅ Cleanup complete');
}

// Main execution
async function main() {
  try {
    setupTestEnvironment();
    setEnvironmentVariables();
    
    const success = runTests();
    
    if (success) {
      console.log('\n✅ Local testing completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ Local testing failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  } finally {
    cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, testTask, setupTestEnvironment, cleanup };
