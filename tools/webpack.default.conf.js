const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
	entry: {
		// app: ['./src/js/a.js'],
		vendor: ['jquery']
	},
	output: {
		filename: 'js/[name][chunkhash].js',
		path: path.resolve(__dirname, '../','dist')
	},
	module: {
		rules:[
			{
	            test: /\.js$/,
	            exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
					
				}
	        },
			{
				test: /\.css/,
				// use: 'css-loader'
				use: ExtractTextPlugin.extract({
					loader: 'css-loader'
				})
			}
			
		]
	},
	plugins: [
		new CleanWebpackPlugin(
            ['dist'],
            {
                root: path.resolve(__dirname, '../'), 
                //开启在控制台输出信息      
                verbose: true, 
                //启用删除文件 
                dry: false        　　　　　　　　　　
            }
        ),
        new ExtractTextPlugin('css/[name][chunkhash].css'),
        // 生成公用库
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor' // 指定公共 bundle 的名字。
        }),
        new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new HtmlWebpackPlugin({
			// 文档title
			title: '测试title',
			// 输入文件名，默认是index.html
			filename: 'index.html',
			// 对生成的script标签添加hash  eg: src="js/vendor.js?65ccc27d6309b91c7db7"
			// hash: true,
			// 压缩规则	所有属性：https://github.com/kangax/html-minifier#options-quick-reference
			minify: {
				//移除html中的注释
				removeComments:true,
				//删除空白符与换行符
				collapseWhitespace:false
			},
			// 页面引入a.js,b.js
			chunks: ['a','b'],
			// 不引入vendor.js
			// excludeChunks: ['vendor.js']
		}),
	]
};
module.exports = config;