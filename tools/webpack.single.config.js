const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
let config = require('./webpack.base.config.js');

config.module = {
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
			test: /\.css$/,
			// use: 'css-loader'
			use: ExtractTextPlugin.extract({
				// fallback: "style-loader",
				loader: 'css-loader',
				options:{
                    minimize: true //css压缩
                }
			})
		},
		// 生产环境中的file-loader
		{
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                    	// publicPath:'/',
                        // 输出图片的地址
                        outputPath: '/img/',
                        // 使用原图片名
                        name: '[name].[ext]',
                        // 保持原有的图片目录结构
                        useRelativePath: true,
                    }  
                }
            ]
        },

        
		
	]
}
config.plugins = [
	// 删除dist
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

	// 生成css
    new ExtractTextPlugin('css/style[hash].css'),
    // 生成公用库
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor' // 指定公共 bundle 的名字。
    }),
    // 压缩JS
    new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		}
	}),

	// 考贝文件
    new CopyWebpackPlugin([{
    	from: 'src/txt/*',
    	to: 'txt',
    	// 只考贝文件，忽略路径
    	flatten: true
    }]),

    // 生成html
    // new HtmlWebpackPlugin()
	new HtmlWebpackPlugin({
		template: 'src/template/index.ejs',
		filename: 'index.html',
		// 是否自动引入生成的静态资源（JS和CSS文件）
		inject: false,
		// hash: true,
		//压缩HTML文件
		minify:{
			//移除html中的注释
			removeComments:true,
			//删除空白符与换行符
			collapseWhitespace:false,
		},
		// 只引入app.js
		// chunks: ['app'],
	}),

]
module.exports = config;