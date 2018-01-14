const path = require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');

let config = {
  production: false,
  basePath: path.resolve(__dirname),
  assetsPath: path.resolve(__dirname, './src/assets'),
  sourcePath: path.resolve(__dirname, './src'),
  distPath: path.resolve(__dirname, './dist/debug'),
  sourceMaps: 'inline-source-map' // debugging on Tizen
};

const plugins = [
  new ExtractTextPlugin('css/style.css'),
  new CopyPlugin([
    {
      from: config.sourcePath,
      ignore: ['js/**', 'scss/**']
    },
    {
      from: config.assetsPath,
      to: 'assets'
    }
  ]),
  new UglifyJsPlugin({
    uglifyOptions: {
      ecma: 6,
      output: {
        comments: false,
        beautify: false,
      }
    }
  })
];

if (process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    production: true,
    distPath: path.resolve(__dirname, './dist/release'),
    sourceMaps: 'hidden-source-map'
  });
}

if (typeof process.env.ANALYZE_BUNDLE !== 'undefined') {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  entry: {
    main: path.resolve(config.sourcePath, "./js/main.js")
  },
  output: {
    path: config.distPath,
    filename: "js/[name].bundle.js"
  },
  devtool: config.sourceMaps,
  devServer: {
    contentBase: config.distPath,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ])
      }
    ]
  },
  plugins,
  resolve: {
    modules: [
      path.join(config.sourcePath, 'js'),
      'node_modules'
    ]
  }
};
