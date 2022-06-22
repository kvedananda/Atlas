const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.DEV_API_URL || 'http://localhost:3001',
      changeOrigin: true,
    })
  );
};
