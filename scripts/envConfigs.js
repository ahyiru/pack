import {resolve} from 'node:path';
import pathToURL from './pathToURL.js';

const rootDir = process.cwd();

const configsPath = resolve(rootDir, './.huxy/app.configs.js');

const configs = (await import(pathToURL(configsPath))).default;

const {webpack, entry} = configs;

const appName = process.env.npm_config_dirname || entry || 'app';

const {HOST, PORT, PROD_PORT, PROXY, PUBLIC_DIR, BUILD_DIR, DEV_ROOT_DIR, PROD_ROOT_DIR, projectName, envConfigs} = configs[appName] || {};

const devRoot = ['/', './'].includes(DEV_ROOT_DIR) ? '' : DEV_ROOT_DIR ?? '';
const prodRoot = ['/', './'].includes(PROD_ROOT_DIR) ? '' : PROD_ROOT_DIR ?? '';

const appPath = resolve(rootDir, appName);

const publics = resolve(appPath, PUBLIC_DIR || 'public');

const buildPath = resolve(appPath, BUILD_DIR || 'build');

const webpackCfg = typeof webpack === 'function' ? webpack(rootDir, appPath) : webpack ?? {};

const {dev, prod, ...rest} = webpackCfg;

const userConfigs = {
  rootDir,
  appName,
  HOST: HOST || 'http://localhost',
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
};

export default userConfigs;
