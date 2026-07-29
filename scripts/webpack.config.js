import {resolve} from 'node:path';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { merge } from 'webpack-merge';
import esbuild from 'esbuild';

const webpackBaseConfigs = ({ appPath, publics, projectName, buildPath, devRoot } = {}) => {
  const entry = {
    app: [resolve(appPath, 'index.jsx')],
  };
  const templ = resolve(publics, 'index.html');
  const icon = resolve(publics, 'favicon.png');

  const plugins = [
    new HtmlWebpackPlugin({
      title: projectName,
      template: templ,
      favicon: icon,
      inject: true,
      scriptLoading: 'module',
      minify: false,
    }),
  ];

  const rules = [
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false,
      },
      exclude: /node_modules/,
    },
    {
      test: /\.jsx?$/,
      loader: 'esbuild-loader',
      options: {
        loader: 'jsx',
        target: 'esnext',
        jsx: 'automatic',
        tsconfigRaw: {},
        implementation: esbuild,
      },
      exclude: /node_modules/,
    },
    {
      test: /\.(jpe?g|png|gif|psd|bmp|ico|webp|svg|hdr)$/i,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 20480,
        },
      },
      generator: {
        filename: 'img/img_[hash:8][ext]',
      },
      exclude: /node_modules/,
    },
    {
      test: /\.(ttf|eot|svg|woff|woff2|otf)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 20480,
        },
      },
      generator: {
        filename: 'fonts/[hash:8][ext]',
        publicPath: '../',
      },
      exclude: /images/,
    },
    {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        minimize: true,
      },
      exclude: /node_modules/,
    },
    {
      test: /\.md$/,
      loader: 'html-loader',
      options: {
        minimize: false,
      },
      exclude: /node_modules/,
    },
    {
      test: /\.pdf$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 20480,
        },
      },
      generator: {
        filename: 'pdf/[hash][ext]',
      },
      exclude: /node_modules/,
    },
    {
      test: /\.(mp3|wav|mpeg|webm)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 20480,
        },
      },
      generator: {
        filename: 'audio/[hash][ext]',
      },
      exclude: /node_modules/,
    },
    {
      test: /\.(mp4|m4a|swf|xap|mpeg|webm)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 40960,
        },
      },
      generator: {
        filename: 'video/[hash][ext]',
      },
      exclude: /node_modules/,
    },
    {
      test: /\.(max|glb|gltf|fbx|stl|obj)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 40960,
        },
      },
      generator: {
        filename: 'models/[hash][ext]',
      },
      exclude: /node_modules/,
    },
  ];

  const baseConfigs = {
    context: appPath,
    experiments: {
      futureDefaults: true,
      topLevelAwait: true,
      asyncWebAssembly: true,
      layers: true,
    },
    node: {
      global: false,
      __filename: true,
      __dirname: true,
    },
    entry,
    output: {
      path: buildPath,
      publicPath: `${devRoot}/`,
      filename: 'js/[name].js',
    },
    optimization: {
      splitChunks: false,
      minimize: false,
      providedExports: false,
      usedExports: false,
      concatenateModules: false,
      sideEffects: 'flag',
      runtimeChunk: 'single',
      moduleIds: 'named',
      chunkIds: 'named',
    },
    externals: {},
    resolve: {
      modules: [appPath, 'node_modules'],
      alias: {
        '@app': appPath,
      },
      extensions: ['.jsx', '.js', '.less', '.css', '.ts', '.tsx'],
      fallback: {
        path: false,
        fs: false,
        process: false,
      },
      symlinks: false,
      cacheWithContext: false,
    },
    module: {
      rules,
    },
    plugins,
  };

  return baseConfigs;
};

export default webpackBaseConfigs;
