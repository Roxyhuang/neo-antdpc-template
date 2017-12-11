import config from 'config';
import path from 'path';
import webpack from 'webpack';
import chalk from 'chalk';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SaveAssetsJson from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import JavaScriptObfuscator from 'webpack-obfuscator';
// import ZipPlugin from 'zip-webpack-plugin';

import webpackConfig from './webpack.base.conf';

const theme = require('../../package.json').theme;
const PUBLIC_PATH = config.get('publicPath');
const APP_ENTRY_POINT = config.get('appEntry');
const IS_DEBUG = config.get('debug') || false;
const BUNDLE_LIST = config.get('bundleConfig') || [];
const IS_UGLIFYJS = config.get('env') !== 'release';
const TEMPLATE_PAGE = config.get('templatePage') || 'public/index.html';

let webpackProdOutput;

let vendorList = config.get('vendorList') || [];

if (IS_DEBUG) {
  vendorList.unshift('eruda');
}

let entryConfig = {
  vendors: vendorList
};

entryConfig = Object.assign(entryConfig, BUNDLE_LIST);

// Config for Javascript file

Object.entries(APP_ENTRY_POINT).forEach(item => {
  Object.assign(entryConfig, {[`assets/js/${item[0]}`]: [item[1]]});
});

//Config for output

webpackProdOutput = {
  publicPath: `${PUBLIC_PATH}/`,
  filename: '[name].[chunkhash].js',
  chunkFilename: "assets/js/[id].[chunkhash].js",
};

webpackConfig.output = Object.assign(webpackConfig.output, webpackProdOutput);

webpackConfig.devtool = 'source-map';

webpackConfig.entry = entryConfig;

webpackConfig.module.rules = webpackConfig.module.rules.concat({});

webpackConfig.plugins.push(
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
  new webpack.IgnorePlugin(/un~$/),
  new StyleLintPlugin({
    context: "src",
    configFile: '.stylelintrc.js',
    files: '**/*.less',
    failOnError: false,
    quiet: false,
    syntax: 'less'
  }),
);

if (IS_UGLIFYJS) {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        drop_console: config.get('env') === 'production',
        sequences: true,
        properties: true,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        unused: true,
        booleans: true,
        if_return: true,
        join_vars: true,
        loops: true,
        hoist_funs: true,
        cascade: true
      },
      mangle: {eval: true, toplevel: true, properties: true,},
      properties: {
        output: {
          ascii_only: true,
          code: true  // optional - faster if false
        }
      }
    }),
  );
}

webpackConfig.module.rules = webpackConfig.module.rules.concat(
  {
    test: /\.css|less$/,
    exclude: [path.resolve('node_modules'), path.resolve('src/assets/css/mod_css')],
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
      use: [
        'css-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
        {
          loader: 'postcss-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
          options: {
            sourceMap: true,
            config: {
              path: 'build/config/postcss.config.js'
            }
          }
        },
        'less-loader?modules&localIdentName=[name]__[local]-[hash:base64:5]',
      ]
    })
  },
  {
    test: /\.css|less$/,
    include: [path.resolve('node_modules'), path.resolve('src/assets/css/mod_css')],
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader?sourceMap=true',
        {
          loader: 'postcss-loader?sourceMap=true',
          options: {
            sourceMap: true,
            config: {
              path: 'build/config/postcss.config.js'
            }
          }
        },
        {
          loader:  'less-loader?sourceMap=true',
          options: {modifyVars: theme}
        }

      ]
    })
  },
);

// Config for Html file and other plugins
let chunks = [];
Object.keys(BUNDLE_LIST).forEach((chunk) => {
  chunks.push(chunk);
});
Object.keys(APP_ENTRY_POINT).forEach(name => {

  if (IS_UGLIFYJS) {
    webpackConfig.plugins.push(
      new JavaScriptObfuscator({
        rotateUnicodeArray: true
      }, [`${name}.js`])
    );
  }
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: TEMPLATE_PAGE,
      inject: 'true',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunks: [`assets/js/${name}`, 'vendors', ...chunks],
    }),
    new ExtractTextPlugin({
      filename: 'assets/css/global.[chunkhash].css',
      disable: false,
      allChunks: true,
    }),
    new SaveAssetsJson({
      // path: path.join(__dirname, 'dist'),
      filename: 'dist/assets/assets.json',
      prettyPrint: true,
      metadata: {
        version: process.env.PACKAGE_VERSION,
      },
    }),
    new CopyWebpackPlugin([{
      from: 'public/assets/',
      to: 'assets/'
    }]),
  );
});

// if (config.get('env') === 'production') {
//   webpackConfig.plugins.push(
//     new ZipPlugin({
//       filename: `${config.get('zipConfig').dirName}` || 'dist',
//     })
//   )
// }

export default webpackConfig;

