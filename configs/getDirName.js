import {fileURLToPath} from 'node:url';
import {existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

const getDirName = (url = import.meta.url) => {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  const fixPath = (...path) => resolve(__dirname, ...path);
  return {__filename, __dirname, fixPath};
};

export default getDirName;

export const getProjectRoot = url => {
  let currentDir = getDirName(url).__dirname;
  currentDir = dirname(dirname(currentDir));
  while (currentDir !== dirname(currentDir)) {
    if (existsSync(resolve(currentDir, 'node_modules'))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }
  return process.cwd();
};