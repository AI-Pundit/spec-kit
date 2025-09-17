# PowerShell script to set up GitHub repository for Azure DevOps Extension
# Run this script after creating your GitHub repository

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepoUrl,
    
    [Parameter(Mandatory=$false)]
    [string]$Branch = "main"
)

Write-Host "🚀 Setting up GitHub repository for Azure DevOps Extension" -ForegroundColor Green

# Check if git is available
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not in PATH. Please install Git first."
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M $Branch
}

# Add remote origin
Write-Host "Adding remote origin: $GitHubRepoUrl" -ForegroundColor Yellow
git remote add origin $GitHubRepoUrl

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Azure DevOps Extension for Spec-Driven Development

- 4 Build Tasks: Specify, Plan, Tasks, ValidateSpec
- 2 Dashboard Widgets: Spec Progress, AI Assistant Status
- Full AI Integration: Claude, Gemini, Copilot, Cursor
- Cross-platform support: Windows, Linux, macOS
- Automated deployment with GitHub Actions"

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin $Branch

Write-Host "✅ Repository setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to your GitHub repository settings" -ForegroundColor White
Write-Host "2. Navigate to Secrets and variables → Actions" -ForegroundColor White
Write-Host "3. Add the required secrets (see scripts/setup-github-secrets.md)" -ForegroundColor White
Write-Host "4. Test the deployment by pushing changes to main branch" -ForegroundColor White
Write-Host ""
Write-Host "Required secrets:" -ForegroundColor Yellow
Write-Host "- AZURE_DEVOPS_EXT_PAT: Your Azure DevOps Personal Access Token" -ForegroundColor White
Write-Host "- AZURE_DEVOPS_ORG: Your Azure DevOps organization name" -ForegroundColor White
Write-Host "- AZURE_DEVOPS_PROJECT: Your Azure DevOps project name" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: scripts/setup-github-secrets.md" -ForegroundColor Cyan
