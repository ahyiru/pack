import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';

import webpackDevConfigs from './webpack.development.js';

const startDev = nodeServer => async (config, app, httpServer, logger) => {
  const webpackConfig = await webpackDevConfigs(config);
  const compiler = webpack(webpackConfig);

  const {devServer} = webpackConfig;
  const server = new webpackDevServer(webpackConfig.devServer, compiler);

  logger.info(`正在构建中, 请稍后...构建完成后将自动打开浏览器。`);

  await server.start();

  nodeServer?.(config, app, httpServer);
};

export default startDev;