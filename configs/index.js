const fs = require('fs-extra');
const {resolve} = require('node:path');

const rootDir = process.cwd();
const sharedDir = resolve(__dirname, '../configs/shared');

const userConfigDir = resolve(rootDir, './.huxy/app.configs.js');
const huxyConfigDir = resolve(sharedDir, './.huxy/app.configs.js');

const initAppConfig = async () => {
  const exists = await fs.pathExists(userConfigDir);
  if (!exists) {
    await fs.ensureDir(resolve(rootDir, './.huxy'));
    await fs.copy(huxyConfigDir, userConfigDir);
  } else {
    await fs.copy(userConfigDir, huxyConfigDir);
  }
  await initConfigFiles();
  await initHuskyFiles();
};

const initConfigFile = async (userConfigDir, huxyConfigDir) => {
  const exists = await fs.pathExists(userConfigDir);
  if (!exists) {
    await fs.copy(huxyConfigDir, userConfigDir);
  }
};

const initConfigFiles = async () => {
  await initConfigFile(resolve(rootDir, './.eslintrc.js'), resolve(sharedDir, './.eslintrc.js'));
  await initConfigFile(resolve(rootDir, './.stylelintrc.js'), resolve(sharedDir, './.stylelintrc.js'));
  await initConfigFile(resolve(rootDir, './commitlint.config.js'), resolve(sharedDir, './commitlint.config.js'));
  await initConfigFile(resolve(rootDir, './jest.config.js'), resolve(sharedDir, './jest.config.js'));
  await initConfigFile(resolve(rootDir, './postcss.config.js'), resolve(sharedDir, './postcss.config.js'));
  await initConfigFile(resolve(rootDir, './babel.config.js'), resolve(sharedDir, './babel.config.js'));
  await initConfigFile(resolve(rootDir, './prettier.config.js'), resolve(sharedDir, './prettier.config.js'));
  await initConfigFile(resolve(rootDir, './.versionrc.js'), resolve(sharedDir, './.versionrc.js'));
  await initConfigFile(resolve(rootDir, './.prettierignore'), resolve(sharedDir, './.prettierignore'));
};

const initHuskyFiles = async () => {
  await fs.ensureDir(resolve(rootDir, './.husky'));
  await initConfigFile(resolve(rootDir, './.husky/commit-msg'), resolve(sharedDir, './.husky/commit-msg'));
  await initConfigFile(resolve(rootDir, './.husky/pre-commit'), resolve(sharedDir, './.husky/pre-commit'));
};

module.exports = initAppConfig;
