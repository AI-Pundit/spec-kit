# Local Testing Setup for Azure DevOps Extension

## 🏠 **Running Azure DevOps Extension Locally**

### **Why Test Locally First?**
- **Faster Development**: Test changes without uploading to Azure DevOps
- **Debug Issues**: Easier to troubleshoot problems
- **Validate Logic**: Ensure tasks work correctly before deployment
- **Cost Effective**: No need to upload multiple versions during development

## 🔧 **Local Testing Methods**

### **Method 1: Direct Node.js Execution (Recommended)**

#### **Step 1: Test Individual Tasks**
```bash
# Navigate to the extension directory
cd azure-devops-extension

# Test Specify Task
node dist/tasks/specify/task.js

# Test Plan Task
node dist/tasks/plan/task.js

# Test Tasks Task
node dist/tasks/tasks/task.js

# Test ValidateSpec Task
node dist/tasks/validate-spec/task.js
```

#### **Step 2: Set Environment Variables**
```bash
# Set required environment variables for testing
export INPUT_PROJECTNAME="test-project"
export INPUT_PROJECTPATH="/tmp/test-project"
export INPUT_AASSISTANT="copilot"
export INPUT_SCRIPTTYPE="sh"
export INPUT_SPECPATH="/tmp/test-project/specs"
export INPUT_TECHSTACK="React with TypeScript, Node.js backend"
export INPUT_PLANPATH="/tmp/test-project/plans"
export INPUT_SPECFILE="spec.md"
export INPUT_PLANFILE="plan.md"
export INPUT_OUTPUTPATH="/tmp/test-project/output"
export INPUT_FAILONERROR="true"
export INPUT_VALIDATEPLAN="true"
export INPUT_CREATEWORKITEMS="false"
export INPUT_ASSIGNTOTEAM="false"
export INPUT_DEBUGMODE="true"
```

### **Method 2: Mock Azure DevOps Environment**

#### **Create Mock Environment**
```bash
# Create test directory
mkdir -p /tmp/azure-devops-test
cd /tmp/azure-devops-test

# Create mock project structure
mkdir -p specs plans tasks validation-reports output

# Create sample specification
cat > specs/spec.md << 'EOF'
# Test Specification

## Overview
This is a test specification for local testing.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality

## Functional Requirements
- The system should work locally
- The system should generate proper outputs

## Acceptance Criteria
- Given a test specification
- When the extension runs
- Then it should generate a plan and tasks
EOF
```

### **Method 3: Docker Container Testing**

#### **Create Dockerfile for Testing**
```dockerfile
FROM node:18-alpine

# Install Python and uv
RUN apk add --no-cache python3 py3-pip
RUN pip3 install uv

# Install Azure DevOps CLI tools
RUN npm install -g tfx-cli

# Set working directory
WORKDIR /app

# Copy extension files
COPY . .

# Install dependencies
RUN npm install

# Build the extension
RUN npm run build

# Set environment variables
ENV INPUT_PROJECTNAME="test-project"
ENV INPUT_PROJECTPATH="/app/test-project"
ENV INPUT_AASSISTANT="copilot"
ENV INPUT_DEBUGMODE="true"

# Run tests
CMD ["npm", "run", "test:local"]
```

## 🧪 **Local Testing Scripts**

### **Create Test Scripts**

#### **1. Basic Task Testing**
```bash
#!/bin/bash
# test-tasks.sh

echo "🧪 Testing Azure DevOps Extension Tasks Locally"

# Create test environment
mkdir -p /tmp/azure-devops-test/{specs,plans,tasks,validation-reports,output}
cd /tmp/azure-devops-test

# Set environment variables
export INPUT_PROJECTNAME="test-project"
export INPUT_PROJECTPATH="/tmp/azure-devops-test"
export INPUT_AASSISTANT="copilot"
export INPUT_SCRIPTTYPE="sh"
export INPUT_SPECPATH="/tmp/azure-devops-test/specs"
export INPUT_TECHSTACK="React with TypeScript, Node.js backend"
export INPUT_PLANPATH="/tmp/azure-devops-test/plans"
export INPUT_SPECFILE="spec.md"
export INPUT_PLANFILE="plan.md"
export INPUT_OUTPUTPATH="/tmp/azure-devops-test/output"
export INPUT_FAILONERROR="true"
export INPUT_VALIDATEPLAN="true"
export INPUT_CREATEWORKITEMS="false"
export INPUT_ASSIGNTOTEAM="false"
export INPUT_DEBUGMODE="true"

# Create sample specification
cat > specs/spec.md << 'EOF'
# Test Specification

## Overview
This is a test specification for local testing.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality

## Functional Requirements
- The system should work locally
- The system should generate proper outputs

## Acceptance Criteria
- Given a test specification
- When the extension runs
- Then it should generate a plan and tasks
EOF

echo "✅ Test environment created"

# Test Specify Task
echo "🔧 Testing Specify Task..."
node /path/to/azure-devops-extension/dist/tasks/specify/task.js
if [ $? -eq 0 ]; then
    echo "✅ Specify Task passed"
else
    echo "❌ Specify Task failed"
fi

# Test Plan Task
echo "🔧 Testing Plan Task..."
node /path/to/azure-devops-extension/dist/tasks/plan/task.js
if [ $? -eq 0 ]; then
    echo "✅ Plan Task passed"
else
    echo "❌ Plan Task failed"
fi

# Test Tasks Task
echo "🔧 Testing Tasks Task..."
node /path/to/azure-devops-extension/dist/tasks/tasks/task.js
if [ $? -eq 0 ]; then
    echo "✅ Tasks Task passed"
else
    echo "❌ Tasks Task failed"
fi

# Test ValidateSpec Task
echo "🔧 Testing ValidateSpec Task..."
node /path/to/azure-devops-extension/dist/tasks/validate-spec/task.js
if [ $? -eq 0 ]; then
    echo "✅ ValidateSpec Task passed"
else
    echo "❌ ValidateSpec Task failed"
fi

echo "🎉 Local testing completed!"
```

#### **2. PowerShell Test Script**
```powershell
# test-tasks.ps1

Write-Host "🧪 Testing Azure DevOps Extension Tasks Locally" -ForegroundColor Green

# Create test environment
$testDir = "C:\temp\azure-devops-test"
New-Item -ItemType Directory -Path $testDir -Force
New-Item -ItemType Directory -Path "$testDir\specs" -Force
New-Item -ItemType Directory -Path "$testDir\plans" -Force
New-Item -ItemType Directory -Path "$testDir\tasks" -Force
New-Item -ItemType Directory -Path "$testDir\validation-reports" -Force
New-Item -ItemType Directory -Path "$testDir\output" -Force

# Set environment variables
$env:INPUT_PROJECTNAME = "test-project"
$env:INPUT_PROJECTPATH = $testDir
$env:INPUT_AASSISTANT = "copilot"
$env:INPUT_SCRIPTTYPE = "ps"
$env:INPUT_SPECPATH = "$testDir\specs"
$env:INPUT_TECHSTACK = "React with TypeScript, Node.js backend"
$env:INPUT_PLANPATH = "$testDir\plans"
$env:INPUT_SPECFILE = "spec.md"
$env:INPUT_PLANFILE = "plan.md"
$env:INPUT_OUTPUTPATH = "$testDir\output"
$env:INPUT_FAILONERROR = "true"
$env:INPUT_VALIDATEPLAN = "true"
$env:INPUT_CREATEWORKITEMS = "false"
$env:INPUT_ASSIGNTOTEAM = "false"
$env:INPUT_DEBUGMODE = "true"

# Create sample specification
$specContent = @"
# Test Specification

## Overview
This is a test specification for local testing.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality

## Functional Requirements
- The system should work locally
- The system should generate proper outputs

## Acceptance Criteria
- Given a test specification
- When the extension runs
- Then it should generate a plan and tasks
"@

$specContent | Out-File -FilePath "$testDir\specs\spec.md" -Encoding UTF8

Write-Host "✅ Test environment created" -ForegroundColor Green

# Test Specify Task
Write-Host "🔧 Testing Specify Task..." -ForegroundColor Yellow
node "C:\path\to\azure-devops-extension\dist\tasks\specify\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Specify Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ Specify Task failed" -ForegroundColor Red
}

# Test Plan Task
Write-Host "🔧 Testing Plan Task..." -ForegroundColor Yellow
node "C:\path\to\azure-devops-extension\dist\tasks\plan\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Plan Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ Plan Task failed" -ForegroundColor Red
}

# Test Tasks Task
Write-Host "🔧 Testing Tasks Task..." -ForegroundColor Yellow
node "C:\path\to\azure-devops-extension\dist\tasks\tasks\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tasks Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ Tasks Task failed" -ForegroundColor Red
}

# Test ValidateSpec Task
Write-Host "🔧 Testing ValidateSpec Task..." -ForegroundColor Yellow
node "C:\path\to\azure-devops-extension\dist\tasks\validate-spec\task.js"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ ValidateSpec Task passed" -ForegroundColor Green
} else {
    Write-Host "❌ ValidateSpec Task failed" -ForegroundColor Red
}

Write-Host "🎉 Local testing completed!" -ForegroundColor Green
```

## 🔍 **Testing Different Scenarios**

### **Scenario 1: Basic Functionality Test**
- Test each task individually
- Verify output generation
- Check error handling

### **Scenario 2: Integration Test**
- Test tasks in sequence
- Verify data flow between tasks
- Check file generation

### **Scenario 3: Error Handling Test**
- Test with invalid inputs
- Test with missing files
- Test with network issues

### **Scenario 4: AI Assistant Test**
- Test with different AI assistants
- Test with invalid API keys
- Test with network connectivity

## 📊 **Expected Outputs**

### **After Running Tests, You Should See:**
- **Specify Task**: Project initialization files
- **Plan Task**: Implementation plan files
- **Tasks Task**: Task list files
- **ValidateSpec Task**: Validation reports

### **Check Generated Files:**
```bash
# Check what was generated
ls -la /tmp/azure-devops-test/
ls -la /tmp/azure-devops-test/specs/
ls -la /tmp/azure-devops-test/plans/
ls -la /tmp/azure-devops-test/tasks/
ls -la /tmp/azure-devops-test/validation-reports/
```

## 🚨 **Troubleshooting Local Testing**

### **Common Issues:**

#### **1. Module Not Found Errors**
```bash
# Solution: Install dependencies
npm install
npm run build
```

#### **2. Environment Variable Issues**
```bash
# Solution: Set all required variables
export INPUT_PROJECTNAME="test-project"
export INPUT_PROJECTPATH="/tmp/test-project"
# ... etc
```

#### **3. File Permission Issues**
```bash
# Solution: Check file permissions
chmod +x dist/tasks/*/task.js
```

#### **4. Python/uv Not Found**
```bash
# Solution: Install Python and uv
pip install uv
```

## 🎯 **Next Steps After Local Testing**

### **1. Fix Any Issues Found**
- Debug and fix problems
- Test again locally
- Ensure all tasks work correctly

### **2. Prepare for Azure DevOps Deployment**
- Package the extension
- Test the .vsix file
- Prepare deployment documentation

### **3. Deploy to Azure DevOps**
- Upload to Azure DevOps
- Install in projects
- Test in real environment

---

**Ready to start local testing? Let me know if you need help with any specific part!**
