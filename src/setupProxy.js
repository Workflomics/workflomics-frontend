require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxy = {
    target: process.env.API_PROXY_TARGET,
    changeOrigin: true,
    pathRewrite: {'^/api' : ''}
}

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware(proxy)
  );
};
