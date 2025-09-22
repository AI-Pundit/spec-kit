// AI Pundit Speckit Hub JavaScript
class SpeckitHub {
    constructor() {
        this.currentTab = 'overview';
        this.taskConfigurations = new Map();
        this.init();
    }

    init() {
        // Initialize VSS SDK
        VSS.init({
            explicitNotifyLoaded: true,
            usePlatformStyles: true
        });

        VSS.ready(() => {
            this.initializeUI();
            this.loadSettings();
            this.updateStatus();
            VSS.notifyLoadSucceeded();
        });
    }

    initializeUI() {
        this.setupTabNavigation();
        this.setupButtonHandlers();
        this.setupModalHandlers();
        this.loadRecentActivity();
        this.updateMetrics();
    }

    setupTabNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Update active tab
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab).classList.add('active');
                
                this.currentTab = targetTab;
                this.onTabChanged(targetTab);
            });
        });
    }

    setupButtonHandlers() {
        // Quick action buttons
        document.getElementById('initializeProjectBtn').addEventListener('click', () => {
            this.executeQuickAction('initialize');
        });

        document.getElementById('generateSpecBtn').addEventListener('click', () => {
            this.executeQuickAction('specify');
        });

        document.getElementById('createPlanBtn').addEventListener('click', () => {
            this.executeQuickAction('plan');
        });

        document.getElementById('validateSpecBtn').addEventListener('click', () => {
            this.executeQuickAction('validate');
        });

        // Task configure buttons
        document.querySelectorAll('.btn-configure').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskName = e.target.getAttribute('data-task');
                this.showTaskConfiguration(taskName);
            });
        });

        // Task execute buttons
        document.querySelectorAll('.btn-execute').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskName = e.target.getAttribute('data-task');
                this.executeTask(taskName);
            });
        });

        // Settings buttons
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('resetSettings').addEventListener('click', () => {
            this.resetSettings();
        });
    }

    setupModalHandlers() {
        const modal = document.getElementById('taskConfigModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelConfig');
        const saveBtn = document.getElementById('saveConfig');

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        saveBtn.addEventListener('click', () => {
            this.saveTaskConfiguration();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    onTabChanged(tabName) {
        switch (tabName) {
            case 'progress':
                this.updateProgressData();
                break;
            case 'tasks':
                this.updateTaskStates();
                break;
            case 'overview':
                this.updateMetrics();
                break;
        }
    }

    executeQuickAction(action) {
        this.showNotification(`Executing ${action} action...`, 'info');
        
        switch (action) {
            case 'initialize':
                this.executeTask('specify');
                break;
            case 'specify':
                this.executeTask('specify');
                break;
            case 'plan':
                this.executeTask('plan');
                break;
            case 'validate':
                this.executeTask('validate-spec');
                break;
        }
    }

    showTaskConfiguration(taskName) {
        const modal = document.getElementById('taskConfigModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = `Configure ${this.getTaskDisplayName(taskName)}`;
        modalBody.innerHTML = this.getTaskConfigurationForm(taskName);
        
        modal.style.display = 'block';
        this.currentConfigTask = taskName;
    }

    getTaskDisplayName(taskName) {
        const displayNames = {
            'constitution': 'Constitution Setup',
            'specify': 'Specify Task',
            'plan': 'Plan Task',
            'tasks': 'Tasks Generation',
            'validate-spec': 'Specification Validation'
        };
        return displayNames[taskName] || taskName;
    }

    getTaskConfigurationForm(taskName) {
        // Base configuration common to all tasks
        let form = `
            <div class="config-form">
                <div class="form-group">
                    <label for="projectPath">Project Path:</label>
                    <input type="text" id="projectPath" value="$(Build.SourcesDirectory)" required>
                </div>
                <div class="form-group">
                    <label for="aiProvider">AI Provider:</label>
                    <select id="aiProvider" required>
                        <option value="claude">Claude (Anthropic)</option>
                        <option value="gpt">GPT (OpenAI)</option>
                        <option value="gemini">Gemini (Google)</option>
                    </select>
                </div>
        `;

        // Task-specific configuration
        switch (taskName) {
            case 'constitution':
                form += `
                    <div class="form-group">
                        <label for="constitutionTemplate">Constitution Template:</label>
                        <select id="constitutionTemplate">
                            <option value="default">Default Template</option>
                            <option value="agile">Agile Template</option>
                            <option value="enterprise">Enterprise Template</option>
                            <option value="custom">Custom Template</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="projectType">Project Type:</label>
                        <input type="text" id="projectType" placeholder="e.g., web-app, api, library">
                    </div>
                `;
                break;

            case 'specify':
                form += `
                    <div class="form-group">
                        <label for="projectName">Project Name:</label>
                        <input type="text" id="projectName" value="$(Build.Repository.Name)" required>
                    </div>
                    <div class="form-group">
                        <label for="specTemplate">Specification Template:</label>
                        <select id="specTemplate">
                            <option value="default">Default Template</option>
                            <option value="technical">Technical Specification</option>
                            <option value="functional">Functional Specification</option>
                            <option value="api">API Specification</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="includeArchitecture">
                            Include Architecture Diagrams
                        </label>
                    </div>
                `;
                break;

            case 'plan':
                form += `
                    <div class="form-group">
                        <label for="planningDepth">Planning Depth:</label>
                        <select id="planningDepth">
                            <option value="high">High Level</option>
                            <option value="detailed">Detailed</option>
                            <option value="comprehensive">Comprehensive</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="timeframe">Project Timeframe:</label>
                        <input type="text" id="timeframe" placeholder="e.g., 2 weeks, 1 month">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="includeMilestones">
                            Include Milestones
                        </label>
                    </div>
                `;
                break;

            case 'tasks':
                form += `
                    <div class="form-group">
                        <label for="taskGranularity">Task Granularity:</label>
                        <select id="taskGranularity">
                            <option value="coarse">Coarse (Large Tasks)</option>
                            <option value="medium">Medium</option>
                            <option value="fine">Fine (Small Tasks)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="assignmentStrategy">Assignment Strategy:</label>
                        <select id="assignmentStrategy">
                            <option value="auto">Auto-assign</option>
                            <option value="manual">Manual Assignment</option>
                            <option value="balanced">Load Balanced</option>
                        </select>
                    </div>
                `;
                break;

            case 'validate-spec':
                form += `
                    <div class="form-group">
                        <label for="validationLevel">Validation Level:</label>
                        <select id="validationLevel">
                            <option value="basic">Basic Validation</option>
                            <option value="comprehensive">Comprehensive</option>
                            <option value="strict">Strict Validation</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="generateReport">
                            Generate Validation Report
                        </label>
                    </div>
                `;
                break;
        }

        form += `
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="enableVerboseLogging">
                        Enable Verbose Logging
                    </label>
                </div>
            </div>
        `;

        return form;
    }

    saveTaskConfiguration() {
        const taskName = this.currentConfigTask;
        const formData = this.getFormData();
        
        this.taskConfigurations.set(taskName, formData);
        this.updateTaskStatus(taskName, 'configured');
        this.enableTaskExecution(taskName);
        
        this.showNotification(`${this.getTaskDisplayName(taskName)} configured successfully!`, 'success');
        this.closeModal();
    }

    getFormData() {
        const form = document.querySelector('.config-form');
        const formData = {};
        
        // Get all input values
        form.querySelectorAll('input, select').forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        });
        
        return formData;
    }

    updateTaskStatus(taskName, status) {
        const taskCard = document.querySelector(`[data-task="${taskName}"]`);
        const statusElement = taskCard.querySelector('.task-status');
        
        statusElement.className = `task-status ${status}`;
        
        switch (status) {
            case 'configured':
                statusElement.textContent = 'Configured';
                break;
            case 'running':
                statusElement.textContent = 'Running';
                break;
            case 'completed':
                statusElement.textContent = 'Completed';
                break;
            case 'error':
                statusElement.textContent = 'Error';
                break;
            default:
                statusElement.textContent = 'Not Configured';
        }
    }

    enableTaskExecution(taskName) {
        const taskCard = document.querySelector(`[data-task="${taskName}"]`);
        const executeBtn = taskCard.querySelector('.btn-execute');
        executeBtn.disabled = false;
    }

    executeTask(taskName) {
        if (!this.taskConfigurations.has(taskName)) {
            this.showNotification(`Please configure ${this.getTaskDisplayName(taskName)} first!`, 'warning');
            return;
        }

        this.updateTaskStatus(taskName, 'running');
        this.showNotification(`Executing ${this.getTaskDisplayName(taskName)}...`, 'info');

        // Simulate task execution
        setTimeout(() => {
            this.updateTaskStatus(taskName, 'completed');
            this.showNotification(`${this.getTaskDisplayName(taskName)} completed successfully!`, 'success');
            this.addActivityItem(`${this.getTaskDisplayName(taskName)} executed successfully`);
            this.updateMetrics();
        }, 3000);
    }

    closeModal() {
        const modal = document.getElementById('taskConfigModal');
        modal.style.display = 'none';
        this.currentConfigTask = null;
    }

    updateStatus() {
        // Update AI status
        document.getElementById('aiStatus').textContent = 'Connected';
        document.getElementById('projectStatus').textContent = 'Ready';
    }

    updateMetrics() {
        // Simulate metrics update
        const metrics = {
            totalSpecs: Math.floor(Math.random() * 10) + 1,
            completedTasks: Math.floor(Math.random() * 25) + 5,
            activePlans: Math.floor(Math.random() * 5) + 1,
            tokensUsed: Math.floor(Math.random() * 10000) + 1000
        };

        document.getElementById('totalSpecs').textContent = metrics.totalSpecs;
        document.getElementById('completedTasks').textContent = metrics.completedTasks;
        document.getElementById('activePlans').textContent = metrics.activePlans;
        document.getElementById('tokensUsed').textContent = metrics.tokensUsed.toLocaleString();
    }

    updateProgressData() {
        // Update progress bars with mock data
        const progressCards = document.querySelectorAll('.progress-card');
        progressCards.forEach((card, index) => {
            const progress = Math.floor(Math.random() * 100);
            const progressFill = card.querySelector('.progress-fill');
            const progressText = card.querySelector('.progress-text');
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% Complete`;
        });
    }

    updateTaskStates() {
        // Check which tasks are configured
        this.taskConfigurations.forEach((config, taskName) => {
            this.updateTaskStatus(taskName, 'configured');
            this.enableTaskExecution(taskName);
        });
    }

    loadRecentActivity() {
        const activities = [
            'Extension loaded successfully',
            'Connected to AI provider',
            'Project configuration validated',
            'Ready for spec-driven development'
        ];

        const activityList = document.getElementById('recentActivity');
        activityList.innerHTML = '';

        activities.forEach((activity, index) => {
            this.addActivityItem(activity, this.getRelativeTime(index));
        });
    }

    addActivityItem(text, time = 'Just now') {
        const activityList = document.getElementById('recentActivity');
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <span class="activity-time">${time}</span>
            <span class="activity-text">${text}</span>
        `;
        activityList.insertBefore(activityItem, activityList.firstChild);

        // Limit to 10 items
        while (activityList.children.length > 10) {
            activityList.removeChild(activityList.lastChild);
        }
    }

    getRelativeTime(index) {
        const times = ['Just now', '2 minutes ago', '5 minutes ago', '10 minutes ago'];
        return times[index] || '15 minutes ago';
    }

    loadSettings() {
        // Load saved settings from VSS data service
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService) => {
            dataService.getValue('settings').then((settings) => {
                if (settings) {
                    this.applySettings(settings);
                }
            });
        });
    }

    saveSettings() {
        const settings = this.getSettingsFromForm();
        
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService) => {
            dataService.setValue('settings', settings).then(() => {
                this.showNotification('Settings saved successfully!', 'success');
            });
        });
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            const defaultSettings = this.getDefaultSettings();
            this.applySettings(defaultSettings);
            this.showNotification('Settings reset to defaults!', 'info');
        }
    }

    getSettingsFromForm() {
        return {
            aiProvider: document.getElementById('aiProvider').value,
            apiKey: document.getElementById('apiKey').value,
            defaultPath: document.getElementById('defaultPath').value,
            templatePath: document.getElementById('templatePath').value,
            enableVerboseLogging: document.getElementById('enableVerboseLogging').checked,
            enableAutoValidation: document.getElementById('enableAutoValidation').checked
        };
    }

    applySettings(settings) {
        document.getElementById('aiProvider').value = settings.aiProvider || 'claude';
        document.getElementById('apiKey').value = settings.apiKey || '';
        document.getElementById('defaultPath').value = settings.defaultPath || '$(Build.SourcesDirectory)';
        document.getElementById('templatePath').value = settings.templatePath || '';
        document.getElementById('enableVerboseLogging').checked = settings.enableVerboseLogging || false;
        document.getElementById('enableAutoValidation').checked = settings.enableAutoValidation || false;
    }

    getDefaultSettings() {
        return {
            aiProvider: 'claude',
            apiKey: '',
            defaultPath: '$(Build.SourcesDirectory)',
            templatePath: '',
            enableVerboseLogging: false,
            enableAutoValidation: false
        };
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add to body
        document.body.appendChild(notification);

        // Position notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    getNotificationColor(type) {
        const colors = {
            info: '#007bff',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };
        return colors[type] || colors.info;
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.parentNode.removeChild(notification);
            }, 300);
        }
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);

// Initialize the hub
const speckitHub = new SpeckitHub();