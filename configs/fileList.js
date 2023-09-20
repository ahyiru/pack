const configFileList = [
  {
    name: 'eslint',
    path: './.eslintrc.cjs',
    jsconfig: './.eslintrc.js',
  },
  {
    name: 'stylelint',
    path: './.stylelintrc.cjs',
    jsconfig: './.stylelintrc.js',
  },
  {
    name: 'commitlint',
    path: './commitlint.config.cjs',
    jsconfig: './.commitlint.config.js',
  },
  {
    name: 'jest',
    path: './jest.config.cjs',
    jsconfig: './.jest.config.js',
  },
  {
    name: 'postcss',
    path: './postcss.config.cjs',
    jsconfig: './.postcss.config.js',
  },
  {
    name: 'babel',
    path: './babel.config.cjs',
    jsconfig: './.babel.config.js',
  },
  {
    name: 'prettier',
    path: './prettier.config.cjs',
    jsconfig: './.prettier.config.js',
  },
  {
    name: 'version',
    path: './.versionrc.cjs',
    jsconfig: './.versionrc.js',
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
    name: 'npmconfig',
    path: './.npmrc',
    alias: './npmconfig',
  },
];

export default configFileList;
