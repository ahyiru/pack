import {startStaticApp} from 'huxy-server';

import pathToURL from './pathToURL.js';

const {HOST, PROD_PORT, buildPath, PROXY, prodRoot, configsPath} = (await import('./envConfigs.js')).default;

const {nodeServer} = (await import(pathToURL(configsPath))).default;

startStaticApp({
  HOST,
  port: PROD_PORT,
  buildPath,
  basepath: prodRoot,
  proxys: PROXY,
}, nodeServer);