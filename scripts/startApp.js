import {startApp, startStaticApp} from 'huxy-server';

import pathToURL from './pathToURL.js';

import startDev from './startDev.js';

const {appName, HOST, PORT, PROD_PORT, buildPath, PROXY, devRoot, prodRoot, configsPath} = (await import('./envConfigs.js')).default;

const {nodeServer} = (await import(pathToURL(configsPath))).default;

const startServer = isDev => {
  const server = isDev ? startApp : startStaticApp;
  return server({
    appName, HOST, buildPath, proxys: PROXY,
    port: isDev ? PORT : PROD_PORT,
    basepath: isDev ? devRoot : prodRoot,
  }, isDev ? startDev(nodeServer) : nodeServer);
};

export default startServer;