import {resolve} from 'node:path';

import fs from 'fs-extra';

import configFileList from './fileList.js';

import getDirName from './getDirName.js';

const __dirname = getDirName(import.meta.url);

const rootDir = process.cwd();
const packDir = resolve(__dirname, '../');
const sharedDir = resolve(__dirname, './shared');

const initAppConfig = async () => {
  initAppFiles();
  initConfigFiles();
  initHuskyFiles();
  initGitignore();
  initTestFiles();
};

const initConfigFile = async (userConfigs, huxyConfigs) => {
  const exists = await fs.pathExists(userConfigs);
  if (!exists) {
    fs.copy(huxyConfigs, userConfigs);
  }
};

const initConfigFiles = () => {
  for (let i = 0, l = configFileList.length; i < l; i++) {
    const filename = configFileList[i].path;
    initConfigFile(resolve(rootDir, filename), resolve(sharedDir, filename));
  }
};

const initAppFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './.huxy'));
  initConfigFile(resolve(rootDir, './.huxy/app.configs.js'), resolve(sharedDir, './.huxy/app.configs.js'));
};

const initHuskyFiles = async () => {
  const exists = await fs.pathExists(resolve(rootDir, './.husky'));
  if (exists) {
    initConfigFile(resolve(rootDir, './.husky/.gitignore'), resolve(packDir, './.husky/.gitignore'));
    initConfigFile(resolve(rootDir, './.husky/commit-msg'), resolve(packDir, './.husky/commit-msg'));
    initConfigFile(resolve(rootDir, './.husky/pre-commit'), resolve(packDir, './.husky/pre-commit'));
  }
};

const initGitignore = async () => {
  const exists = await fs.pathExists(resolve(rootDir, './.git'));
  if (exists) {
    initConfigFile(resolve(rootDir, './.gitignore'), resolve(packDir, './.gitignore'));
  }
};

const initTestFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './__tests__'));
  initConfigFile(resolve(rootDir, './__tests__/add.test.js'), resolve(packDir, './__tests__/add.test.js'));
};

export default initAppConfig;
