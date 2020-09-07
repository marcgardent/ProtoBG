const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
      app: './index.js',
      "editor.worker": 'monaco-editor-core/esm/vs/editor/editor.worker.js'
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:  'app.js',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.ttf$/,
      use: ['file-loader']
    }]
  },
  plugins: [
    new MonacoWebpackPlugin({
        languages: ['typescript', 'javascript', 'css']
    })
  ]
};