const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const dev = process.env.NODE_ENV !== 'production';
// const isProd = process.env.npm_lifecycle_event === 'build';// this has to do with which package.json script is run (dev or build)
// // const ifProd = x => isProd && x;// when using babel
// // const ifProd = function(x){return isProd && x;};
// const prodObj = isProd ? {
//   // this is the url of our local sourcemap server
//   //publicPath:  'http://localhost:80/joomla/components/com_arc/xfiles/js/dist/',
//   //publicPath:  path.join(__dirname,'js','dist'),
//   //append: '\n//# sourceMappingURL=https://localhost:80/[url]',
//   filename: '[file].map'
// } : {};

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, '/views/index.html'),
  filename: 'index.html',
  inject: 'body',
});

const DefinePluginConfig = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
});

module.exports = {
  entry: ['@babel/polyfill', path.join(__dirname, '/js/index.jsx')],
  output: {
    filename: 'index.js',
    path: path.join(__dirname, '/js/dist'),
  },
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'cheap-module-eval-source-map' : false,
  plugins: [
    HTMLWebpackPluginConfig,
    DefinePluginConfig,
    new MiniCssExtractPlugin({
      filename: "bundle.css",
      chunkFilename: '[name].chunk.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js(x*)?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
      // {
      //   test: /\.scss$/,
      //   loader: 'sass-loader'//'style-loader!css-loader!sass-loader',
      // },
      {
        test: /\.(s*)?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false, sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }/*[sass-loader failing](https://github.com/sass/node-sass/releases/tag/v4.13.1)*/
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  watch: true,
  watchOptions: {
    ignored: ['files/**/*.js', 'node_modules/**']
  },
};
