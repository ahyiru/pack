## @huxy/pack

构建工具。集成了 `babel`、`eslint`、`stylelint`、`jest`、`commitlint`、`husky`、`standard-version`、`postcss`、`prettier`，提供开发环境、构建打包、本地启动服务、环境配置、代理配置等功能。

运行时会自动生成基础配置文件，可自行修改。生成基础用户配置文件 `.huxy/app.configs.js` ，用户自行配置即可。

### app.configs

用户环境配置：

```javascript
const app = {
  // entry: 'app', // 项目入口目录，默认 app 文件夹
  // HOST: 'http://localhost', // 本地运行
  PORT: 8080, // 本地开发环境端口
  PROD_PORT: 8081, // 本地生产环境端口
  PUBLIC_DIR: 'public', // public 文件路径
  BUILD_DIR: 'build', // 构建产物路径
  DEV_ROOT_DIR: '/', // 开发环境 basepath
  // PROD_ROOT_DIR: '/huxy', // 生产环境 basepath
  projectName: 'XX平台', // 名称，页面初始化 title
  /* PROXY: { // 代理配置
    url: 'http://127.0.0.1:9000',
    prefix: '/api',
  }, */
  envConfigs: { // 全局环境变量
    name: '项目名',
    _id: '其它属性',
  },
};

const webpack = { // webpack 配置
  // ... // 基础配置
  dev: { // 开发环境配置
    // ...
  },
  prod: { // 生产环境配置
    // ...
  },
};

module.exports = {
  app,
  webpack,
};

// 例如

module.exports = {
  app,
  webpack: {
    resolve: {
      alias: {
        '@huxy': 'playground/huxy',
      },
    },
    prod: {
      copy: [ // 拷贝文件
        {
          from: 'app/public/robots.txt',
          to: 'build/public/robots.txt',
        },
      ],
    },
  },
};
```

- copy：构建完成拷贝文件或文件夹。

### 运行命令

```
"start": "pack start",
"build": "pack run build",
"analyze": "pack run analyze",
"server": "pack run server",
"test": "pack run test",
```

其它 `npm` 命令：

```
"eslint": "pack eslint 'app/**/*.{js,jsx}'", // 或直接使用 eslint
"eslint-common": "eslint 'common/**/*.{js,jsx}'",
"stylelint": "stylelint 'app/**/*.{css,less}'",
"lint-fix": "eslint --fix 'app/**/*.{js,jsx}' && stylelint --fix 'app/**/*.{css,less}'",
"prettier": "prettier 'app/**/*' --write --ignore-unknown",
"release": "standard-version"
```