import {resolve} from 'node:path';
import pathToURL from './pathToURL.js';

const userConfigs = async () => {
  const rootDir = process.cwd();

  const configsPath = resolve(rootDir, './.huxy/app.configs.js');

  const configs = (await import(pathToURL(configsPath))).default;

  const {webpack, entry, nodeServer} = configs;

  const appName = process.env.npm_config_dirname || entry || 'app';

  const {HOST, PORT, PROD_PORT, PROXY, PUBLIC_DIR, BUILD_DIR, DEV_ROOT_DIR, PROD_ROOT_DIR, projectName, envConfigs} = configs[appName] || configs.app || {};

  const devRoot = ['/', './'].includes(DEV_ROOT_DIR) ? '' : DEV_ROOT_DIR ?? '';
  const prodRoot = ['/', './'].includes(PROD_ROOT_DIR) ? '' : PROD_ROOT_DIR ?? '';

  const appPath = resolve(rootDir, appName);

  const publics = resolve(appPath, PUBLIC_DIR || 'public');

  const buildPath = resolve(appPath, BUILD_DIR || 'build');

  const webpackCfg = typeof webpack === 'function' ? webpack(rootDir, appPath) : webpack ?? {};

  const {dev, prod, ...rest} = webpackCfg;

  return {
    rootDir,
    appName,
    HOST: HOST || 'localhost',
    PORT: PORT || 8080,
    PROD_PORT: PROD_PORT || 8081,
    PROXY,
    projectName: projectName || appName,
    envConfigs,
    devRoot,
    prodRoot,
    appPath,
    publics,
    buildPath,
    webpackCfg: rest || {},
    webpackDevCfg: dev || {},
    webpackProdCfg: prod || {},
    configsPath,
    nodeServer,
  };
};

export default userConfigs;
