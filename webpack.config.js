const path = require('path')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const isProduction = process.env.NODE_ENV === 'production'

console.log(isProduction)

module.exports = {
  entry: [ '@babel/polyfill', './src/index.js' ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: [ /\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.ico$/ ],
        loader: "file-loader",
        options: {
          name: "/assets/media/[name].[ext]",
        }
      },
    ]
  },
  devtool: isProduction ? 'none' : 'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [ 'default', { discardComments: { removeAll: true } } ],
      },
      canPrint: true
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html',
      favicon: './public/assets/media/favicon.ico'
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: { comments: false },
          compress: {
            drop_console: isProduction,
          },
        }
      })
    ]
  },
  devServer: {
    stats: 'errors-only'
  }
};