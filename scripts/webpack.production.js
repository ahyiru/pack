import path from 'node:path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { EsbuildPlugin } from 'esbuild-loader';
import CopyFileWebpackPlugin from '@huxy/copy-file-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { GenerateSW } from 'workbox-webpack-plugin';
import webpackBaseConfigs from './webpack.config.js';

const webpackProdConfigs = async (config) => {
  const { userConfigs, baseConfigs } = await webpackBaseConfigs();
  const { rootDir, appPath, publics, buildPath, PROXY, envConfigs, prodRoot, webpackProdCfg } = userConfigs;

  const { copy, buildConfigs, ...restProdCfg } = webpackProdCfg;

  const getCssLoaderOptions = () => ({
    importLoaders: 1,
    modules: {
      mode: 'global',
      localIdentName: '[hash:base64:5]',
    },
  });

  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 30000,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css',
      chunkFilename: 'css/[id]_[name]_[contenthash:8].css',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        configs: {
          browserRouter: true,
          basepath: prodRoot,
          PROXY,
          buildTime: +new Date(),
          ...envConfigs,
        },
        NODE_ENV: JSON.stringify('production'),
      }),
      EMAIL: JSON.stringify('ah.yiru@gmail.com'),
      VERSION: JSON.stringify('2.x.x'),
    }),
    new GenerateSW({
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
    }),
    new CopyFileWebpackPlugin([
      {
        from: path.resolve(publics, 'src'),
        to: path.resolve(appPath, `${buildPath}/src`),
        isDef: true,
      },
      {
        from: path.resolve(publics, 'manifest.json'),
        to: path.resolve(appPath, `${buildPath}/manifest.json`),
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
    cache: false,
    experiments: {
      outputModule: true,
    },
    output: {
      clean: true,
      path: buildPath,
      publicPath: `${prodRoot}/`,
      filename: 'js/[name]_[contenthash:8].js',
      chunkFilename: 'js/[name]_[contenthash:8].chunk.js',
      module: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
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
          pure: ['console.log'],
          ...buildConfigs,
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
          type: 'javascript/auto',
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: getCssLoaderOptions(),
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
        {
          test: /\.less$/,
          type: 'javascript/auto',
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                ...getCssLoaderOptions(),
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
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
        },
      ],
    },
    plugins,
  };

  return merge(baseConfigs, prodConfigs, restProdCfg);
};

export default webpackProdConfigs;
