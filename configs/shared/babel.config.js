import merge from '../merge.js';

const configs = api => {
  // api.cache.using(() => !!process.env.isDev);

  const presets = [
    [
      '@babel/preset-env',
      {
        // modules: 'commonjs',
        // modules: false,
        // loose: true,
        bugfixes: true,
        useBuiltIns: 'usage',
        shippedProposals: true,
        corejs: {
          version: '3.39',
          proposals: true,
        },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ];

  const plugins = [
    [
      'babel-plugin-react-compiler',
      // {},
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        helpers: true,
        regenerator: true,
        corejs: false,
      },
    ],
  ];

  const env = {
    development: {},
    production: {},
    test: {},
  };

  return {
    babelrc: false,
    configFile: false,
    assumptions: {
      noDocumentAll: true,
      noClassCalls: true,
      iterableIsArray: true,
      privateFieldsAsProperties: true,
      setPublicClassFields: true,
    },
    targets: {
      node: 'current',
      browsers: process.env.isDev ? ['last 2 versions'] : ['>0.3%', 'not dead', 'not op_mini all'],
      esmodules: true,
    },
    sourceType: 'unambiguous',
    presets,
    plugins,
    env,
  };
};

export default (api, customCfgs = {}) => merge(configs(api), customCfgs);
