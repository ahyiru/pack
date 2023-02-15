const config = api => {
  api.cache.using(() => process.env.configs.isDev === 'development');

  const presets = [
    [
      '@babel/preset-env',
      {
        // modules: 'commonjs',
        modules: false,
        // loose: true,
        bugfixes: true,
        useBuiltIns: 'usage',
        shippedProposals: true,
        corejs: {
          version: 3,
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
    assumptions: {
      noDocumentAll: true,
      noClassCalls: true,
      iterableIsArray: true,
      privateFieldsAsProperties: true,
      setPublicClassFields: true,
    },
    targets: {
      browsers: process.env.configs.isDev ? ['last 2 versions'] : ['>0.3%', 'not dead', 'not op_mini all'],,
      esmodules: true,
    },
    sourceType: 'unambiguous',
    presets,
    plugins,
    env,
  };
};

module.exports = config;
