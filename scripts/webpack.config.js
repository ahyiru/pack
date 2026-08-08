import {resolve} from 'node:path';
import { fileURLToPath } from 'node:url';
import { merge } from 'webpack-merge';
import esbuild from 'esbuild';

const webpackBaseConfigs = ({ appPath, publics, buildPath } = {}) => {
  // const app = resolve(appPath, 'index.jsx');
  // const icon = resolve(publics, 'favicon.png');

  const templ = resolve(publics, 'index.html');

  const entry = {
    app: templ,
  };

  const generator = {
    css: {
      exportsOnly: false,
    },
    'css/auto': {
      localIdentName: '[uniqueName]-[id]-[local]',
    },
  };
  const parser = {
    javascript: {
      url: false, 
    },
    css: {
      import: true,
      url: true,
    },
    'css/auto': {
      dashedIdents: false,
      customIdents: false,
    },
  };

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
      use: [
        {
          loader: 'esbuild-loader',
          options: {
            loader: 'jsx',
            target: 'esnext',
            jsx: 'automatic',
            tsconfigRaw: {},
            implementation: esbuild,
          },
        },
      ],
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      type: 'css/auto',
      exclude: /node_modules/,
    },
    {
      test: /\.less$/,
      type: 'css/auto',
      use: ['less-loader'],
      exclude: /node_modules/,
    },
    {
      test: /\.md$/,
      type: 'asset/resource',
      use: [
        {
          loader: 'html-loader',
          options: {
            minimize: false,
          },
        },
      ],
      generator: {
        filename: 'md/[name][ext]',
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
      exclude: [/node_modules/, publics],
    },
    {
      test: /\.(ttf|eot|woff|woff2|otf)$/,
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
      exclude: [/node_modules/, /images/],
    },
    {
      test: /\.pdf$/,
      type: 'asset/resource',
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
      type: 'asset/resource',
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
      type: 'asset/resource',
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
      type: 'asset/resource',
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
    target: 'web',
    context: appPath,
    experiments: {
      futureDefaults: true,
      html: true,
      css: true,
      outputModule: true,
      resourceHints: true,
    },
    node: {
      global: false,
      __filename: true,
      __dirname: true,
    },
    entry,
    output: {
      module: true,
      path: buildPath,
      /*html: {
        title: projectName,
        // favicon: {
        //   icon: [{ href: icon, sizes: '64x64' }],
        //   'apple-touch-icon': [{ href: icon, sizes: '64x64' }],
        // },
        // manifest,
      },*/
      htmlFilename: 'index.html',
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
        module: false,
      },
      symlinks: false,
      cacheWithContext: false,
    },
    module: {
      generator,
      parser,
      rules,
    },
    optimization: {
      runtimeChunk: 'single',
    },
  };

  return baseConfigs;
};

export default webpackBaseConfigs;
