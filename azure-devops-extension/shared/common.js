// Shared JavaScript utilities for AI Pundit Speckit Extension

class SpeckitAPI {
    /**
     * Base API class for making requests to Azure DevOps services
     */
    constructor() {
        this.projectId = null;
        this.teamId = null;
        this.webContext = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            this.webContext = VSS.getWebContext();
            this.projectId = this.webContext.project.id;
            this.teamId = this.webContext.team.id;
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize SpeckitAPI:', error);
            throw error;
        }
    }

    async getExtensionData(key) {
        await this.initialize();
        const dataService = await VSS.getService(VSS.ServiceIds.ExtensionData);
        return await dataService.getValue(key);
    }

    async setExtensionData(key, value) {
        await this.initialize();
        const dataService = await VSS.getService(VSS.ServiceIds.ExtensionData);
        return await dataService.setValue(key, value);
    }

    async getWorkItems(wiql) {
        await this.initialize();
        const witClient = await VSS.getService(VSS.ServiceIds.WorkItemTracking);
        return await witClient.queryByWiql({ query: wiql }, this.projectId);
    }

    async createWorkItem(workItemType, fields) {
        await this.initialize();
        const witClient = await VSS.getService(VSS.ServiceIds.WorkItemTracking);
        
        const patchDocument = Object.keys(fields).map(field => ({
            op: 'add',
            path: `/fields/${field}`,
            value: fields[field]
        }));

        return await witClient.createWorkItem(patchDocument, this.projectId, workItemType);
    }

    async getBuildDefinitions() {
        await this.initialize();
        const buildClient = await VSS.getService(VSS.ServiceIds.Build);
        return await buildClient.getDefinitions(this.projectId);
    }

    async queueBuild(definitionId, parameters) {
        await this.initialize();
        const buildClient = await VSS.getService(VSS.ServiceIds.Build);
        
        const build = {
            definition: { id: definitionId },
            project: { id: this.projectId },
            parameters: JSON.stringify(parameters)
        };

        return await buildClient.queueBuild(build, this.projectId);
    }
}

class SpeckitNotification {
    /**
     * Notification system for consistent messaging across the extension
     */
    static show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `speckit-notification speckit-notification-${type}`;
        notification.innerHTML = `
            <div class="speckit-notification-content">
                <span class="speckit-notification-icon">${this.getIcon(type)}</span>
                <span class="speckit-notification-message">${message}</span>
                <button class="speckit-notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        this.addStyles();
        document.body.appendChild(notification);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    this.remove(notification);
                }
            }, duration);
        }

        return notification;
    }

    static getIcon(type) {
        const icons = {
            success: '✓',
            error: '⚠',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    static remove(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    static addStyles() {
        if (document.getElementById('speckit-notification-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'speckit-notification-styles';
        styles.textContent = `
            .speckit-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                z-index: 1000;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease;
            }

            .speckit-notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                color: white;
            }

            .speckit-notification-info .speckit-notification-content {
                background: #0078d4;
            }

            .speckit-notification-success .speckit-notification-content {
                background: #28a745;
            }

            .speckit-notification-warning .speckit-notification-content {
                background: #ffc107;
                color: #212529;
            }

            .speckit-notification-error .speckit-notification-content {
                background: #dc3545;
            }

            .speckit-notification-icon {
                font-weight: bold;
                font-size: 16px;
            }

            .speckit-notification-message {
                flex: 1;
                font-size: 14px;
            }

            .speckit-notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                opacity: 0.8;
                transition: opacity 0.2s ease;
            }

            .speckit-notification-close:hover {
                opacity: 1;
                background: rgba(0, 0, 0, 0.1);
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
}

class SpeckitStorage {
    /**
     * Simplified storage management for extension data
     */
    static async get(key, defaultValue = null) {
        try {
            const dataService = await VSS.getService(VSS.ServiceIds.ExtensionData);
            const value = await dataService.getValue(key);
            return value !== undefined ? value : defaultValue;
        } catch (error) {
            console.error(`Failed to get storage value for key "${key}":`, error);
            return defaultValue;
        }
    }

    static async set(key, value) {
        try {
            const dataService = await VSS.getService(VSS.ServiceIds.ExtensionData);
            return await dataService.setValue(key, value);
        } catch (error) {
            console.error(`Failed to set storage value for key "${key}":`, error);
            throw error;
        }
    }

    static async remove(key) {
        try {
            const dataService = await VSS.getService(VSS.ServiceIds.ExtensionData);
            return await dataService.setValue(key, undefined);
        } catch (error) {
            console.error(`Failed to remove storage value for key "${key}":`, error);
            throw error;
        }
    }

    static async getSettings() {
        return await this.get('settings', {
            aiProvider: 'claude',
            apiKey: '',
            defaultPath: '$(Build.SourcesDirectory)',
            templatePath: '',
            enableVerboseLogging: false,
            enableAutoValidation: false
        });
    }

    static async saveSettings(settings) {
        return await this.set('settings', settings);
    }

    static async getTaskConfiguration(taskName) {
        return await this.get(`task-config-${taskName}`, null);
    }

    static async saveTaskConfiguration(taskName, config) {
        return await this.set(`task-config-${taskName}`, config);
    }
}

class SpeckitModal {
    /**
     * Modal dialog helper for consistent UI
     */
    static show(title, content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'speckit-modal';
        modal.innerHTML = `
            <div class="speckit-modal-content">
                <div class="speckit-modal-header">
                    <h3 class="speckit-modal-title">${title}</h3>
                    <button class="speckit-modal-close" type="button">&times;</button>
                </div>
                <div class="speckit-modal-body">
                    ${content}
                </div>
                ${options.footer ? `<div class="speckit-modal-footer">${options.footer}</div>` : ''}
            </div>
        `;

        this.addStyles();
        document.body.appendChild(modal);

        // Event handlers
        const closeBtn = modal.querySelector('.speckit-modal-close');
        const closeModal = () => this.close(modal);

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // ESC key handler
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);

        return modal;
    }

    static close(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    static confirm(title, message, onConfirm, onCancel) {
        const footer = `
            <button class="btn btn-secondary" onclick="SpeckitModal.close(this.closest('.speckit-modal')); ${onCancel || ''}">Cancel</button>
            <button class="btn btn-primary" onclick="SpeckitModal.close(this.closest('.speckit-modal')); ${onConfirm || ''}">Confirm</button>
        `;

        return this.show(title, `<p>${message}</p>`, { footer });
    }

    static addStyles() {
        if (document.getElementById('speckit-modal-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'speckit-modal-styles';
        styles.textContent = `
            .speckit-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 1050;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .speckit-modal.show {
                opacity: 1;
            }

            .speckit-modal-content {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .speckit-modal.show .speckit-modal-content {
                transform: scale(1);
            }

            .speckit-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 25px;
                border-bottom: 1px solid #e9ecef;
            }

            .speckit-modal-title {
                margin: 0;
                color: #333;
                font-size: 18px;
                font-weight: 600;
            }

            .speckit-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .speckit-modal-close:hover {
                background: #f8f9fa;
                color: #333;
            }

            .speckit-modal-body {
                padding: 25px;
                max-height: 60vh;
                overflow-y: auto;
            }

            .speckit-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                padding: 20px 25px;
                border-top: 1px solid #e9ecef;
                background: #f8f9fa;
            }
        `;
        document.head.appendChild(styles);
    }
}

class SpeckitUtils {
    /**
     * Utility functions for common operations
     */
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    static formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    static formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSeconds < 60) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return new Date(date).toLocaleDateString();
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    static generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    static sanitizeHtml(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    static copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'absolute';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            } finally {
                textArea.remove();
            }
        }
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    static createLoadingSpinner(size = '1rem') {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.width = size;
        spinner.style.height = size;
        return spinner;
    }
}

class SpeckitTaskExecutor {
    /**
     * Task execution helper for running Speckit tasks
     */
    constructor() {
        this.runningTasks = new Set();
        this.taskHistory = [];
    }

    async executeTask(taskName, configuration) {
        if (this.runningTasks.has(taskName)) {
            throw new Error(`Task ${taskName} is already running`);
        }

        this.runningTasks.add(taskName);
        
        try {
            const result = await this.runTask(taskName, configuration);
            this.addToHistory(taskName, 'success', result);
            return result;
        } catch (error) {
            this.addToHistory(taskName, 'error', error.message);
            throw error;
        } finally {
            this.runningTasks.delete(taskName);
        }
    }

    async runTask(taskName, configuration) {
        // This would integrate with your actual task execution system
        // For now, we'll simulate the task execution
        
        const delay = Math.random() * 3000 + 1000; // 1-4 seconds
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Simulate success/failure
        if (Math.random() > 0.9) {
            throw new Error(`Task ${taskName} failed: Simulated error`);
        }
        
        return {
            taskName,
            status: 'completed',
            duration: delay,
            timestamp: new Date(),
            output: `Task ${taskName} completed successfully with configuration: ${JSON.stringify(configuration, null, 2)}`
        };
    }

    addToHistory(taskName, status, details) {
        this.taskHistory.unshift({
            taskName,
            status,
            details,
            timestamp: new Date()
        });
        
        // Keep only last 50 entries
        if (this.taskHistory.length > 50) {
            this.taskHistory = this.taskHistory.slice(0, 50);
        }
    }

    isTaskRunning(taskName) {
        return this.runningTasks.has(taskName);
    }

    getRunningTasks() {
        return Array.from(this.runningTasks);
    }

    getTaskHistory(limit = 10) {
        return this.taskHistory.slice(0, limit);
    }
}

// Global instances
window.SpeckitAPI = SpeckitAPI;
window.SpeckitNotification = SpeckitNotification;
window.SpeckitStorage = SpeckitStorage;
window.SpeckitModal = SpeckitModal;
window.SpeckitUtils = SpeckitUtils;
window.SpeckitTaskExecutor = SpeckitTaskExecutor;

// Initialize global task executor
window.speckitTaskExecutor = new SpeckitTaskExecutor();