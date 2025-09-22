# Step-by-Step Guide: Option 1 - Direct Organization Upload

## Overview
This is the **fastest way** to test your AI Pundit Speckit extension during development. You upload the VSIX file directly to your Azure DevOps organization without going through the marketplace.

## Prerequisites ✅
- [x] Extension built and packaged: `Waiin.pundit-speckit-1.0.0.vsix` (265 KB)
- [x] Azure DevOps organization with admin permissions
- [x] Web browser (Chrome, Edge, Firefox)

---

## Step 1: Access Your Azure DevOps Organization

### 1.1 Open Your Organization
1. **Open your web browser**
2. **Navigate to your Azure DevOps organization**
   ```
   https://dev.azure.com/{your-organization-name}
   ```
   Replace `{your-organization-name}` with your actual organization name

3. **Sign in** with your Azure DevOps account
4. **Verify you have admin permissions** (you'll need Organization Administrator or Project Collection Administrator rights)

### 1.2 Navigate to Organization Settings
1. **Click the gear icon** (⚙️) in the bottom left corner
2. **Select "Organization settings"** from the menu
3. **You should see the organization settings page**

---

## Step 2: Access Extensions Management

### 2.1 Find Extensions Section
1. **In the left sidebar**, look for **"Extensions"** under the "General" section
2. **Click on "Extensions"**
3. **You'll see the Extensions management page** with tabs: "Installed", "Browse marketplace"

### 2.2 Verify Current Extensions
1. **Click the "Installed" tab** to see currently installed extensions
2. **Note**: AI Pundit Speckit should NOT be listed yet (we're about to install it)

---

## Step 3: Upload Extension Directly

### 3.1 Upload Your VSIX File
1. **Click "Upload extension"** button (usually in the top-right area)
2. **A file picker dialog will open**
3. **Navigate to your extension directory**:
   ```
   C:\Users\RiteshPokalwar\AI-Pundit-D2C\spec-kit\azure-devops-extension\
   ```
4. **Select the file**: `Waiin.pundit-speckit-1.0.0.vsix`
5. **Click "Open"** or "Select"

### 3.2 Upload Process
1. **File upload begins** - you'll see a progress indicator
2. **Azure DevOps validates the extension** (this takes 10-30 seconds)
3. **Validation results appear**:
   - ✅ **Success**: Extension validated successfully
   - ❌ **Error**: Fix any issues and try again

### 3.3 Installation Dialog
1. **Extension details appear** showing:
   - Name: AI Pundit Speckit
   - Version: 1.0.0
   - Publisher: Waiin
   - Description: Integrate Spec-Driven Development practices...

2. **Click "Install"** button

---

## Step 4: Verify Installation

### 4.1 Check Installed Extensions
1. **Go back to "Installed" tab** in Extensions
2. **Verify "AI Pundit Speckit" appears** in the list
3. **Check the details**:
   - Name: AI Pundit Speckit
   - Version: 1.0.0
   - Publisher: Waiin
   - Status: Installed

### 4.2 Extension Information
1. **Click on the extension** to see details
2. **Verify components are loaded**:
   - 5 Tasks: Specify, Plan, Tasks, ValidateSpec, Constitution
   - 2 Widgets: Spec Progress, AI Assistant Status

---

## Step 5: Test Pipeline Tasks

### 5.1 Create or Edit a Pipeline
1. **Navigate to your project** (not organization settings)
2. **Go to Pipelines** → **Pipelines**
3. **Either**:
   - Create a new pipeline: Click "New pipeline"
   - Edit existing pipeline: Click on a pipeline and "Edit"

### 5.2 Access Task Catalog
1. **In the pipeline editor**, click "Show assistant" (if using visual editor)
2. **OR** if using YAML editor, place cursor where you want to add a task
3. **Click "Tasks" tab** on the right side
4. **Search for extension tasks**

### 5.3 Verify Tasks Are Available
**Search for each task and verify they appear**:

1. **Search "Specify"**
   - Should show: "Specify@1" task
   - Publisher: Waiin

2. **Search "Plan"**
   - Should show: "Plan@1" task
   - Publisher: Waiin

3. **Search "Tasks"**
   - Should show: "Tasks@1" task
   - Publisher: Waiin

4. **Search "ValidateSpec"**
   - Should show: "ValidateSpec@1" task
   - Publisher: Waiin

5. **Search "Constitution"**
   - Should show: "Constitution@1" task
   - Publisher: Waiin

### 5.4 Add a Test Task
1. **Click on "Specify@1"** to add it to your pipeline
2. **Configure the task inputs**:
   - Target Path: `$(System.DefaultWorkingDirectory)`
   - Output Path: `./specs`
   - AI Provider: `claude`
3. **Save the pipeline** (don't run yet, just save)

---

## Step 6: Test Dashboard Widgets

### 6.1 Access Dashboard
1. **Navigate to your project overview**
2. **Click "Dashboards"** in the left menu
3. **Either**:
   - Use existing dashboard: Click "Edit" on a dashboard
   - Create new dashboard: Click "New Dashboard"

### 6.2 Add Widgets
1. **Click "Edit"** to enter edit mode
2. **Click "Add Widget"** (+ button)
3. **Widget catalog opens**

### 6.3 Verify Widgets Are Available
**Search for each widget**:

1. **Search "Spec Progress"**
   - Should show: "Spec Progress Widget"
   - Publisher: Waiin

2. **Search "AI Assistant" or "AI Status"**
   - Should show: "AI Assistant Status Widget"
   - Publisher: Waiin

### 6.4 Add a Test Widget
1. **Click on "Spec Progress Widget"**
2. **Configure widget settings** (if any configuration options appear)
3. **Click "Add"** to add to dashboard
4. **Save dashboard**

---

## Step 7: Validation Checklist

### ✅ Installation Validation
- [ ] Extension appears in Organization Settings → Extensions → Installed
- [ ] Extension shows correct name: "AI Pundit Speckit"
- [ ] Version shows: 1.0.0
- [ ] Publisher shows: Waiin
- [ ] No error messages during installation

### ✅ Pipeline Tasks Validation
- [ ] Specify@1 task appears in pipeline task catalog
- [ ] Plan@1 task appears in pipeline task catalog
- [ ] Tasks@1 task appears in pipeline task catalog
- [ ] ValidateSpec@1 task appears in pipeline task catalog
- [ ] Constitution@1 task appears in pipeline task catalog
- [ ] Can add at least one task to a pipeline
- [ ] Pipeline saves successfully with extension task

### ✅ Widget Validation
- [ ] Spec Progress Widget appears in widget catalog
- [ ] AI Assistant Status Widget appears in widget catalog
- [ ] Can add at least one widget to dashboard
- [ ] Dashboard saves successfully with extension widget

---

## Step 8: Optional - Run Test Pipeline

### 8.1 Create Simple Test Pipeline
```yaml
trigger: none
pool:
  vmImage: ubuntu-latest

steps:
- task: Specify@1
  displayName: 'Test Specify Task'
  inputs:
    targetPath: '$(System.DefaultWorkingDirectory)'
    outputPath: './specs'
    aiProvider: 'claude'
  continueOnError: true
```

### 8.2 Run the Pipeline
1. **Save the pipeline**
2. **Click "Run"**
3. **Monitor execution** - it may fail (expected during testing)
4. **Check logs** to verify the task was recognized and attempted to run

---

## Success Indicators ✅

### You know Option 1 worked when:
1. **Extension installed without errors**
2. **All 5 tasks appear in pipeline editor**
3. **Both widgets appear in dashboard catalog**
4. **Can add tasks to pipeline without errors**
5. **Can add widgets to dashboard without errors**

---

## Next Steps After Successful Testing

### If Option 1 Works Perfectly:
1. **Continue development** using this method for rapid testing
2. **Iterate on features** and re-upload as needed
3. **When stable**, consider Option 2 (Marketplace) for broader testing

### If Issues Found:
1. **Note specific error messages**
2. **Check browser console for JavaScript errors**
3. **Review troubleshooting section in README.md**
4. **Fix issues and rebuild**:
   ```bash
   npm run build
   npm run package
   ```
5. **Re-upload the new VSIX file**

---

## Troubleshooting Quick Fixes

### Extension Not Appearing
- **Clear browser cache** and refresh
- **Try different browser**
- **Verify organization admin permissions**

### Tasks Not Available
- **Refresh pipeline editor page**
- **Clear browser cache**
- **Check if extension shows as "Installed"**

### Upload Fails
- **Check file size** (should be ~265 KB)
- **Verify VSIX file exists and isn't corrupted**
- **Try uploading from different location**

---

**🎯 Goal**: Get your extension installed and visible in your Azure DevOps organization for immediate testing.

**⏱️ Time Required**: 5-10 minutes for first-time setup

**🔄 Iteration**: Repeat upload process each time you make changes (build → package → upload)