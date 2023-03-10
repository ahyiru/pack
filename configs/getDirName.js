import {fileURLToPath} from 'node:url';
import path from 'node:path';

const getDirName = url => {
  const filename = fileURLToPath(url);
  return path.dirname(filename);
};

export default getDirName;
