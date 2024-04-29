import path from 'node:path';
import webpack from 'webpack';
import {EsbuildPlugin} from 'esbuild-loader';
import {merge} from 'webpack-merge';
import OpenBrowserWebpackPlugin from '@huxy/open-browser-webpack-plugin';

const webpackBaseConfigs = (await import('./webpack.config.js')).default;

const {rootDir, HOST, PORT, PROXY, envConfigs, devRoot, webpackDevCfg} = (await import('./envConfigs.js')).default;

process.env.isDev = true;

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
    /* new webpack.DefinePlugin({
        'process.env': {
          configs: JSON.stringify({
            browserRouter: false,
            basepath: devRoot,
            PROXY,
            buildTime: +new Date(),
            ...envConfigs,
          }),
        },
        isDev: true,
        EMAIL: JSON.stringify('ah.yiru@gmail.com'),
        VERSION: JSON.stringify('2.x.x'),
    }), */
    new EsbuildPlugin({
      define: {
        'process.env': {
          configs: JSON.stringify({
            browserRouter: false,
            basepath: devRoot,
            PROXY,
            buildTime: +new Date(),
            ...envConfigs,
          }),
        },
        isDev: true,
        EMAIL: JSON.stringify('ah.yiru@gmail.com'),
        VERSION: JSON.stringify('2.x.x'),
      },
    }),
    new OpenBrowserWebpackPlugin({target: `${HOST}:${PORT}`}),
  ],
};

export default merge(webpackBaseConfigs, devConfigs, webpackDevCfg);
