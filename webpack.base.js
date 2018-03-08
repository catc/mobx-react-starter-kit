const { resolve } = require('path');
const { FILE_NAME } = require('./config');

const config = {
	context: resolve(__dirname),
	entry: {
		bundle: 'src/index.js',
	},
	output: {
		filename: '[name].js',
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
			{
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
			}
		]
	},

	plugins: [],

	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			src: resolve(__dirname, 'src'),
			components: 'src/components',
			api: 'src/api',
			styles: 'src/styles',
			routes: 'src/routes',
			utils: 'src/utils',
			// store: 'src/store',
		}
	},

	stats: {
		colors: true
	}
};

module.exports = config;