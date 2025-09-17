# GitHub Secrets Setup Guide

## Required GitHub Secrets

To enable automated deployment of your Azure DevOps extension, you need to set up the following secrets in your GitHub repository:

### 1. Azure DevOps Personal Access Token

**Secret Name:** `AZURE_DEVOPS_EXT_PAT`

**How to create:**
1. Go to your Azure DevOps organization
2. Click on your profile picture (top right)
3. Select **Personal Access Tokens**
4. Click **New Token**
5. Configure the token:
   - **Name:** `GitHub Actions Extension Deploy`
   - **Organization:** Select your organization
   - **Expiration:** 1 year (recommended)
   - **Scopes:**
     - ✅ **Extensions**: Read & Manage
     - ✅ **Project and Team**: Read
     - ✅ **Build**: Read & Execute
     - ✅ **Release**: Read & Execute
6. Click **Create**
7. **Copy the token immediately** (you won't see it again)

**How to add to GitHub:**
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_DEVOPS_EXT_PAT`
5. Value: Paste your token
6. Click **Add secret**

### 2. Azure DevOps Organization Name

**Secret Name:** `AZURE_DEVOPS_ORG`

**Value:** Your Azure DevOps organization name (e.g., `mycompany`)

**How to find:**
- Go to your Azure DevOps organization
- Look at the URL: `https://dev.azure.com/YOUR_ORG_NAME`
- The organization name is the part after `/dev.azure.com/`

**How to add to GitHub:**
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_DEVOPS_ORG`
5. Value: Your organization name (without `https://dev.azure.com/`)
6. Click **Add secret**

### 3. Azure DevOps Project Name

**Secret Name:** `AZURE_DEVOPS_PROJECT`

**Value:** The project name where you'll test the extension

**How to find:**
- Go to your Azure DevOps project
- Look at the URL: `https://dev.azure.com/ORG_NAME/PROJECT_NAME`
- The project name is the part after the organization name

**How to add to GitHub:**
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_DEVOPS_PROJECT`
5. Value: Your project name
6. Click **Add secret**

## Optional Secrets

### 4. GitHub Token (for releases)

**Secret Name:** `GITHUB_TOKEN`

**Note:** This is automatically provided by GitHub Actions, no setup needed.

### 5. Notification Webhook (optional)

**Secret Name:** `NOTIFICATION_WEBHOOK`

**Value:** Webhook URL for notifications (Slack, Teams, etc.)

## Verification

After setting up all secrets, you can verify they're working by:

1. **Check the secrets are set:**
   - Go to your GitHub repository
   - Click **Settings** → **Secrets and variables** → **Actions**
   - You should see all the secrets listed

2. **Test the workflow:**
   - Go to **Actions** tab in your repository
   - Find the "Deploy Azure DevOps Extension" workflow
   - Click **Run workflow**
   - Select the branch and click **Run workflow**

3. **Check the logs:**
   - Click on the running workflow
   - Check each step for any errors
   - Look for "✅ Extension deployed successfully" message

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check if the PAT token is correct
   - Verify the token has the right scopes
   - Ensure the token hasn't expired

2. **"Organization not found"**
   - Check if `AZURE_DEVOPS_ORG` secret is correct
   - Verify the organization name (case-sensitive)

3. **"Project not found"**
   - Check if `AZURE_DEVOPS_PROJECT` secret is correct
   - Verify the project name (case-sensitive)

4. **"Extension upload failed"**
   - Check if you have the right permissions in Azure DevOps
   - Verify the extension ID doesn't conflict with existing extensions

### Getting Help:

- Check the GitHub Actions logs for detailed error messages
- Verify all secrets are set correctly
- Test the Azure DevOps connection manually
- Check Azure DevOps audit logs for any issues

## Security Best Practices

1. **Use minimal required permissions** for the PAT token
2. **Set appropriate expiration** (1 year max recommended)
3. **Rotate tokens regularly** (every 6 months)
4. **Monitor token usage** in Azure DevOps audit logs
5. **Never commit secrets** to your repository
6. **Use environment-specific secrets** for different environments

## Next Steps

Once all secrets are configured:

1. **Test the deployment** by pushing to the main branch
2. **Verify the extension** appears in your Azure DevOps organization
3. **Test the extension** in a real pipeline
4. **Monitor the deployment** logs for any issues
5. **Set up notifications** for deployment status

---

**Need help?** Check the GitHub Actions logs or create an issue in the repository.
