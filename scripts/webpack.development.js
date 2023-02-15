const webpack = require('webpack');
const path = require('path');
const {merge} = require('webpack-merge');
const OpenBrowserWebpackPlugin = require('@huxy/open-browser-webpack-plugin');

const webpackBaseConfigs = require('./webpack.config');

const {HOST, PORT, PROXY, defProject, devRoot, webpackDevCfg} = require('./envConfigs');

const devConfigs = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  target: 'web',
  entry: {
    app: ['webpack-hot-middleware/client?reload=true'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'global',
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
        ],
        // exclude: [/node_modules/],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'global',
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
        // exclude: [/node_modules/],
      },
      /* {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                indentWidth: 2,
              },
              additionalData: (content, loaderContext) => {
                if (loaderContext.resourcePath.endsWith('app/styles/index.scss')) {
                  return content;
                }
                return `@import '~@app/styles/index.scss';${content};`;
              },
            },
          },
        ],
      }, */
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        configs: JSON.stringify({
          isDev: true,
          browserRouter: false,
          basepath: devRoot,
          PROXY,
          defProject,
          buildTime: +new Date(),
        }),
      },
      EMAIL: JSON.stringify('ah.yiru@gmail.com'),
      VERSION: JSON.stringify('2.x.x'),
    }),
    new OpenBrowserWebpackPlugin({target: `${HOST}:${PORT}`}),
  ],
};

if (webpackDevCfg.resolve?.alias) {
  Object.keys(webpackDevCfg.resolve.alias).map(key => {
    webpackDevCfg.resolve.alias[key] = path.resolve(process.cwd(), webpackDevCfg.resolve.alias[key]);
  });
}

module.exports = merge(webpackBaseConfigs, devConfigs, webpackDevCfg);
