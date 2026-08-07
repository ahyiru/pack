import path from 'node:path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import OpenBrowserWebpackPlugin from '@huxy/open-browser-webpack-plugin';
import webpackBaseConfigs from './webpack.config.js';
import getEnvConfigs from './envConfigs.js';

const webpackDevConfigs = async ({host} = {}) => {
  const userConfigs = await getEnvConfigs();
  const { projectName = 'Huxy', proxys, devEnv, envConfigs, webpackCfg, webpackDevCfg } = userConfigs;

  const {port, basepath, publicPath} = devEnv;
  const devConfigs = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    output: {
      publicPath,
      filename: 'js/[name].js',
      cssFilename: 'css/[name].css',
    },
    module: {
      parser: {
        html: {
          template: (source, { resource, addDependency }) => {
            addDependency(resource);
            return source.replaceAll('{{title}}', projectName).replaceAll('</body>', `<script src="webpack-hot-middleware/client.js?path=${publicPath}__webpack_hmr&reload=true"></script> </body>`);
          },
        },
      },
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
          basepath,
          PROXY: proxys,
          buildTime: +new Date(),
          ...envConfigs,
        }),
      }),
      new OpenBrowserWebpackPlugin({ target: `http://${host}:${port}${publicPath}` }),
    ],
  };

  return merge(webpackBaseConfigs(userConfigs), devConfigs, webpackCfg, webpackDevCfg);
};

export default webpackDevConfigs;
