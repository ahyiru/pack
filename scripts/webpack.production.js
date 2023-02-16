const webpack = require('webpack');
const path = require('path');
const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// const esbuild = require('esbuild');
const {EsbuildPlugin} = require('esbuild-loader');

const CopyFileWebpackPlugin = require('@huxy/copy-file-webpack-plugin');

// const CompressionPlugin = require('compression-webpack-plugin');

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const {GenerateSW} = require('workbox-webpack-plugin');

const webpackBaseConfigs = require('./webpack.config');

const {rootDir, appPath, publics, buildPath, PROXY, envConfigs, prodRoot, webpackProdCfg} = require('./envConfigs');

const {copy, ...restProdCfg} = webpackProdCfg;

let copyConfigs = [];

try {
  if (Array.isArray(copy)) {
    copyConfigs = copy.map(({from, to}) => ({
      from: path.resolve(rootDir, from),
      to: path.resolve(rootDir, to),
    }));
  }
} catch(err) {
  console.error(err);
}

  

const plugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.MinChunkSizePlugin({
    minChunkSize: 30000,
  }),
  new MiniCssExtractPlugin({
    filename: 'css/[name]_[contenthash:8].css',
    chunkFilename: 'css/[id]_[name]_[contenthash:8].css',
    // publicPath:'../',
  }),
  new webpack.DefinePlugin({
    'process.env': {
      configs: JSON.stringify({
        browserRouter: true,
        basepath: prodRoot,
        PROXY,
        buildTime: +new Date(),
        ...envConfigs,
      }),
    },
    EMAIL: JSON.stringify('ah.yiru@gmail.com'),
    VERSION: JSON.stringify('2.x.x'),
  }),
  new GenerateSW({
    // importWorkboxFrom: 'local',
    cacheId: 'huxy-pwa',
    skipWaiting: true, // 跳过 waiting 状态
    clientsClaim: true, // 通知让新的 sw 立即在页面上取得控制权
    cleanupOutdatedCaches: true, // 删除过时、老版本的缓存
  }),
  new CopyFileWebpackPlugin([
    {
      from: path.resolve(publics, 'src'),
      to: path.resolve(appPath, `${buildPath}/src`),
    },
    {
      from: path.resolve(publics, 'manifest.json'),
      to: path.resolve(appPath, `${buildPath}/manifest.json`),
    },
    {
      from: path.resolve(publics, 'robots.txt'),
      to: path.resolve(appPath, `${buildPath}/robots.txt`),
    },
    ...copyConfigs,
  ]),
  /* new CompressionPlugin({
    test: /\.(js|css)(\?.*)?$/i,
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    threshold: 10240,
    minRatio: 0.8,
    deleteOriginalAssets: false,
  }), */
];

if (process.env.ANALYZE) {
  plugins.push(new BundleAnalyzerPlugin());
}

const prodConfigs = {
  mode: 'production',
  // devtool:'nosources-source-map',
  output: {
    clean: true,
    path: buildPath,
    publicPath: `${prodRoot}/`,
    filename: 'js/[name]_[contenthash:8].js',
    chunkFilename: 'js/[name]_[chunkhash:8].chunk.js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all', //'async','initial'
      // minSize:0,
      minSize: {
        javascript: 5000,
        style: 5000,
      },
      maxSize: {
        javascript: 500000,
        style: 500000,
      },
      minChunks: 2,
      maxInitialRequests: 10,
      maxAsyncRequests: 10,
      // automaticNameDelimiter: '~',
      cacheGroups: {
        commons: {
          // chunks:'initial',
          // minSize:30000,
          idHint: 'commons',
          test: appPath,
          priority: 5,
          reuseExistingChunk: true,
        },
        defaultVendors: {
          // chunks:'initial',
          idHint: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
          priority: 10,
        },
        react: {
          idHint: 'react',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          enforce: true,
          priority: 15,
        },
        echarts: {
          idHint: 'echarts',
          chunks: 'all',
          priority: 20,
          test: ({context}) => context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0),
        },
        three: {
          idHint: 'three',
          chunks: 'all',
          priority: 25,
          test: ({context}) => context && context.indexOf('three') >= 0,
        },
        antd: {
          idHint: 'antd',
          chunks: 'all',
          priority: 30,
          test: ({context}) => context && (context.indexOf('@ant-design') >= 0 || context.indexOf('antd') >= 0),
        },
      },
    },
    minimizer: [
      /* new TerserPlugin({
        // minify: TerserPlugin.esbuildMinify,
        parallel: true,
        extractComments: false,
        terserOptions: {
          ecma: 5,
          compress: {
            drop_console: true,
          },
          format: {
            comments: false,
          },
          parse: {},
          mangle: true,
          module: false,
        },
      }),
      new CssMinimizerPlugin({
        // minify: CssMinimizerPlugin.esbuildMinify,
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: {removeAll: true},
              // calc: false,
              // normalizePositions: false,
            },
          ],
        },
      }), */
      new EsbuildPlugin({
        target: 'es2018',
        css: true, // 缩小CSS
        minify: true, // 缩小JS
        minifyWhitespace: true, // 去掉空格
        minifyIdentifiers: true, // 缩短标识符
        minifySyntax: true, // 缩短语法
        legalComments: 'none', // 去掉注释
        // implementation: esbuild, // 自定义 esbuild 版本
      }),
    ],
    minimize: true,
    providedExports: true,
    usedExports: true,
    concatenateModules: false,
    sideEffects: true,
    runtimeChunk: false,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: '../',
            },
          },
          /* {
            loader:'isomorphic-style-loader',
          }, */
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'global',
                localIdentName: '[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
        ],
        // exclude: [/node_modules/],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'global',
                localIdentName: '[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
        // exclude: [/node_modules/],
      },
      /* {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                indentWidth: 2,
              },
              additionalData: (content, loaderContext) => {
                if (loaderContext.resourcePath.endsWith('app/styles/index.scss')) {
                  return content;
                }
                return `@import '~@app/styles/index.scss';${content};`;
              },
            },
          },
        ],
      }, */
    ],
  },
  plugins,
};

if (restProdCfg.resolve?.alias) {
  Object.keys(restProdCfg.resolve.alias).map(key => {
    restProdCfg.resolve.alias[key] = path.resolve(rootDir, restProdCfg.resolve.alias[key]);
  });
}

module.exports = merge(webpackBaseConfigs, prodConfigs, restProdCfg);
