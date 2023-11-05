import {resolve} from 'node:path';

import fs from 'fs-extra';

import configFileList from './fileList.js';

import getDirName from './getDirName.js';

const __dirname = getDirName(import.meta.url);

const rootDir = process.cwd();
const packDir = resolve(__dirname, '../');
const sharedDir = resolve(__dirname, './shared');

const oldCfgList = [
  `module.exports = require('@huxy/pack/config/eslint');`,
  `module.exports = require('@huxy/pack/config/stylelint');`,
  `module.exports = require('@huxy/pack/config/commitlint');`,
  `module.exports = require('@huxy/pack/config/jest');`,
  `module.exports = require('@huxy/pack/config/postcss');`,
  `module.exports = require('@huxy/pack/config/babel');`,
  `module.exports = require('@huxy/pack/config/prettier');`,
  `module.exports = require('@huxy/pack/config/version');`,
];

const initAppConfig = async () => {
  await initAppFiles();
  await initConfigFiles();
  await initHuskyFiles();
  await initGitignore();
  await initTestFiles();
};

const initConfigFile = async (userConfigs, huxyConfigs) => {
  const exists = await fs.pathExists(userConfigs);
  if (!exists) {
    try {
      await fs.copy(huxyConfigs, userConfigs);
    } catch (error) {
      console.error(error);
    }
  } else {
    const data = await fs.readFile(userConfigs, 'utf8');
    const isOldCfg = oldCfgList.includes(data);
    if (isOldCfg) {
      try {
        await fs.remove(userConfigs);
        await fs.copy(huxyConfigs, userConfigs);
      } catch (error) {
        console.error(error);
      }
    }
  }
};

const initConfigFiles = async () => {
  for (let i = 0, l = configFileList.length; i < l; i++) {
    const aliasname = configFileList[i].alias;
    const filename = configFileList[i].path;
    const jsconfig = configFileList[i].jsconfig;
    if (jsconfig) {
      const jsconfigpath = resolve(rootDir, jsconfig);
      const hasJsconfig = await fs.pathExists(jsconfigpath);
      if (hasJsconfig) {
        await fs.remove(jsconfigpath);
      }
    }
    await initConfigFile(resolve(rootDir, filename), resolve(sharedDir, aliasname || filename));
  }
};

const initAppFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './.huxy'));
  await initConfigFile(resolve(rootDir, './.huxy/app.configs.js'), resolve(sharedDir, './.huxy/app.configs.js'));
};

const initHuskyFiles = async () => {
  const exists = await fs.pathExists(resolve(rootDir, './.husky'));
  if (exists) {
    await initConfigFile(resolve(rootDir, './.husky/.gitignore'), resolve(packDir, './.husky/.gitignore'));
    await initConfigFile(resolve(rootDir, './.husky/commit-msg'), resolve(packDir, './.husky/commit-msg'));
    await initConfigFile(resolve(rootDir, './.husky/pre-commit'), resolve(packDir, './.husky/pre-commit'));
  }
};

const initGitignore = async () => {
  const exists = await fs.pathExists(resolve(rootDir, './.git'));
  if (exists) {
    await initConfigFile(resolve(rootDir, './.gitignore'), resolve(sharedDir, './gitignoreconfig'));
  }
};

const initTestFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './__tests__'));
  await initConfigFile(resolve(rootDir, './__tests__/add.test.js'), resolve(packDir, './__tests__/add.test.js'));
};

export default initAppConfig;
