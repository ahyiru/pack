import babelPlugin from '@babel/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import babelParser from '@babel/eslint-parser';
import js from "@eslint/js";
import globals from "globals";

const configs = (customCfgs = []) => [
  js.configs.recommended,
  ...customCfgs,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
          jsx: true,
          generators: true,
          experimentalObjectRestSpread: true,
        },
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
        ...globals.serviceworker,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        // document: true,
        // navigator: true,
        // window: true,
        // node: true,
      },
    },
    ignores: ['**/node_modules/**/*', 'coverage/**/*', '**/build/**/*', '**/draft/**/*'],
    plugins: {
      '@babel': babelPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'strict': [2, 'never'],
      'eqeqeq': [1, 'smart'],
      'curly': [1, 'all'],
      'no-console': 1,
      'no-empty': 1,
      // 'quotes': [2, 'single', {allowTemplateLiterals: true}],
      // 'quote-props': [2, 'as-needed'],
      // 'indent': ['error', 2, {ignoredNodes: ['TemplateLiteral']}],
      // 'semi': [2, 'always'],
      // 'no-extra-semi': 2,
      // 'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
      // 'comma-dangle': [2, 'always-multiline'],

      'no-debugger': 1,
      'no-extra-bind': 1,
      'no-lone-blocks': 1,
      'no-var': 2,
      'no-unused-expressions': [1, {allowShortCircuit: true, allowTernary: true}],
      'no-unused-vars': [1, {args: 'none', ignoreRestSiblings: true}],
      'no-constant-condition': [2, {checkLoops: false}],
      'no-undef': 2,
      'no-restricted-globals': [2, 'event'],

      'react/jsx-uses-vars': 2,
      'react/jsx-no-undef': 2,
      'react/jsx-pascal-case': 1,
      'react/require-render-return': 2,
      'react/self-closing-comp': 2,

      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 1,
      // 'prettier/prettier': 'error',
    },
    settings: {
      'import/ignore': ['**/node_modules/**/*', 'coverage/**/*', '**/build/**/*', '**/draft/**/*'],
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
  },
];

export default configs;