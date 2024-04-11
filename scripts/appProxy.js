import {createProxyMiddleware} from 'http-proxy-middleware';

const proxyCfg = proxy => ({
  prefix: proxy?.prefix || '/api',
  opts: {
    target: proxy?.url || proxy,
    changeOrigin: true,
    // onProxyReq: (proxyReq, req, res) => {
    //   proxyReq.setHeader('clientip', req.ip);
    // },
    // xfwd: true,
    ...(typeof proxy === 'object' ? proxy : null),
  },
});

const appProxy = (app, proxys) => {
  if (Array.isArray(proxys)) {
    proxys.map(proxyItem => {
      const {prefix, opts} = proxyCfg(proxyItem);
      app.use(prefix, createProxyMiddleware(opts));
    });
  } else if (proxys) {
    const {prefix, opts} = proxyCfg(proxys);
    app.use(prefix, createProxyMiddleware(opts));
  }
};

export default appProxy;
