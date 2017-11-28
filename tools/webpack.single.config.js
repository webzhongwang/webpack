const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
let config = require('./webpack.base.config.js');

// let cssExtractTextPlugin = new ExtractTextPlugin('css/style.css');
// let lessExtractTextPlugin = new ExtractTextPlugin('css/le.css');

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

        // // 只有CSS时 ，可以直接使用minimize属性压缩css
        // {
        //     test: /\.(css|less)$/,
        //     use: lessExtractTextPlugin.extract({
        //         loader: 'css-loader!less-loader',
        //         options:{
        //             minimize: true //css压缩
        //         }
        //     })
        // },

        // 当有预编译时，不能直接压缩，需要用到插件 optimize-css-assets-webpack-plugin
        {
            test: /\.(css|less)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                // loader: 'css-loader!less-loader',
                use: ['css-loader', 'less-loader'],
                
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

    // css
    new ExtractTextPlugin('css/style.css'),

    // 当有预编译(less/sass等)时，不能直接压缩，需要用到插件 optimize-css-assets-webpack-plugin
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: { 
            discardComments: {
                removeAll: true 
            } 
        },
        canPrint: true
    }),

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