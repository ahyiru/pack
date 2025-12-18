import {logger} from 'huxy-server';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const webpackConfig = (await import('./webpack.development.js')).default;

const startDev = (config, app, httpServer) => {
  const compiler = webpack(webpackConfig);

  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    // outputFileSystem: {},
    stats: {
      preset: 'minimal',
      moduleTrace: true,
      errorDetails: true,
      colors: true,
    },
  });

  app.use(webpackHotMiddleware(compiler));
  app.use(devMiddleware);

  logger.info(`正在构建中, 请稍后...构建完成后将自动打开浏览器。`);

  nodeServer?.(config, app, httpServer);
};

export default startDev;