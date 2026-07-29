import path from 'node:path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import OpenBrowserWebpackPlugin from '@huxy/open-browser-webpack-plugin';
import webpackBaseConfigs from './webpack.config.js';
import getEnvConfigs from './envConfigs.js';

const webpackDevConfigs = async (config) => {
  const userConfigs = await getEnvConfigs();
  const { HOST, PROXY, envConfigs, devRoot, webpackCfg, webpackDevCfg } = userConfigs;

  const PORT = config.port ?? userConfigs.PORT;

  const getCssLoaderOptions = () => ({
    importLoaders: 1,
    modules: {
      mode: 'global',
      localIdentName: '[name]__[local]--[hash:base64:5]',
    },
  });

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
          type: 'javascript/auto',
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: getCssLoaderOptions(),
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
        {
          test: /\.less$/,
          type: 'javascript/auto',
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                ...getCssLoaderOptions(),
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
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
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.isDev': JSON.stringify(true),
        'process.env.configs': JSON.stringify({
          basepath: devRoot,
          PROXY,
          buildTime: +new Date(),
          ...envConfigs,
        }),
        EMAIL: JSON.stringify('ah.yiru@gmail.com'),
        VERSION: JSON.stringify('2.x.x'),
      }),
      new OpenBrowserWebpackPlugin({ target: `http://${HOST}:${PORT}` }),
    ],
  };

  return merge(webpackBaseConfigs(userConfigs), devConfigs, webpackCfg, webpackDevCfg);
};

export default webpackDevConfigs;
