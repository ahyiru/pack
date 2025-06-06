import express from 'express';
import webpack from 'webpack';
import colors from 'colors';
import {createServer} from 'node:http';
// import https from 'node:https';
// import fs from 'node:fs';
// import path from 'node:path';

import cors from 'cors';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import pathToURL from './pathToURL.js';

import getIPs from './getIPs.js';

import appProxy from './appProxy.js';

const webpackConfig = (await import('./webpack.development.js')).default;

const {appName, HOST, PORT, PROXY, configsPath} = (await import('./envConfigs.js')).default;

const {nodeServer} = (await import(pathToURL(configsPath))).default;

const app = express();

const httpServer = createServer(app);

appProxy(app, PROXY);

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

app.set('host', HOST);
app.set('port', PORT);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(compression());

if (typeof nodeServer === 'function' ) {
  nodeServer(app, httpServer);
}

// browserRouter
app.get('/{*splat}', (req, res, next) => {
  const htmlBuffer = compiler.outputFileSystem.readFileSync(`${webpackConfig.output.path}/index.html`);
  res.set('Content-Type', 'text/html');
  res.send(htmlBuffer);
  res.end();
});

httpServer.listen(app.get('port'), err => {
  if (err) {
    console.log(err);
    return false;
  }
  const ips = getIPs(true).map(ip => `${ip}:${app.get('port')}`).join('\n');
  console.log('\n' + appName.green + ': 服务已启动! '.cyan + '✓'.green);
  console.log(`\n监听端口: ${app.get('port')} , 正在构建, 请稍后...构建完成后将自动打开浏览器`.cyan);
  console.log('-----------------------------------'.blue);
  console.log(`运行地址: \n`.green);
  console.log(`${ips} \n`.green);
  console.log(`如需打包部署到生产环境，请运行 `.cyan + `npm run build`.green);
  console.log('-----------------------------------'.blue);
  console.log('\n按下 CTRL-C 停止服务\n'.blue);
});
