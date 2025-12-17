import {startStaticApp} from 'huxy-server';

import pathToURL from './pathToURL.js';

const {HOST, PROD_PORT, buildPath, PROXY, prodRoot, configsPath} = (await import('./envConfigs.js')).default;

const {nodeServer} = (await import(pathToURL(configsPath))).default;

startStaticApp({
  config: {
    HOST,
    port: PROD_PORT,
    buildPath,
    basepath: prodRoot,
  },
  proxyConfig: {
    proxys: PROXY,
  },
}, nodeServer);