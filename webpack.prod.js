const { resolve } = require('path');
const {
	readFile,
	writeFile,
	unlinkSync,
	readdirSync,
	mkdirSync,
	lstatSync
} = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const config = require('./webpack.config.base');
const ASSETS_DIR = resolve(__dirname, '../static/assets')

clearAssetsDir();

// set mode
config.mode = 'production'

config.output = {
	// path: config.output.path,
	path: ASSETS_DIR,

	// required for chunks to be loaded from `/assets/` dir correctly
	publicPath: '/assets/',
	
	// fingerprinting
	// filename: 'bundle.[chunkhash].js',
	filename: '[name].[chunkhash].js',
	chunkFilename: '[name].[chunkhash].js'
};



// css
const extractRegularCSS = new ExtractTextPlugin({
	// filename: '[name].[contenthash].css',
	filename: 'main.[contenthash].css',
	// filename: 'main.css',

	// combines chunked css into main css
	allChunks: true,
});


// add build plugins
[].push.apply(config.plugins, [
	// extract css
	extractRegularCSS,

	// create vendor bundle
	/*
		NOTE - this doesn't capture node_modules used in split chunks
		so any `bundle-loader` or `require.ensure`/`import` chunks won't 
		pull out node_modules
	*/
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendor',
		filename: 'vendor.[chunkhash].js',
		minChunks: ({ resource }) => /node_modules/.test(resource),
	}),

	// ************* async packages ***************

	/*
		NOTES
		- uses async, meaning that webpack will only search through async
		split modules for packages and will create an async common package
	*/
	/*new webpack.optimize.CommonsChunkPlugin({
		async: 'react-dnd',
		// filename: 'react-dnd.[chunkhash].js',
		minChunks(module, count) {
			var context = module.context;
			var targets = ['react-dnd', 'react-dnd-html5-backend', 'dnd-core']
			return context && context.indexOf('node_modules') >= 0 && targets.find(t => context.indexOf(t) > -1)
		},
	}),*/

	new webpack.optimize.CommonsChunkPlugin({
		async: 'used-twice',
		minChunks(module, count) {
			return count >= 2;
		},
	}),

	// retains hashnames for unmodified chunks 
	new webpack.HashedModuleIdsPlugin(),

	// define env variables
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}),

	// generate manifest
	new AssetsPlugin({
		filename: 'manifest.json',
		// path: resolve(__dirname, 'assets')
		path: ASSETS_DIR
	}),

	// uglify
	/*new webpack.optimize.UglifyJsPlugin({
		sourceMap: true,
		comments: false
	}),*/
]);

if (process.env.NODE_ANALYZE){
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	config.plugins.push(new BundleAnalyzerPlugin({
		analyzerMode: 'static'
	}))
}

// css
const ExtractCSS = extractRegularCSS.extract({
	use: [
		{
			loader: 'css-loader',
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: [
					require('autoprefixer')({
						browsers: [
							'> 1%',
							'Safari 8',
							'Last 2 versions'
						]
					}),
					// bundled with `css-loader`
					require('cssnano')({
						reduceIdents: false,
						discardUnused: false
					}),
				]
			}
		},
		{
			loader: 'sass-loader',
		}
	]
});
config.module.rules[1].use = ExtractCSS;


// build
webpack(config, (err, stats) => {
	if (err){
		console.error(err)
		throw new Error('Error building bundle')
	}
	console.log(`Successfully built bundle in "${config.output.path}"`);

	// handle errors + warnings
	const info = stats.toJson();
	const br = '----------------------';
	if (stats.hasErrors()) {
		console.error(`${br}\n`, info.errors, `\n${br}`);
	}
	if (stats.hasWarnings()) {
		console.error(`${br}\n`, info.warnings, `\n${br}`);
	}

	// log stats
	console.log(`${br}\n`, stats.toString({
		chunks: true,
		colors: true,
		modules: false,
		chunkModules: false
		// hash: true
	}))

	copyHTML();
})

function copyHTML(){
	const manifest = require(resolve(ASSETS_DIR, 'manifest.json'));
	
	// copy `index.html` to /dist
	const HTML_ENTRY = resolve(__dirname, 'index.html');
	const HTML_OUTPUT = resolve(ASSETS_DIR, 'index.html');
	readFile(HTML_ENTRY, 'utf8', function(err, html) {
		if (err) {
			return console.log(err);
		}
		
		let result = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
		result = result.replace(/<!-- VENDOR_JS -->/, createScript(manifest.vendor.js))
		result = result.replace(/<!-- BUNDLE_JS -->/, createScript(manifest.bundle.js))
		result = result.replace(/<!-- BUNDLE_CSS -->/, createStylesheet(manifest.bundle.css))

		writeFile(HTML_OUTPUT, result, 'utf8', function (err) {
			if (err){
				return console.log(err)
			};
		});
	});

	function createScript(path){
		return `<script defer src="${path}"></script>`
	}
	function createStylesheet(path){
		return `<link rel="stylesheet" type="text/css" href="${path}">`
	}
}

function clearAssetsDir(){
	try {
		if (lstatSync(ASSETS_DIR)){
			// remove everything in ./assets
			console.log(`Removing everything in "${ASSETS_DIR}"...`)
			readdirSync(ASSETS_DIR)
				.forEach(filename => {
					const filepath = resolve(ASSETS_DIR, filename)
					if (lstatSync(filepath).isFile()){
						unlinkSync(filepath)
					}
				})
		}
	} catch (err){
		mkdirSync(ASSETS_DIR);
	}
}