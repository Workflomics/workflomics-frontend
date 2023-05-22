require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = {
  target: process.env.API_PROXY_TARGET,
  changeOrigin: true,
  pathRewrite: {'^/api' : ''}
}

const apeProxy = {
  target: process.env.APE_PROXY_TARGET,
  changeOrigin: true,
  pathRewrite: {'^/ape' : ''}
}

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware(proxy)
  );
  app.use(
    '/ape',
    createProxyMiddleware(apeProxy)
  );
};
