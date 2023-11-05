import merge from '@huxy/utils/mergeObj';

const configs = {
  // parser: 'sugarss',
  plugins: {
    // 'postcss-import': {},
    'postcss-preset-env': {
      stage: 2,
      features: {
        'nesting-rules': true,
        'double-position-gradients': false,
      },
      // autoprefixer: {flexbox: 'no-2009'},
      browsers: process.env.isDev ? ['last 2 versions'] : ['>0.3%', 'not dead', 'not op_mini all'],
      // importFrom: '@app/commons/global.css',
    },
    autoprefixer: {
      grid: 'autoplace',
    },
    // cssnano: {},
    // tailwindcss: {},
    // 'postcss-px-to-viewport': {
    //   unitToConvert: 'px',
    //   viewportWidth: 750,
    //   unitPrecision: 6,
    //   propList: ['*'],
    //   viewportUnit: 'vw',
    //   fontViewportUnit: 'vw',
    //   selectorBlackList: [],//需要忽略的CSS选择器
    //   minPixelValue: 1,
    //   mediaQuery: true,
    //   replace: true,
    //   exclude: [/node_modules/],
    //   include: undefined,
    //   landscape: false,
    //   landscapeUnit: 'vw',
    //   landscapeWidth: 568,
    // },
  },
};

module.exports = (customCfgs = {}) => merge(configs, customCfgs);
