# AI Pundit Speckit Extension - Demo Guide

This guide shows you how to use the new UI components in your Azure DevOps extension.

## What We've Built

### 1. Main Hub Interface (`hub/speckit-hub.html`)
- **Location**: Project Hub -> Speckit (in Developer section)
- **Features**:
  - Overview dashboard with quick actions
  - Task configuration and execution interface
  - Progress monitoring
  - Settings management
  - Real-time AI status indicators

### 2. Dashboard Widgets
- **Spec Progress Widget** (`widgets/spec-progress.html`)
  - Tracks specification development progress
  - Shows completion metrics
  - Lists recent specification updates
  
- **AI Status Widget** (`widgets/ai-status.html`)
  - Monitors AI assistant connectivity
  - Shows token usage and request metrics
  - Displays recent AI activity

### 3. Shared Components (`shared/`)
- **Common CSS** (`shared/common.css`): Consistent styling across all components
- **Common JS** (`shared/common.js`): Utility functions and API helpers

## How to Use

### 1. Access the Main Hub
1. Navigate to your Azure DevOps project
2. Go to the **Speckit** tab in the project navigation
3. You'll see the main dashboard with:
   - Quick action buttons for common tasks
   - Project metrics and status
   - Recent activity feed

### 2. Configure and Execute Tasks
1. Click the **Tasks** tab in the hub
2. For each available task (Constitution, Specify, Plan, Tasks, Validate):
   - Click **Configure** to set up task parameters
   - Once configured, click **Execute** to run the task
   - Monitor progress in real-time

### 3. Monitor Progress
1. Use the **Progress** tab to see:
   - Overall project progress
   - Individual specification completion rates
   - Task completion statistics

### 4. Add Dashboard Widgets
1. Go to your project dashboard
2. Click **+ Add Widget**
3. Search for "Spec Progress" or "AI Status"
4. Add and configure the widgets on your dashboard

## Task Configuration Options

### Constitution Task
- **Constitution Template**: Choose from Default, Agile, Enterprise, or Custom
- **Project Type**: Specify your project type (e.g., web-app, api, library)
- **AI Provider**: Select Claude, GPT, or Gemini

### Specify Task
- **Project Name**: Defaults to repository name
- **Specification Template**: Choose from various spec types
- **Include Architecture Diagrams**: Option to generate diagrams

### Plan Task
- **Planning Depth**: High Level, Detailed, or Comprehensive
- **Project Timeframe**: Expected duration
- **Include Milestones**: Option to add milestone tracking

### Tasks Generation
- **Task Granularity**: Control task size (Coarse, Medium, Fine)
- **Assignment Strategy**: Auto-assign, Manual, or Load Balanced

### Validate Specification
- **Validation Level**: Basic, Comprehensive, or Strict
- **Generate Report**: Option to create validation reports

## Features

### Real-time Status
- AI connection status with visual indicators
- Task execution progress
- Token usage monitoring
- Error tracking and notifications

### Interactive UI
- Responsive design for all screen sizes
- Modern, professional styling
- Intuitive navigation
- Consistent with Azure DevOps design system

### Data Persistence
- Settings are saved per project
- Task configurations are remembered
- Activity history is maintained

## Customization

### Styling
- Modify `shared/common.css` for global style changes
- Use CSS variables for consistent theming
- Add custom animations and transitions

### Functionality
- Extend `shared/common.js` for additional utilities
- Add new task types by updating the hub interface
- Integrate with additional Azure DevOps services

## Development Notes

### File Structure
```
azure-devops-extension/
├── hub/
│   ├── speckit-hub.html       # Main hub interface
│   ├── speckit-hub.css        # Hub-specific styles
│   └── speckit-hub.js         # Hub functionality
├── widgets/
│   ├── spec-progress.html     # Progress tracking widget
│   └── ai-status.html         # AI status monitoring widget
├── shared/
│   ├── common.css             # Shared styles and utilities
│   └── common.js              # Shared JavaScript functions
└── vss-extension.json         # Extension manifest (updated)
```

### Integration Points
- Azure DevOps Work Items API
- Azure DevOps Build API
- Extension Data Service for persistence
- Azure DevOps REST APIs for project data

### Next Steps
1. **Test the Extension**: Install and test in your Azure DevOps environment
2. **Connect to Real Tasks**: Integrate with your actual Speckit CLI tasks
3. **Add Authentication**: Implement AI provider authentication
4. **Expand Features**: Add more task types and monitoring capabilities

## Demo Scenarios

### Scenario 1: New Project Setup
1. Open Speckit hub
2. Click "Initialize New Project"
3. Configure Constitution task with project details
4. Execute Constitution setup
5. Monitor progress in dashboard widgets

### Scenario 2: Specification Development
1. Configure Specify task with project requirements
2. Execute specification generation
3. Track progress in Spec Progress widget
4. Validate generated specs using Validate task

### Scenario 3: Development Planning
1. Use Plan task to generate development roadmap
2. Break down into actionable tasks using Tasks generation
3. Monitor overall progress and AI usage
4. Adjust plans based on progress metrics

This UI provides a comprehensive interface for your Speckit extension, making it easy for users to configure, execute, and monitor their spec-driven development workflows directly within Azure DevOps.