const fs = require('fs-extra');
const {resolve} = require('node:path');

const configFileList = require('./fileList');

const rootDir = process.cwd();
const packDir = resolve(__dirname, '../');
const sharedDir = resolve(__dirname, './shared');

const userConfigDir = resolve(rootDir, './.huxy/app.configs.js');
const huxyConfigDir = resolve(sharedDir, './.huxy/app.configs.js');

const initAppConfig = async () => {
  const exists = await fs.pathExists(userConfigDir);
  if (!exists) {
    await fs.ensureDir(resolve(rootDir, './.huxy'));
    fs.copy(huxyConfigDir, userConfigDir);
  } /* else {
    fs.copy(userConfigDir, huxyConfigDir);
  } */
  initConfigFiles();
  initHuskyFiles();
};

const initConfigFile = async (userConfigDir, huxyConfigDir) => {
  const exists = await fs.pathExists(userConfigDir);
  if (!exists) {
    fs.copy(huxyConfigDir, userConfigDir);
  }
};

const initConfigFiles = () => {
  for (let i = 0, l = configFileList.length; i < l; i++) {
    initConfigFile(resolve(rootDir, './.eslintrc.js'), resolve(sharedDir, configFileList[i].path));
  }
};

const initHuskyFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './.husky'));
  initConfigFile(resolve(rootDir, './.husky/commit-msg'), resolve(packDir, './.husky/commit-msg'));
  initConfigFile(resolve(rootDir, './.husky/pre-commit'), resolve(packDir, './.husky/pre-commit'));
};

module.exports = initAppConfig;
