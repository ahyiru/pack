// import babelParser from '@babel/eslint-parser';
// import babelPlugin from '@babel/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactCompilerPlugin from 'eslint-plugin-react-compiler';
import js from "@eslint/js";
import globals from "globals";
import {fixupPluginRules} from '@eslint/compat';

const configs = (customCfgs = []) => [
  js.configs.recommended,
  ...customCfgs,
  {
    ignores: ['**/node_modules/', 'coverage/', '**/build/', '**/draft/'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-react'], // '@babel/preset-env',
        },
      },
      globals: {
        ...globals.browser,
        // ...globals.commonjs,
        // ...globals.es2021,
        ...globals.node,
        ...globals.jest,
        ...globals.serviceworker,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: fixupPluginRules(reactPlugin),
      'react-hooks': reactHooksPlugin,
      'react-compiler': reactCompilerPlugin,
    },
    rules: {
      'strict': [2, 'never'],
      'eqeqeq': [1, 'smart'],
      'curly': [1, 'all'],
      'no-console': 1,
      'no-empty': 1,
      'no-debugger': 1,
      'no-extra-bind': 1,
      'no-lone-blocks': 1,
      'no-var': 2,
      'no-unused-expressions': [1, {allowShortCircuit: true, allowTernary: true}],
      'no-unused-vars': [1, {args: 'none', ignoreRestSiblings: true}],
      'no-constant-condition': [2, {checkLoops: false}],
      'no-undef': 2,
      'no-restricted-globals': [2, 'event'],

      'react/jsx-key': 2,
      'react/jsx-pascal-case': 1,
      'react/self-closing-comp': 2,
      'react/require-render-return': 2,
      'react/jsx-uses-vars': 2,
      'react/jsx-no-undef': 2,
      
      'react-hooks/rules-of-hooks': 2,
      'react-hooks/exhaustive-deps': 1,

      'react-compiler/react-compiler': 2,
    },
    settings: {
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
  },
];

export default configs;