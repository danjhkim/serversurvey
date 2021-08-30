const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		['/api/*', '/auth/google'],
		createProxyMiddleware({
			target: 'http://localhost:5000',
		}),
	);
};

// THIS proxies all client requests to the backend address

//react looks for a file of this name and uses it.

//only works for dev not production
