import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackDevConfigs from './webpack.development.js';

const startDev = nodeServer => async (config, app, httpServer, logger) => {
  const webpackConfig = await webpackDevConfigs(config);
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

  app.get('/{*splat}', (req, res, next) => {
    const htmlBuffer = compiler.outputFileSystem.readFileSync(`${webpackConfig.output.path}/index.html`);
    res.set('Content-Type', 'text/html');
    res.send(htmlBuffer);
    res.end();
  });

  logger.info(`正在构建中, 请稍后...构建完成后将自动打开浏览器。`);

  nodeServer?.(config, app, httpServer);
};

export default startDev;