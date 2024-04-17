import {createProxyMiddleware} from 'http-proxy-middleware';

const proxyCfg = ({prefix = '/api', url, ...rest}) => ({
  prefix,
  opts: {
    target: url,
    changeOrigin: true,
    pathRewrite: {'^/': `${prefix}/`},
    // onProxyReq: (proxyReq, req, res) => {
    //   proxyReq.setHeader('clientip', req.ip);
    // },
    // xfwd: true,
    ...rest,
  },
});

const fixProxy = proxyItem => typeof proxyItem === 'string' ? {url: proxyItem} : proxyItem;

const appProxy = (app, proxys) => {
  if (Array.isArray(proxys)) {
    proxys.map(proxyItem => {
      const {prefix, opts} = proxyCfg(fixProxy(proxyItem));
      app.use(prefix, createProxyMiddleware(opts));
    });
  } else if (proxys) {
    const {prefix, opts} = proxyCfg(fixProxy(proxys));
    app.use(prefix, createProxyMiddleware(opts));
  }
};

export default appProxy;
