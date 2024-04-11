const configFileList = [
  {
    name: 'eslint',
    path: './eslint.config.js',
    jsconfig: './.eslintrc.js',
  },
  {
    name: 'stylelint',
    path: './stylelint.config.js',
    jsconfig: './.stylelintrc.js',
  },
  {
    name: 'commitlint',
    path: './commitlint.config.js',
    jsconfig: './.commitlintrc.js',
  },
  {
    name: 'babel',
    path: './babel.config.js',
    jsconfig: './.babelrc.js',
  },
  {
    name: 'prettier',
    path: './prettier.config.js',
    jsconfig: './.prettierrc.js',
  },
  {
    name: 'jest',
    path: './jest.config.js',
  },
  {
    name: 'postcss',
    path: './postcss.config.js',
  },
  {
    name: 'version',
    path: './.versionrc.js',
  },
  {
    name: 'prettierignore',
    path: './.prettierignore',
  },
  {
    name: 'browserslist',
    path: './.browserslistrc',
  },
  {
    name: 'editorconfig',
    path: './.editorconfig',
  },
  {
    name: 'npmrcconfig',
    path: './.npmrc',
    alias: './.npmrcconfig',
  },
  {
    name: 'gitignoreconfig',
    path: './.gitignore',
    alias: './.gitignoreconfig',
  },
];

export default configFileList;
