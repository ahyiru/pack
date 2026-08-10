import {startServer, startStatic} from 'huxy-node-server';

import getEnvConfigs from './envConfigs.js';
import startDev from './startDev.js';

const startApp = async isDev => {
  process.env.NODE_ENV = isDev ? 'development' : 'production';
  const {appName, HOST, buildPath, proxys, devEnv, prodEnv, nodeServer} = await getEnvConfigs();
  const {port, basepath} = isDev ? devEnv : prodEnv;
  const server = isDev ? startServer : startStatic;
  return server({
    appName, HOST, buildPath, proxys, port, basepath
  }, isDev ? startDev(nodeServer) : nodeServer);
};

export default startApp;