const express = require('express');
const colors = require('colors');
const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
// const https = require('https');
// const fs = require('fs');

const appProxy = require('./appProxy');

const {HOST, PROD_PORT, buildPath, PROXY, prodRoot} = require('./envConfigs');

const app = express();

appProxy(app, PROXY);

app.set('host', HOST);
app.set('port', PROD_PORT);

app.use(cors());
app.use(logger('combined'));
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
app.use(compression());

app.use(prodRoot || '/', express.static(buildPath));
app.get(`${prodRoot}/*`, (request, response) => {
  response.sendFile(path.resolve(buildPath, 'index.html'));
});

/* const ssl = path.resolve(__dirname, './ssl');
const options = {
  key: fs.readFileSync(`${ssl}/ihuxy.com.key`),
  cert: fs.readFileSync(`${ssl}/ihuxy.com.pem`),
};
const httpsServer = https.createServer(options, app); */

app.listen(app.get('port'), err => {
  if (err) {
    console.log(err);
    return false;
  }
  console.log('\n服务已启动! '.black + '✓'.green);
  console.log(`\n监听端口: ${app.get('port')} ,正在构建,请稍后...`.cyan);
  console.log('-----------------------------------'.grey);
  console.log(` 本地地址: ${app.get('host')}:${app.get('port')}${prodRoot}`.magenta);
  console.log('-----------------------------------'.grey);
  console.log('\n按下 CTRL-C 停止服务\n'.blue);
});
