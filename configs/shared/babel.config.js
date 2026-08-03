import merge from '../merge.js';

const configs = api => {
  // api.cache.using(() => !!process.env.isDev);

  const presets = ['@babel/preset-env', '@babel/preset-react'];

  const plugins = ['babel-plugin-react-compiler'];

  const env = {development: {}, production: {}, test: {}};

  return {
    babelrc: false,
    configFile: false,
    sourceType: 'unambiguous',
    assumptions: {
      constantReexpoets: true,
      enumerableModuleMeta: true,
      ignoreFunctionLength: true,
      noNewArrows: true,
      pureGetters: true,
      noDocumentAll: true,
      noClassCalls: true,
      iterableIsArray: true,
      privateFieldsAsProperties: true,
      setPublicClassFields: true,
      setComputedProperties: true,
    },
    targets: {
      esmodules: 'intersect',
      node: 'current',
      browsers: process.env.NODE_ENV === 'development' ? ['last 2 versions'] : ['>0.3%', 'not dead', 'not op_mini all'],
    },
    presets,
    plugins,
    env,
  };
};

export default (api, customCfgs = {}) => merge({}, customCfgs);
