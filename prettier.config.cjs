import merge from '@huxy/utils/mergeObj';

const configs = {
  printWidth: 200,
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  bracketSpacing: false,
  arrowParens: 'avoid',
};

module.exports = (customCfgs = {}) => merge(configs, customCfgs);