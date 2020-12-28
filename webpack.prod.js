const { merge } = require('webpack-merge');
const config = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(config, {
  entry: './src/js/index.js',
  mode: 'production',
  devtool: false,
  performance: {
    maxEntrypointSize: 90000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
})
