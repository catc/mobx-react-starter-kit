const { resolve } = require('path');
const webpack = require('webpack');
const config = require('./webpack.base');
const devServer = require('webpack-dev-server');

const PORT = 7005;
const PUBLIC_PATH = '/assets/';
const ROOT = resolve(__dirname);
const EXTERNAL_PROXY_PORT = 2222;

// set mode
config.mode = 'development'

// add hmr plugins
[].push.apply(config.plugins, [
	// enable HMR globally
	new webpack.HotModuleReplacementPlugin(),

	// prints more readable module names in the browser console on HMR updates
	new webpack.NamedModulesPlugin(),

	// do not emit compiled assets that include errors
	new webpack.NoEmitOnErrorsPlugin(),
]);

// add HMR stuff to entry
if (typeof config.entry === 'object'){
	Object.keys(config.entry).forEach(entryKey => {
		const val = config.entry[entryKey]
		config.entry[entryKey] = constructHMREntry(config.entry[entryKey])
	})
} else if (typeof config.entry === 'string'){
	config.entry = constructHMREntry(config.entry)
}
function constructHMREntry(entry){
	return [
		// activate HMR for React
		'react-hot-loader/patch',

		// bundle the client for webpack-dev-server
		// and connect to the provided endpoint
		`webpack-dev-server/client?http://localhost:${PORT}`,

		// bundle the client for hot reloading
		// only- means to only hot reload for successful updates
		'webpack/hot/only-dev-server',

		entry
	];
}


// css
/*config.module.rules[1].use.unshift('style-loader');
config.module.rules[1].use.unshift('react-hot-loader/webpack')*/


// necessary for HMR to know where to load the hot update chunks
config.output.publicPath = PUBLIC_PATH;

// setup dev server config
const devServerConfig = {
	hot: true,
	publicPath: PUBLIC_PATH,
	contentBase: ROOT,
	headers: {'Access-Control-Allow-Origin': '*'},

	// respond to 404s with index.html
	historyApiFallback: true,

	// logging
	stats: 'errors-only',
	clientLogLevel: 'warning',

	proxy: {
		'/static/': {
			target: `http://localhost:${EXTERNAL_PROXY_PORT}`,
		},
		// TODO - eventually rename route prefix from `/s` to `/api`
		'/s/': {
			target: `http://localhost:${EXTERNAL_PROXY_PORT}`,
		}
	}
};


// start server
new devServer(webpack(config), devServerConfig).listen(PORT, '0.0.0.0', err => {
	if (err){
		throw new Error('webpack dev server error', err);
	}
	console.log(`Webpack dev server listening on port ${PORT}`);
});