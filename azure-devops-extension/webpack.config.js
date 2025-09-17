const path = require('path');

module.exports = {
  entry: {
    'tasks/constitution/task': './src/tasks/constitution/task.ts',
    'tasks/specify/task': './src/tasks/specify/task.ts',
    'tasks/plan/task': './src/tasks/plan/task.ts',
    'tasks/tasks/task': './src/tasks/tasks/task.ts',
    'tasks/validate-spec/task': './src/tasks/validate-spec/task.ts',
    'widgets/spec-progress': './src/widgets/spec-progress/widget.ts',
    'widgets/ai-status': './src/widgets/ai-status/widget.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'azure-pipelines-task-lib': 'azure-pipelines-task-lib',
    'azure-pipelines-tool-lib': 'azure-pipelines-tool-lib',
    'vss-web-extension-sdk': 'vss-web-extension-sdk'
  },
  target: 'node',
  mode: 'production'
};
