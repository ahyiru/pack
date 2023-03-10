import {resolve} from 'node:path';

import fs from 'fs-extra';

import configFileList from './fileList.js';

import getDirName from './getDirName.js';

const __dirname = getDirName(import.meta.url);

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
    const filename = configFileList[i].path;
    initConfigFile(resolve(rootDir, filename), resolve(sharedDir, filename));
  }
};

const initHuskyFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './.husky'));
  initConfigFile(resolve(rootDir, './.husky/commit-msg'), resolve(packDir, './.husky/commit-msg'));
  initConfigFile(resolve(rootDir, './.husky/pre-commit'), resolve(packDir, './.husky/pre-commit'));
};

export default initAppConfig;
