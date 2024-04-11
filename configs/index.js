import {resolve} from 'node:path';

import fs from 'fs-extra';

import configFileList from './fileList.js';

import getDirName from './getDirName.js';

const __dirname = getDirName(import.meta.url);

const rootDir = process.cwd();
const packDir = resolve(__dirname, '../');
// const sharedDir = resolve(__dirname, './shared');

const oldCfgList = [
  `import configs from '@huxy/pack/config/eslint';`,
  `import configs from '@huxy/pack/config/stylelint';`,
  `import configs from '@huxy/pack/config/commitlint';`,
  `import configs from '@huxy/pack/config/jest';`,
  `import configs from '@huxy/pack/config/postcss';`,
  `import configs from '@huxy/pack/config/babel';`,
  `import configs from '@huxy/pack/config/prettier';`,
  `import configs from '@huxy/pack/config/version';`,
];

const initAppConfig = async () => {
  await initAppFiles();
  await initHuskyFiles();
  await initTestFiles();
  await initConfigFiles();
  // await initGitignore();
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
    await initConfigFile(resolve(rootDir, filename), resolve(packDir, aliasname || filename));
  }
};

const initAppFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './.huxy'));
  await initConfigFile(resolve(rootDir, './.huxy/app.configs.js'), resolve(packDir, './.huxy/app.configs.js'));
};

const initHuskyFiles = async () => {
  const exists = await fs.pathExists(resolve(rootDir, './.husky'));
  if (exists) {
    await initConfigFile(resolve(rootDir, './.husky/.gitignore'), resolve(packDir, './.husky/.gitignore'));
    await initConfigFile(resolve(rootDir, './.husky/commit-msg'), resolve(packDir, './.husky/commit-msg'));
    await initConfigFile(resolve(rootDir, './.husky/pre-commit'), resolve(packDir, './.husky/pre-commit'));
  }
};

const initTestFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './__tests__'));
  await initConfigFile(resolve(rootDir, './__tests__/add.test.js'), resolve(packDir, './__tests__/add.test.js'));
};

/* const initGitignore = async () => {
  const exists = await fs.pathExists(resolve(rootDir, './.git'));
  if (exists) {
    await initConfigFile(resolve(rootDir, './.gitignore'), resolve(packDir, './gitignoreconfig'));
  }
}; */

export default initAppConfig;
