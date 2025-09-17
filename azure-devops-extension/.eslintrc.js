module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    // Basic rules for Azure DevOps extensions
    'no-console': 'off',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'off' // TypeScript handles this
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '/tasks/',  // This ignores the root tasks/ directory (compiled JS files)
    '/widgets/' // This ignores the root widgets/ directory (compiled JS files)
  ]
};
