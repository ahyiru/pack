import webpack from 'webpack';

const buildSrc = (options) => {
  const searchParams = new URLSearchParams(Object.entries(options).filter(([_, val]) => val !== undefined && val !== null));
  const queryString = searchParams.toString();
  return queryString ? `&${queryString}` : '';
};

export const huxyHtmlPlugin = ({publicPath = '/', ...rest} = {}) => ({
  name: 'HuxyHtmlPlugin',
  apply: compiler => {
    const hmrClient = `webpack-hot-middleware/client.js?path=${publicPath}__webpack_hmr${buildSrc({reload: true, ...rest})}`;
    compiler.hooks.thisCompilation.tap('HuxyHtmlPlugin', compilation => {
      const hooks = webpack.html.HtmlModulesPlugin.getCompilationHooks(compilation);
      hooks.injectTags.tap('HuxyHtmlPlugin', tags => [
        ...tags,
        {
          injectTo: 'body',
          tag: 'script',
          attrs: {
            src: hmrClient,
          },
        },
      ]);
      // hooks.transformHtml.tapPromise('HuxyHtmlPlugin', async (html, { outputName }) =>
      //   html.replaceAll('{{title}}', projectName),
      // );
    });
  },
});

export default huxyHtmlPlugin;