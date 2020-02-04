const path = require('path')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const isProduction = process.env.NODE_ENV === 'production'
const chunkName = isProduction ? '[contenthash:8].chunk' : '[hash].chunk'

console.log(isProduction)

module.exports = {
  entry: [ '@babel/polyfill', isProduction ? './src/JsonParadiseSchema.js' : './src/index.js' ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    publicPath: '/',
    libraryTarget: isProduction ? 'commonjs2' : undefined,
    globalObject: 'this'
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
        test: /\.s[ac]ss|css$/i,
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
        loader: "file-loader"
      },
    ]
  },
  devtool: isProduction ? 'none' : 'cheap-module-source-map',
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
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: `${ chunkName }.css`,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [ 'default', { discardComments: { removeAll: true } } ],
      },
      canPrint: true
    }),
    !isProduction && new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html',
      chunks: "all",
    })
  ].filter(item => !!item),
  devServer: {
    stats: 'errors-only'
  },
  externals: isProduction ? {
    "react": "commonjs react",
    "react-dom": "commonjs react-dom",
    "prop-types": "commonjs prop-types"
  } : {}
};