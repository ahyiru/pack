import startApp, {logger} from 'huxy-server';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import pathToURL from './pathToURL.js';

const webpackConfig = (await import('./webpack.development.js')).default;

const {appName, HOST, PORT, PROXY, configsPath} = (await import('./envConfigs.js')).default;

const {nodeServer} = (await import(pathToURL(configsPath))).default;

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

  // browserRouter
  app.get('/{*splat}', (req, res, next) => {
    const htmlBuffer = compiler.outputFileSystem.readFileSync(`${webpackConfig.output.path}/index.html`);
    res.set('Content-Type', 'text/html');
    res.send(htmlBuffer);
    res.end();
  });

  logger.info(`正在构建中, 请稍后...构建完成后将自动打开浏览器。`);

  nodeServer?.(config, app, httpServer);
};

startApp({appName, HOST, PORT, proxys: PROXY}, startDev);