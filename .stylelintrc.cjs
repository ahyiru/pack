import merge from '@huxy/utils/mergeObj';

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
  },
  ignoreFiles: ['node_modules/**/*.css', 'coverage/**/*.css', '**/build/**/*.css', '**/draft/**/*.css'],
};

module.exports = (customCfgs = {}) => merge(configs, customCfgs);
