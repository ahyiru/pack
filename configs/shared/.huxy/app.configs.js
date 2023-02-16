const app = {
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
