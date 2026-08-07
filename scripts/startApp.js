import {startApp, startStaticApp} from 'huxy-server';

import getEnvConfigs from './envConfigs.js';
import startDev from './startDev.js';

const startServer = async isDev => {
  process.env.NODE_ENV = isDev ? 'development' : 'production';
  const {appName, HOST, buildPath, proxys, devEnv, prodEnv, nodeServer} = await getEnvConfigs();
  const {port, basepath} = isDev ? devEnv : prodEnv;
  const server = isDev ? startApp : startStaticApp;
  return server({
    appName, HOST, buildPath, proxys, port, basepath
  }, isDev ? startDev(nodeServer) : nodeServer);
};

export default startServer;