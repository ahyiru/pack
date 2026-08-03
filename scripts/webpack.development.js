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

  const devConfigs = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    /*entry: {
      huxy: ['webpack-hot-middleware/client?dynamicPublicPath=true'],
    },*/
    output: {
      publicPath: devRoot === '/' ? devRoot : `${devRoot}/`,
      filename: 'js/[name].js',
    },
    optimization: {
      runtimeChunk: 'single',
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        __HUXY_CONFIG__: JSON.stringify({
          EMAIL: 'ah.yiru@gmail.com',
          VERSION: '2.x.x',
          isDev: true,
          basepath: devRoot,
          PROXY,
          buildTime: +new Date(),
          ...envConfigs,
        }),
      }),
      new OpenBrowserWebpackPlugin({ target: `http://${HOST}:${PORT}${devRoot}` }),
    ],
  };

  return merge(webpackBaseConfigs(userConfigs), devConfigs, webpackCfg, webpackDevCfg);
};

export default webpackDevConfigs;
