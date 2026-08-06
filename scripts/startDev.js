import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackDevConfigs from './webpack.development.js';

const startDev = nodeServer => async (config, app, httpServer, logger) => {
  const webpackConfig = await webpackDevConfigs(config);
  const compiler = webpack(webpackConfig);

  const {publicPath} = webpackConfig.output;
  const {basepath, buildPath} = config;

  app.use(webpackDevMiddleware(compiler, {
    publicPath,
    stats: {
      preset: 'minimal',
      colors: true,
    },
  }));
  app.use(webpackHotMiddleware(compiler));

  logger.info(`正在构建中, 请稍后...构建完成后将自动打开浏览器。`);

  if (basepath !== '/') {
    app.get(basepath, (req, res, next) => {
      res.redirect(308, `${basepath}/${req.search ?? ''}`);
    });
  }
  app.get(`${publicPath}{*splat}`, (req, res, next) => {
    if (res.headersSent || req.path.includes('.')) {
      return next();
    }
    const htmlBuffer = compiler.outputFileSystem.readFileSync(`${buildPath}/index.html`);
    res.set('Content-Type', 'text/html');
    res.send(htmlBuffer);
    res.end();
  });

  nodeServer?.(config, app, httpServer);
};

export default startDev;