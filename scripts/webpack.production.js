import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { EsbuildPlugin } from 'esbuild-loader';
import CopyFileWebpackPlugin from '@huxy/copy-file-webpack-plugin';
import fixHtmlWebpackPlugin from 'fix-html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { GenerateSW } from 'workbox-webpack-plugin';
import webpackBaseConfigs from './webpack.config.js';
import getEnvConfigs from './envConfigs.js';

const webpackProdConfigs = async () => {
  const userConfigs = await getEnvConfigs();
  const { projectName = 'Huxy', appPath, publics, proxys, buildPath, prodEnv, envConfigs, webpackCfg, webpackProdCfg } = userConfigs;
  const { copy, buildConfigs, ...restProdCfg } = webpackProdCfg;

  const {basepath, publicPath} = prodEnv;

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
        from: `${publics}/src`,
        to: `${buildPath}/src`,
        isDef: true,
      },
      {
        from: `${publics}/robots.txt`,
        to: `${buildPath}/robots.txt`,
        isDef: true,
      },
      ...(Array.isArray(copy) ? copy : []),
    ]),
    fixHtmlWebpackPlugin({publicPath, templateVars: {title: projectName}}),
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
      filename: 'js/[name]_[contenthash:8].js',
      chunkFilename: 'js/[name]_[contenthash:8].chunk.js',
      cssFilename: 'css/[name]_[contenthash:8].css',
      cssChunkFilename: 'css/[name]_[contenthash:8].chunk.css',
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
