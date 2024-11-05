import path from 'node:path';
// import {fileURLToPath} from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {merge} from 'webpack-merge';
import esbuild from 'esbuild';

const {rootDir, appPath, publics, projectName, buildPath, devRoot, webpackCfg} = (await import('./envConfigs.js')).default;

const entry = {
  app: [path.resolve(appPath, 'index.jsx')],
  // ...frame,
};
const templ = path.resolve(publics, 'index.html');
const icon = path.resolve(publics, 'favicon.png');

const htmlPlugin = () =>
  new HtmlWebpackPlugin({
    title: projectName,
    template: templ,
    favicon: icon,
    inject: true,
    scriptLoading: 'module',
    minify: {
      html5: true,
      collapseWhitespace: true,
      // conservativeCollapse: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeComments: true,
      removeTagWhitespace: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  });

const plugins = [
  htmlPlugin(),
];

const rules = [
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
    exclude: [/node_modules/],
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
    exclude: [/node_modules/],
  },
  {
    test: /\.(jpe?g|png|gif|psd|bmp|ico|webp|svg|hdr)$/i,
    loader: 'url-loader',
    options: {
      limit: 20480,
      name: 'img/img_[hash:8].[ext]',
      // publicPath:'../',
      esModule: false,
    },
    type: 'javascript/auto',
    exclude: [/node_modules/],
  },
  {
    test: /\.(ttf|eot|svg|woff|woff2|otf)$/,
    loader: 'url-loader',
    options: {
      limit: 20480,
      name: 'fonts/[hash:8].[ext]',
      publicPath: '../',
      esModule: false,
    },
    exclude: [/images/],
  },
  {
    test: /\.html$/,
    use: {
      loader: 'html-loader',
      options: {
        minimize: true,
      },
    },
    include: [appPath],
    exclude: [/node_modules/, /public/],
  },
  {
    test: /\.md$/,
    use: [
      {
        loader: 'html-loader',
        options: {
          minimize: false,
        },
      },
    ],
    exclude: [/node_modules/],
  },
  {
    test: /\.pdf$/,
    loader: 'url-loader',
    options: {
      limit: 20480,
      name: 'pdf/[hash].[ext]',
    },
    exclude: [/node_modules/],
  },
  {
    test: /\.(mp3|wav|mpeg|webm)$/,
    loader: 'url-loader',
    options: {
      limit: 20480,
      name: 'audio/[hash].[ext]',
    },
    exclude: [/node_modules/],
  },
  {
    test: /\.(mp4|m4a|swf|xap|mpeg|webm)$/,
    loader: 'url-loader',
    options: {
      limit: 40960,
      name: 'video/[hash].[ext]',
    },
    exclude: [/node_modules/],
  },
  {
    test: /\.(max|glb|gltf|fbx|stl|obj)$/,
    loader: 'url-loader',
    options: {
      limit: 40960,
      name: 'models/[hash].[ext]',
    },
    exclude: [/node_modules/],
  },
];

const baseConfigs = {
  context: appPath,
  cache: {
    type: 'filesystem',
    /* buildDependencies: {
      config: [fileURLToPath(import.meta.url)],
    }, */
  },
  experiments: {
    futureDefaults: true,
    topLevelAwait: true,
    // outputModule: true,
    asyncWebAssembly: true,
    layers: true,
    // lazyCompilation: true,
  },
  node: {
    global: false,
    __filename: true,
    __dirname: true,
  },
  entry: entry,
  output: {
    path: buildPath,
    publicPath: `${devRoot}/`,
    filename: 'js/[name].js',
    // module: true,
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
      path: false, //require.resolve('path-browserify'),
      fs: false,
      process: false,
    },
    symlinks: false,
    cacheWithContext: false,
  },
  module: {
    rules: rules,
  },
  plugins: plugins,
};

export default merge(baseConfigs, webpackCfg);
