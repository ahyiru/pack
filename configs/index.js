import fs from 'fs-extra';

import configFileList from './fileList.js';

import getDirName, {getProjectRoot} from './getDirName.js';

const {fixPath} = getDirName(import.meta.url);
const rootDir = getProjectRoot(import.meta.url);

const fixRootDir = path => fixPath(rootDir, path);
const fixPackDir = path => fixPath('../', path);
// const sharedDir = fixPath('./shared');

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
      const jsconfigpath = fixRootDir(jsconfig);
      const hasJsconfig = await fs.pathExists(jsconfigpath);
      if (hasJsconfig) {
        await fs.remove(jsconfigpath);
      }
    }
    await initConfigFile(fixRootDir(filename), fixPackDir(aliasname || filename));
  }
};

const initAppFiles = async () => {
  await fs.ensureDir(fixRootDir('./.huxy'));
  await initConfigFile(fixRootDir('./.huxy/app.configs.js'), fixPackDir('./.huxy/app.configs.js'));
};

const initHuskyFiles = async () => {
  const exists = await fs.pathExists(fixRootDir('./.husky'));
  if (exists) {
    // await initConfigFile(fixRootDir('./.husky/.gitignore'), fixPackDir('./.husky/.gitignore'));
    await initConfigFile(fixRootDir('./.husky/commit-msg'), fixPackDir('./.husky/commit-msg'));
    await initConfigFile(fixRootDir('./.husky/pre-commit'), fixPackDir('./.husky/pre-commit'));
  }
};

const initTestFiles = async () => {
  await fs.ensureDir(fixRootDir('./__tests__'));
  await initConfigFile(fixRootDir('./__tests__/add.test.js'), fixPackDir('./__tests__/add.test.js'));
};

/* const initGitignore = async () => {
  const exists = await fs.pathExists(fixRootDir('./.git'));
  if (exists) {
    await initConfigFile(fixRootDir('./.gitignore'), fixPackDir('./gitignoreconfig'));
  }
}; */

export default initAppConfig;
