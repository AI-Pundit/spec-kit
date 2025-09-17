# 🤖 GitHub Actions Automation Setup Guide

This guide will help you set up automated deployment of your Azure DevOps extension using GitHub Actions.

## 📋 Prerequisites

### 1. Azure DevOps Requirements
- **Azure DevOps Organization** with admin access
- **Personal Access Token** with extension management permissions
- **Project** for testing the extension

### 2. GitHub Requirements
- **GitHub Repository** (public or private)
- **GitHub Actions** enabled
- **Repository admin access**

## 🚀 Quick Setup (5 minutes)

### Step 1: Create GitHub Repository

1. **Go to GitHub** and create a new repository:
   - Repository name: `spec-kit-azure-devops-extension`
   - Description: `Azure DevOps Extension for Spec-Driven Development`
   - Visibility: Public (recommended) or Private
   - Initialize with README: ✅

2. **Clone the repository locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/spec-kit-azure-devops-extension.git
   cd spec-kit-azure-devops-extension
   ```

### Step 2: Copy Extension Files

1. **Copy all extension files** to your repository:
   ```bash
   # Copy from your local extension directory
   cp -r /path/to/azure-devops-extension/* .
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add Azure DevOps Extension files"
   git push origin main
   ```

### Step 3: Set Up GitHub Secrets

1. **Go to your repository** on GitHub
2. **Click Settings** → **Secrets and variables** → **Actions**
3. **Add these secrets:**

#### Required Secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AZURE_DEVOPS_EXT_PAT` | Personal Access Token | `abc123...` |
| `AZURE_DEVOPS_ORG` | Organization name | `mycompany` |
| `AZURE_DEVOPS_PROJECT` | Project name | `myproject` |

#### How to get the values:

**AZURE_DEVOPS_EXT_PAT:**
1. Go to Azure DevOps → User Settings → Personal Access Tokens
2. Create new token with these scopes:
   - ✅ Extensions: Read & Manage
   - ✅ Project and Team: Read
   - ✅ Build: Read & Execute
3. Copy the token

**AZURE_DEVOPS_ORG:**
- From your Azure DevOps URL: `https://dev.azure.com/YOUR_ORG_NAME`
- Use: `YOUR_ORG_NAME`

**AZURE_DEVOPS_PROJECT:**
- From your Azure DevOps URL: `https://dev.azure.com/ORG/PROJECT_NAME`
- Use: `PROJECT_NAME`

### Step 4: Test the Automation

1. **Make a small change** to trigger the workflow:
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test automated deployment"
   git push origin main
   ```

2. **Check the workflow:**
   - Go to **Actions** tab in your repository
   - Look for "Deploy Azure DevOps Extension" workflow
   - Click on it to see the progress

3. **Verify deployment:**
   - Go to your Azure DevOps organization
   - Navigate to **Organization Settings** → **Extensions**
   - Look for "Spec Kit - Spec-Driven Development"

## 🔧 Advanced Configuration

### Customizing the Workflow

The GitHub Actions workflows are located in `.github/workflows/`:

- **`deploy-extension.yml`** - Main deployment workflow
- **`test-extension.yml`** - Testing workflow
- **`config.yml`** - Reusable configuration

### Environment-Specific Deployment

You can set up different environments:

```yaml
# .github/workflows/deploy-extension.yml
strategy:
  matrix:
    environment: [development, staging, production]
```

### Notification Setup

Add notifications for deployment status:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📊 Monitoring and Maintenance

### 1. Workflow Monitoring

- **Check workflow runs** regularly in the Actions tab
- **Monitor deployment logs** for any errors
- **Set up notifications** for failed deployments

### 2. Extension Updates

- **Version management** is handled automatically
- **Tag releases** to trigger production deployments
- **Test in development** before promoting to production

### 3. Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Authentication failed | Check PAT token permissions |
| Organization not found | Verify `AZURE_DEVOPS_ORG` secret |
| Extension upload failed | Check extension ID conflicts |
| Build fails | Check Node.js/Python versions |

## 🎯 Workflow Triggers

### Automatic Triggers:
- **Push to main branch** - Deploy to development
- **Push to develop branch** - Deploy to staging
- **Create tag (v*)** - Deploy to production
- **Pull request** - Run tests only

### Manual Triggers:
- **Workflow dispatch** - Run any workflow manually
- **Test specific scenarios** - Use test workflow

## 📈 Success Metrics

Track these metrics to ensure your automation is working:

- **Deployment Success Rate**: >95%
- **Average Deployment Time**: <5 minutes
- **Test Pass Rate**: >90%
- **Extension Availability**: 99.9% uptime

## 🔒 Security Best Practices

1. **Use minimal permissions** for PAT tokens
2. **Rotate tokens regularly** (every 6 months)
3. **Monitor token usage** in Azure DevOps
4. **Use environment-specific secrets**
5. **Never commit secrets** to repository

## 📞 Support

If you encounter issues:

1. **Check the logs** in GitHub Actions
2. **Verify secrets** are set correctly
3. **Test Azure DevOps connection** manually
4. **Check Azure DevOps audit logs**
5. **Create an issue** in the repository

## 🎉 Next Steps

Once automation is set up:

1. **Test the extension** in Azure DevOps
2. **Create sample pipelines** using the tasks
3. **Gather feedback** from your team
4. **Plan for public distribution** (Visual Studio Marketplace)
5. **Monitor usage** and performance

---

**Ready to automate? Follow the Quick Setup guide above and you'll have automated deployment in 5 minutes!** 🚀
