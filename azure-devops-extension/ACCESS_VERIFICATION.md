# Azure DevOps Extension Access Verification

## 🔍 **Step-by-Step Access Check**

### **Step 1: Verify Azure DevOps Access**

#### **Check Organization Access:**
1. Go to `https://dev.azure.com`
2. Sign in with your Microsoft account
3. Verify you can see your organization(s)
4. Note down your organization URL

#### **Expected Result:**
- ✅ You can access Azure DevOps
- ✅ You can see your organization(s)
- ✅ You have a valid organization URL

### **Step 2: Check Extension Management Permissions**

#### **Navigate to Extensions:**
1. In Azure DevOps, click **Organization Settings** (gear icon)
2. Look for **Extensions** in the left sidebar
3. Click on **Extensions**

#### **Expected Result:**
- ✅ You can see the Extensions page
- ✅ You can see "Upload new extension" option
- ✅ You can see existing extensions (if any)

#### **If You Can't See Extensions:**
- ❌ You need Organization Administrator permissions
- ❌ Contact your Azure DevOps administrator
- ❌ Request extension management access

### **Step 3: Check Project Permissions**

#### **Navigate to a Project:**
1. Go to any project in your organization
2. Click **Project Settings** (gear icon)
3. Look for **Security** in the left sidebar
4. Check your role/permissions

#### **Expected Result:**
- ✅ You have Project Administrator or Project Contributor role
- ✅ You can access project settings
- ✅ You can see security/permissions

### **Step 4: Check Pipeline Access**

#### **Navigate to Pipelines:**
1. Go to **Pipelines** → **Pipelines**
2. Try to create a new pipeline
3. Check if you can access the task catalog

#### **Expected Result:**
- ✅ You can create/edit pipelines
- ✅ You can see the task catalog
- ✅ You have build permissions

### **Step 5: Check Work Item Access**

#### **Navigate to Boards:**
1. Go to **Boards** → **Work Items**
2. Try to create a new work item
3. Check if you can assign work items

#### **Expected Result:**
- ✅ You can create work items
- ✅ You can assign work items
- ✅ You have work item permissions

## 🚨 **Common Access Issues & Solutions**

### **Issue 1: "Extensions" Not Visible**

#### **Problem:**
- Can't see Extensions in Organization Settings
- No "Upload new extension" option

#### **Solution:**
1. **Contact Organization Administrator**
2. **Request extension management permissions**
3. **Ask to be added as Organization Administrator**

#### **Alternative:**
- **Use Visual Studio Marketplace** instead
- **Publish as public extension**
- **Install from marketplace**

### **Issue 2: "Access Denied" When Uploading**

#### **Problem:**
- Can see Extensions but can't upload
- Getting access denied error

#### **Solution:**
1. **Check if you're Organization Administrator**
2. **Verify extension management permissions**
3. **Try uploading from different browser/account**

### **Issue 3: "Can't Create Pipelines"**

#### **Problem:**
- Can't create or edit pipelines
- No access to task catalog

#### **Solution:**
1. **Request Build Administrator role**
2. **Ask for pipeline creation permissions**
3. **Contact project administrator**

### **Issue 4: "Can't Create Work Items"**

#### **Problem:**
- Can't create work items
- No access to boards

#### **Solution:**
1. **Request Project Contributor role**
2. **Ask for work item permissions**
3. **Contact project administrator**

## 📋 **Required Access Summary**

### **For Uploading Extension:**
- ✅ **Azure DevOps Organization Access**
- ✅ **Organization Administrator** or **Extension Management** permissions
- ✅ **Microsoft Account** with valid subscription

### **For Using Extension:**
- ✅ **Project Contributor** or higher
- ✅ **Build permissions** (for pipelines)
- ✅ **Work Item permissions** (for task creation)

### **For AI Assistant Integration:**
- ✅ **Claude API key** (if using Claude)
- ✅ **Gemini API key** (if using Gemini)
- ✅ **GitHub Copilot subscription** (if using Copilot)
- ✅ **Cursor IDE account** (if using Cursor)

## 🔧 **How to Request Access**

### **If You Don't Have Required Permissions:**

#### **1. Contact Organization Administrator**
```
Subject: Request for Azure DevOps Extension Management Access

Hi [Admin Name],

I need to upload and manage Azure DevOps extensions for our organization. 
Could you please grant me the following permissions:

- Organization Administrator role (or Extension Management permissions)
- Project Contributor role for [Project Name]
- Build Administrator role for pipeline management

This is for deploying a Spec-Driven Development extension that will 
improve our development workflow.

Thanks!
[Your Name]
```

#### **2. Alternative: Use Visual Studio Marketplace**
- **Publish as public extension**
- **Install from marketplace**
- **No special permissions required**

## ✅ **Access Verification Checklist**

### **Before Uploading:**
- [ ] Can access Azure DevOps organization
- [ ] Can see Extensions in Organization Settings
- [ ] Can upload new extensions
- [ ] Have valid Microsoft account

### **Before Using Extension:**
- [ ] Can create/edit pipelines
- [ ] Can access task catalog
- [ ] Can create work items
- [ ] Have AI assistant configured

### **After Uploading:**
- [ ] Extension appears in Extensions list
- [ ] Can install extension in projects
- [ ] Tasks appear in pipeline task catalog
- [ ] Can run extension tasks successfully

## 🎯 **Next Steps Based on Your Access Level**

### **If You Have Full Access:**
1. **Upload extension** to Azure DevOps
2. **Install in projects**
3. **Test with sample pipeline**
4. **Configure AI assistant**

### **If You Have Limited Access:**
1. **Request additional permissions**
2. **Use Visual Studio Marketplace** as alternative
3. **Test with existing permissions**
4. **Work with administrator**

### **If You Have No Access:**
1. **Contact organization administrator**
2. **Explain the business value**
3. **Request temporary access**
4. **Consider alternative deployment methods**

---

**Need help with any of these steps? Let me know what access you currently have and I can guide you through the next steps!**
