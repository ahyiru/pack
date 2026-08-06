import path from 'node:path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { EsbuildPlugin } from 'esbuild-loader';
import CopyFileWebpackPlugin from '@huxy/copy-file-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { GenerateSW } from 'workbox-webpack-plugin';
import webpackBaseConfigs from './webpack.config.js';
import getEnvConfigs from './envConfigs.js';

const webpackProdConfigs = async ({proxys, basepath, buildPath } = {}) => {
  const userConfigs = await getEnvConfigs();
  const { projectName = 'Huxy', appPath, publics, envConfigs, webpackCfg, webpackProdCfg } = userConfigs;
  const { copy, buildConfigs, ...restProdCfg } = webpackProdCfg;

  const publicPath = basepath === '/' ? basepath : `${basepath}/`;

  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 30000,
    }),
    new webpack.DefinePlugin({
      __HUXY_CONFIG__: JSON.stringify({
        EMAIL: 'ah.yiru@gmail.com',
        VERSION: '2.x.x',
        browserRouter: true,
        basepath,
        PROXY: proxys,
        buildTime: +new Date(),
        ...envConfigs,
      }),
    }),
    new GenerateSW({
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      exclude: [/\.map$/, /runtime.*\.js$/],
      runtimeCaching: [
        {
          urlPattern: /\.(js|css|woff2?|ttf|eot|svg)$/,
          handler: 'StaleWhileRevalidate',
        },
        {
          urlPattern: /\.(png|jpg|jpeg|gif|webp)$/,
          handler: 'CacheFirst',
        },
      ],
    }),
    new CopyFileWebpackPlugin([
      {
        from: path.resolve(publics, 'src'),
        to: path.resolve(appPath, `${buildPath}/src`),
        isDef: true,
      },
      {
        from: path.resolve(publics, 'robots.txt'),
        to: path.resolve(appPath, `${buildPath}/robots.txt`),
        isDef: true,
      },
      ...(Array.isArray(copy) ? copy : []),
    ]),
  ];

  if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  const prodConfigs = {
    mode: 'production',
    output: {
      clean: true,
      path: buildPath,
      publicPath,
      filename: 'js/[id]_[contenthash:8].js',
      chunkFilename: 'js/[id]_[contenthash:8].chunk.js',
      cssFilename: 'css/[id]_[contenthash:8].css',
      cssChunkFilename: 'css/[id]_[contenthash:8].chunk.css',
    },
    module: {
      parser: {
        html: {
          template: (source, { resource, addDependency }) => {
            addDependency(resource);
            return source.replaceAll('{{title}}', projectName);
          },
        },
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: {
          javascript: 512000,
          style: 384000,
        },
        minChunks: 2,
        cacheGroups: {
          commons: {
            idHint: 'commons',
            test: appPath,
            priority: 5,
            reuseExistingChunk: true,
          },
          defaultVendors: {
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
            priority: 20,
            test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
          },
          three: {
            idHint: 'three',
            priority: 25,
            test: /[\\/]node_modules[\\/]three[\\/]/,
          },
          antd: {
            idHint: 'antd',
            priority: 30,
            test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
          },
        },
      },
      minimize: true,
      minimizer: [
        new EsbuildPlugin({
          target: 'esnext',
          format: 'esm',
          css: true,
          minify: true,
          minifyWhitespace: true,
          minifyIdentifiers: true,
          minifySyntax: true,
          legalComments: 'none',
          drop: ['console'],
          ...buildConfigs,
        }),
      ],
      concatenateModules: false,
    },
    plugins,
  };

  return merge(webpackBaseConfigs(userConfigs), prodConfigs, webpackCfg, restProdCfg);
};

export default webpackProdConfigs;
