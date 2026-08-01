import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackDevConfigs from './webpack.development.js';

const startDev = nodeServer => async (config, app, httpServer, logger) => {
  const webpackConfig = await webpackDevConfigs(config);
  const compiler = webpack(webpackConfig);

  const {publicPath, path: buildPath} = webpackConfig.output;
  const basepath = publicPath === '/' ? publicPath : publicPath.slice(0, -1);

  app.use(webpackDevMiddleware(compiler, {
    publicPath,
    // outputFileSystem: {},
    stats: {
      preset: 'minimal',
      colors: true,
    },
  }));

  app.use(webpackHotMiddleware(compiler));

  if (basepath !== '/') {
    app.get(basepath, (req, res, next) => {
      return res.redirect(`${basepath}/`);
    });
  }
  app.get(`${basepath}/{*splat}`, (req, res, next) => {
    const htmlBuffer = compiler.outputFileSystem.readFileSync(`${buildPath}/index.html`);
    res.set('Content-Type', 'text/html');
    res.send(htmlBuffer);
    res.end();
  });

  logger.info(`正在构建中, 请稍后...构建完成后将自动打开浏览器。`);

  nodeServer?.(config, app, httpServer);
};

export default startDev;