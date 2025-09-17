#!/bin/bash
# Local Testing Script for Azure DevOps Extension
# This script tests the extension tasks locally before deploying to Azure DevOps

echo "🧪 Testing Azure DevOps Extension Tasks Locally"
echo "================================================"

# Set the extension path
EXTENSION_PATH=$(pwd)
DIST_PATH="$EXTENSION_PATH/dist"

echo "Extension Path: $EXTENSION_PATH"
echo "Dist Path: $DIST_PATH"

# Create test environment
TEST_DIR="/tmp/azure-devops-test"
echo "Creating test environment at: $TEST_DIR"

# Remove existing test directory
if [ -d "$TEST_DIR" ]; then
    rm -rf "$TEST_DIR"
fi

# Create test directories
mkdir -p "$TEST_DIR"/{specs,plans,tasks,validation-reports,output}

echo "✅ Test environment created"

# Create sample specification
cat > "$TEST_DIR/specs/spec.md" << 'EOF'
# Test Specification

## Overview
This is a test specification for local testing of the Azure DevOps extension.

## User Stories
- As a user, I want to test the extension locally
- As a developer, I want to validate the functionality
- As a team lead, I want to ensure quality before deployment

## Functional Requirements
- The system should work locally without Azure DevOps
- The system should generate proper outputs
- The system should handle errors gracefully
- The system should validate inputs correctly

## Acceptance Criteria
- Given a test specification
- When the extension runs locally
- Then it should generate a plan and tasks
- And it should create validation reports
- And it should handle errors appropriately

## Technical Requirements
- Python 3.11+ support
- Node.js 16+ support
- AI assistant integration
- File system operations
- Error handling and logging
EOF

echo "✅ Sample specification created"

# Set environment variables for testing
echo "Setting environment variables..."

export INPUT_PROJECTNAME="test-project"
export INPUT_PROJECTPATH="$TEST_DIR"
export INPUT_AASSISTANT="copilot"
export INPUT_SCRIPTTYPE="sh"
export INPUT_SPECPATH="$TEST_DIR/specs"
export INPUT_TECHSTACK="React with TypeScript, Node.js backend, PostgreSQL database"
export INPUT_PLANPATH="$TEST_DIR/plans"
export INPUT_SPECFILE="spec.md"
export INPUT_PLANFILE="plan.md"
export INPUT_OUTPUTPATH="$TEST_DIR/output"
export INPUT_FAILONERROR="true"
export INPUT_VALIDATEPLAN="true"
export INPUT_CREATEWORKITEMS="false"
export INPUT_ASSIGNTOTEAM="false"
export INPUT_DEBUGMODE="true"

echo "✅ Environment variables set"

# Test function
test_task() {
    local task_name="$1"
    local task_path="$2"
    local description="$3"
    
    echo "🔧 Testing $task_name..."
    echo "   Description: $description"
    
    if node "$task_path" 2>&1; then
        echo "   ✅ $task_name passed"
        return 0
    else
        echo "   ❌ $task_name failed (Exit Code: $?)"
        return 1
    fi
}

# Test all tasks
echo ""
echo "🚀 Starting task tests..."
echo "========================="

# Test Specify Task
test_task "Specify Task" "$DIST_PATH/tasks/specify/task.js" "Initialize spec-driven development project"
SPECIFY_RESULT=$?

# Test Plan Task
test_task "Plan Task" "$DIST_PATH/tasks/plan/task.js" "Generate implementation plan from specifications"
PLAN_RESULT=$?

# Test Tasks Task
test_task "Tasks Task" "$DIST_PATH/tasks/tasks/task.js" "Generate actionable task list from plans"
TASKS_RESULT=$?

# Test ValidateSpec Task
test_task "ValidateSpec Task" "$DIST_PATH/tasks/validate-spec/task.js" "Validate specifications against requirements"
VALIDATE_RESULT=$?

# Calculate results
PASSED_TESTS=0
TOTAL_TESTS=4

if [ $SPECIFY_RESULT -eq 0 ]; then ((PASSED_TESTS++)); fi
if [ $PLAN_RESULT -eq 0 ]; then ((PASSED_TESTS++)); fi
if [ $TASKS_RESULT -eq 0 ]; then ((PASSED_TESTS++)); fi
if [ $VALIDATE_RESULT -eq 0 ]; then ((PASSED_TESTS++)); fi

# Display test results
echo ""
echo "📊 Test Results Summary"
echo "======================="

echo "   Specify Task: $([ $SPECIFY_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "   Plan Task: $([ $PLAN_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "   Tasks Task: $([ $TASKS_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"
echo "   ValidateSpec Task: $([ $VALIDATE_RESULT -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")"

echo ""
echo "📈 Overall Results: $PASSED_TESTS/$TOTAL_TESTS tests passed"

# Check generated files
echo ""
echo "📁 Checking generated files..."
echo "============================="

# Check for generated files
if [ -f "$TEST_DIR/specs/spec.md" ]; then
    echo "   ✅ Found: spec.md ($(wc -c < "$TEST_DIR/specs/spec.md") bytes)"
else
    echo "   ⚠️  No spec.md found"
fi

if ls "$TEST_DIR/plans"/plan-*.md 1> /dev/null 2>&1; then
    PLAN_COUNT=$(ls "$TEST_DIR/plans"/plan-*.md | wc -l)
    echo "   ✅ Found: $PLAN_COUNT plan file(s)"
else
    echo "   ⚠️  No plan files found"
fi

if ls "$TEST_DIR/tasks"/tasks-*.md 1> /dev/null 2>&1; then
    TASK_COUNT=$(ls "$TEST_DIR/tasks"/tasks-*.md | wc -l)
    echo "   ✅ Found: $TASK_COUNT task file(s)"
else
    echo "   ⚠️  No task files found"
fi

if ls "$TEST_DIR/validation-reports"/validation-report-*.md 1> /dev/null 2>&1; then
    VALIDATION_COUNT=$(ls "$TEST_DIR/validation-reports"/validation-report-*.md | wc -l)
    echo "   ✅ Found: $VALIDATION_COUNT validation report(s)"
else
    echo "   ⚠️  No validation reports found"
fi

# Display test directory contents
echo ""
echo "📂 Test Directory Contents:"
echo "==========================="
find "$TEST_DIR" -type f -exec ls -la {} \; | while read -r line; do
    echo "   📄 $line"
done

# Final summary
echo ""
echo "🎉 Local Testing Completed!"
echo "==========================="

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo "✅ All tests passed! Extension is ready for Azure DevOps deployment."
else
    echo "⚠️  Some tests failed. Please review the errors above before deploying."
fi

echo ""
echo "📋 Next Steps:"
echo "1. Review any failed tests"
echo "2. Fix any issues found"
echo "3. Run tests again if needed"
echo "4. Deploy to Azure DevOps when ready"

echo ""
echo "🔍 Test files are available at: $TEST_DIR"
echo "Press Enter to continue..."
read -r
