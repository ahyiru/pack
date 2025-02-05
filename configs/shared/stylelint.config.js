import merge from '../merge.js';

const configs = {
  extends: 'stylelint-config-recommended',
  // extends: 'stylelint-config-standard',
  customSyntax: 'postcss-less',
  plugins: ['stylelint-order'],
  rules: {
    // 'selector-class-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',// 规定css类名格式(此处为短横线命名法，例如：.m-title)
    'function-url-quotes': 'always', // url需要加引号
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'import', 'local'],
      },
    ],
    'no-descending-specificity': null /* [
      true,
      {
        ignore: ['selectors-within-list'],
      },
    ] */,
    // 'no-invalid-double-slash-comments': true,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['/^page/'],
      },
    ],
    'declaration-property-value-no-unknown': null,
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', 'node_modules/**/*.css', 'coverage/**/*.css', '**/build/**/*.css', '**/draft/**/*.css'],
  // fix: true,
};

export default (customCfgs = {}) => merge(configs, customCfgs);
