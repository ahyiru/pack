import {pathToFileURL} from 'node:url';

const pathToURL = path => pathToFileURL(path).href;

export default pathToURL;
