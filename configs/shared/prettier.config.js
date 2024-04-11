import merge from '../merge.js';

const configs = {
  printWidth: 200,
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  bracketSpacing: false,
  arrowParens: 'avoid',
};

export default (customCfgs = {}) => merge(configs, customCfgs);