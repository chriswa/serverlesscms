var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/',
		filename: 'bundle-[hash].js'
	},
	externals: {
		'lodash':     '_',
		'dust':       'dust',
		'firebase':   'firebase',
		'vue':        'Vue',
		'vuex':       'Vuex',
		'vue-router': 'VueRouter',
		'vuetify':    'Vuetify',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
					}
					// other vue-loader options go here
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules\/lodash/ // html-webpack-plugin seems to be trying to minify lodash because it's in a script tag?!
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]'
				}
			}
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.ejs',
		}),
	],
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		disableHostCheck: true                  // allow http://raspberrypi:8080/
	},
	performance: {
		hints: false
	},
	devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new UglifyJSPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
