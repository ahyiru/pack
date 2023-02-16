## pack

### app.configs

```javascript
const app = {
  // HOST: 'http://localhost',
  PORT: 8080,
  PROD_PORT: 8081,
  PUBLIC_DIR: 'public',
  BUILD_DIR: 'build',
  DEV_ROOT_DIR: '/',
  PROD_ROOT_DIR: '/',
  projectName: 'XX平台',
  /* PROXY: {
    url: 'http://127.0.0.1:9000',
    prefix: '/api',
  }, */
  envConfigs: {
    // 全局环境变量
    name: '项目名',
    _id: '其它属性',
  },
};

const webpack = {
  ...
  dev: {
    ...
  },
  prod: {
    ...
  },
};

module.exports = {
  app,
  webpack: {
    resolve: {
      alias: {
        '@huxy': 'playground/huxy',
      },
    },
    prod: {
      copy: [
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

### 运行

```
"start": "pack start",
"build": "pack run build",
"analyze": "pack run analyze",
"server": "pack run server",
"test": "pack run test",
```