const { resolve } = require('path');

// TODO - constants to config/
const FILE_NAME = 'bundle.js';
const BUILD_PATH = resolve(__dirname, '../assets');

const config = {
	context: resolve(__dirname),
	
	// entry: 'src/index.js',
	entry: {
		bundle: 'src/index.js',
	},
	output: {
		// filename: FILE_NAME,
		filename: '[name].js',
		// path: BUILD_PATH,
	},

	module: {
		rules: [
			{
				test: /\.js(x?)$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						// options specified in `.babelrc`
						options: {}
					}
				]
			},
			/*{
				test: /\.(s?)css$/,
				use: [
					{
						loader: 'css-loader',
						options: {
							alias: {}
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								// apparently don't need to do separate install
								// since postcss loader installs it
								require('autoprefixer')(),
							]
						}
					},
					{
						loader: 'sass-loader',
						options: {
							// includePaths: ['node_modules/foundation-sites/scss']
						}
					},
				]
			}*/
		]
	},

	plugins: [],

	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			src: resolve(__dirname, 'src'),
			components: 'src/components',
			/*routes: 'src/routes',
			api: 'src/api',
			store: 'src/store',
			styles: 'src/scss',
			utils: 'src/utils',*/
		}
	},

	stats: {
		colors: true
	}
};

module.exports = config;