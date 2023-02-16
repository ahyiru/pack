const fs = require('fs-extra');
const {resolve} = require('node:path');

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
  } else {
    fs.copy(userConfigDir, huxyConfigDir);
  }
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
  initConfigFile(resolve(rootDir, './.eslintrc.js'), resolve(sharedDir, './.eslintrc.js'));
  initConfigFile(resolve(rootDir, './.stylelintrc.js'), resolve(sharedDir, './.stylelintrc.js'));
  initConfigFile(resolve(rootDir, './commitlint.config.js'), resolve(sharedDir, './commitlint.config.js'));
  initConfigFile(resolve(rootDir, './jest.config.js'), resolve(sharedDir, './jest.config.js'));
  initConfigFile(resolve(rootDir, './postcss.config.js'), resolve(sharedDir, './postcss.config.js'));
  initConfigFile(resolve(rootDir, './babel.config.js'), resolve(sharedDir, './babel.config.js'));
  initConfigFile(resolve(rootDir, './prettier.config.js'), resolve(sharedDir, './prettier.config.js'));
  initConfigFile(resolve(rootDir, './.versionrc.js'), resolve(sharedDir, './.versionrc.js'));
  
  initConfigFile(resolve(rootDir, './.prettierignore'), resolve(packDir, './.prettierignore'));
  initConfigFile(resolve(rootDir, './.browserslistrc'), resolve(packDir, './.browserslistrc'));
  initConfigFile(resolve(rootDir, './.editorconfig'), resolve(packDir, './.editorconfig'));
};

const initHuskyFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './.husky'));
  initConfigFile(resolve(rootDir, './.husky/commit-msg'), resolve(packDir, './.husky/commit-msg'));
  initConfigFile(resolve(rootDir, './.husky/pre-commit'), resolve(packDir, './.husky/pre-commit'));
};

module.exports = initAppConfig;
