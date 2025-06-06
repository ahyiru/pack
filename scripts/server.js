import express from 'express';
import colors from 'colors';
import cors from 'cors';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'node:path';
import {createServer} from 'node:http';
// import https from 'node:https';
// import fs from 'node:fs';

import pathToURL from './pathToURL.js';

import appProxy from './appProxy.js';

const {HOST, PROD_PORT, buildPath, PROXY, prodRoot, configsPath} = (await import('./envConfigs.js')).default;

const {nodeServer} = (await import(pathToURL(configsPath))).default;

const app = express();

const httpServer = createServer(app);

appProxy(app, PROXY);

app.set('host', HOST);
app.set('port', PROD_PORT);

app.use(cors());
app.use(logger('combined'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(compression());

if (typeof nodeServer === 'function' ) {
  nodeServer(app, httpServer);
}

app.use(prodRoot || '/', express.static(buildPath));
app.get(`${prodRoot}/{*splat}`, (request, response) => {
  response.sendFile(path.resolve(buildPath, 'index.html'));
});

/* const ssl = path.resolve(__dirname, './ssl');
const options = {
  key: fs.readFileSync(`${ssl}/ihuxy.com.key`),
  cert: fs.readFileSync(`${ssl}/ihuxy.com.pem`),
};
const httpsServer = https.createServer(options, app); */

httpServer.listen(app.get('port'), err => {
  if (err) {
    console.log(err);
    return false;
  }
  console.log('\n服务已启动! '.black + '✓'.green);
  console.log(`\n监听端口: ${app.get('port')} ,正在构建,请稍后...`.cyan);
  console.log('-----------------------------------'.grey);
  console.log(` 本地地址: ${app.get('host')}:${app.get('port')}${prodRoot}`.green);
  console.log('-----------------------------------'.grey);
  console.log('\n按下 CTRL-C 停止服务\n'.blue);
});

