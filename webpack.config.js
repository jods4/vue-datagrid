const { resolve } = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',

  entry: './demo/main',

  output: {
    path: resolve(__dirname, './dist'),
  },

  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },

  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
      { 
        test: /\.ts$/, 
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
  ],

  devServer: {
    hot: true,
    publicPath: '/dist/',
  },
});