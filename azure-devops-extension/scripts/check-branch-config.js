#!/usr/bin/env node

/**
 * Check if current branch is configured in GitHub Actions workflows
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking GitHub Actions branch configuration...\n');

// Get current branch
let currentBranch;
try {
  currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
} catch (error) {
  console.error('❌ Could not determine current branch:', error.message);
  process.exit(1);
}

console.log(`📍 Current branch: ${currentBranch}`);

// Check workflow files (config.yml is a reusable workflow, doesn't need branch config)
const workflowFiles = [
  '.github/workflows/deploy-extension.yml',
  '.github/workflows/test-extension.yml'
];

let allConfigured = true;

workflowFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Workflow file not found: ${filePath}`);
    allConfigured = false;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  // Check if branch is mentioned in the file
  if (content.includes(currentBranch)) {
    console.log(`✅ ${fileName}: Branch '${currentBranch}' is configured`);
  } else {
    console.log(`❌ ${fileName}: Branch '${currentBranch}' is NOT configured`);
    allConfigured = false;
  }
});

console.log('\n📊 Summary:');
if (allConfigured) {
  console.log('🎉 All workflows are properly configured for your branch!');
  console.log('\n🚀 You can now push your code and the GitHub Actions will run automatically.');
  console.log('\nNext steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Add GitHub Actions automation"');
  console.log('3. git push origin users/ritesh/speckit_feature');
  console.log('4. Check the Actions tab in your GitHub repository');
} else {
  console.log('⚠️  Some workflows need to be updated for your branch.');
  console.log('\nTo fix this, add your branch to the workflow files:');
  console.log('- Add your branch to the "branches" array in the "on.push" section');
  console.log('- Add your branch to the deployment conditions');
}

console.log('\n📋 Current workflow triggers:');
console.log('- Push to main, develop, or users/ritesh/speckit_feature');
console.log('- Pull requests to main or develop');
console.log('- Manual workflow dispatch');
console.log('- Tags starting with "v"');
console.log('- Scheduled runs (test workflow only)');

process.exit(allConfigured ? 0 : 1);
