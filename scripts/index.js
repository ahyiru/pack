const express = require('express');
const webpack = require('webpack');
const colors = require('colors');
// const https = require('https');
// const fs = require('fs');
// const path = require('path');

const cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('./webpack.development');

const getIPs = require('./getIPs');

const appProxy = require('./appProxy');

const {appName, HOST, PORT, PROXY, nodeServer} = require('./envConfigs');

const app = express();

appProxy(app, PROXY);

if (typeof nodeServer === 'function' ) {
  nodeServer(app);
}

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

// browserRouter
app.use('*', (req, res, next) => {
  const htmlBuffer = compiler.outputFileSystem.readFileSync(`${webpackConfig.output.path}/index.html`);
  res.set('Content-Type', 'text/html');
  res.send(htmlBuffer);
  res.end();
});

/* const ssl = path.resolve(__dirname, './ssl');
const options = {
  key: fs.readFileSync(`${ssl}/ihuxy.com.key`),
  cert: fs.readFileSync(`${ssl}/ihuxy.com.pem`),
  // passphrase: 'YOUR PASSPHRASE HERE',
};
const httpsServer = https.createServer(options, app); */

app.listen(app.get('port'), err => {
  if (err) {
    console.log(err);
    return false;
  }
  const ips = getIPs(true).map(ip => `${ip}:${app.get('port')}`).join('\n');
  console.log('\n' + appName.magenta + ': 服务已启动! '.cyan + '✓'.green);
  console.log(`\n监听端口: ${app.get('port')} , 正在构建, 请稍后...构建完成后将自动打开浏览器`.cyan);
  console.log('-----------------------------------'.blue);
  console.log(`运行地址: \n`.magenta);
  console.log(`${ips} \n`.magenta);
  console.log(`如需打包部署到生产环境，请运行 `.cyan + `npm run build`.green);
  console.log('-----------------------------------'.blue);
  console.log('\n按下 CTRL-C 停止服务\n'.blue);
});

