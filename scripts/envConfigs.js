const {resolve} = require('node:path');

const rootDir = process.cwd();

const configsPath = resolve(rootDir, './.huxy/app.configs');

const {app = {}, webpack = {}} = require(configsPath);

const {HOST, PORT, PROD_PORT, PROXY, PUBLIC_DIR, BUILD_DIR, DEV_ROOT_DIR, PROD_ROOT_DIR, projectName, envConfigs, entry} = app;

const appName = entry || process.env.npm_config_dirname || 'app';

const devRoot = ['/', './'].includes(DEV_ROOT_DIR) ? '' : DEV_ROOT_DIR ?? '';
const prodRoot = ['/', './'].includes(PROD_ROOT_DIR) ? '' : PROD_ROOT_DIR ?? '';

const appPath = resolve(rootDir, appName);

const publics = resolve(rootDir, PUBLIC_DIR || 'public');

const buildPath = resolve(rootDir, BUILD_DIR || 'build');

const {dev, prod, ...rest} = webpack;

module.exports = {
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
