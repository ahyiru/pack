import {fileURLToPath} from 'url';
import path from 'path';

const getDirName = url => {
  const filename = fileURLToPath(url);
  return path.dirname(filename);
};

export default getDirName;
