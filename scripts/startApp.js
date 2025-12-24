import {startApp, startStaticApp} from 'huxy-server';

import pathToURL from './pathToURL.js';

import getEnvConfigs from './envConfigs.js';
import startDev from './startDev.js';

const startServer = async isDev => {
  const {appName, HOST, PORT, PROD_PORT, buildPath, PROXY, devRoot, prodRoot, nodeServer} = await getEnvConfigs();

  const server = isDev ? startApp : startStaticApp;
  return server({
    appName, HOST, buildPath, proxys: PROXY,
    port: isDev ? PORT : PROD_PORT,
    basepath: isDev ? devRoot : prodRoot,
  }, isDev ? startDev(nodeServer) : nodeServer);
};

export default startServer;