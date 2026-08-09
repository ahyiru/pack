import {resolve} from 'node:path';
import pathToURL from './pathToURL.js';

import {getProjectRoot} from '../configs/getDirName.js';

const rootDir = getProjectRoot(import.meta.url);

const fixBase = basepath => (basepath || '').length < 2 ? '/' : basepath.endsWith('/') ? basepath.slice(0, -1) : basepath;

const fixPublicPath = publicPath => (publicPath || '').length < 2 ? '/' : publicPath.endsWith('/') ? publicPath : `${publicPath}/`;

const userConfigs = async () => {
  const configsPath = resolve(rootDir, './.huxy/app.configs.js');
  const configs = (await import(pathToURL(configsPath))).default;

  const {webpack, entry, nodeServer} = configs;

  const appName = process.env.npm_config_dirname || entry || 'app';
  const {HOST, PORT, PROD_PORT, PROXY, PUBLIC_DIR, BUILD_DIR, DEV_ROOT_DIR, PROD_ROOT_DIR, projectName, envConfigs, devEnv, prodEnv} = configs[appName] || configs.app || {};

  const appPath = resolve(rootDir, appName);
  const publics = resolve(appPath, PUBLIC_DIR || 'public');
  const buildPath = resolve(appPath, BUILD_DIR || 'build');

  const webpackCfg = typeof webpack === 'function' ? webpack(rootDir, appPath) : webpack ?? {};

  const {dev, prod, ...rest} = webpackCfg;

  const defDevEnv = {
    basepath: fixBase(DEV_ROOT_DIR),
    publicPath: fixPublicPath(DEV_ROOT_DIR),
    port: PORT || 8080,
  };
  const defProdEnv = {
    basepath: fixBase(PROD_ROOT_DIR),
    publicPath: fixPublicPath(PROD_ROOT_DIR),
    port: PROD_PORT || 8081,
  };

  return {
    rootDir,
    appName,
    HOST,
    proxys: PROXY,
    projectName: projectName || appName,
    envConfigs,
    appPath,
    publics,
    buildPath,
    webpackCfg: rest || {},
    webpackDevCfg: dev || {},
    webpackProdCfg: prod || {},
    configsPath,
    nodeServer,
    devEnv: {...defDevEnv, ...devEnv},
    prodEnv: {...defProdEnv, ...prodEnv},
  };
};

export default userConfigs;
