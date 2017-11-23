const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require("glob");
// 移动html
const HtmlWebpackPlugin = require('html-webpack-plugin');
let config = require('./webpack.base.config.js');


// 修改输出规则
// config.output.filename = 'js/[name].js';
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
        }
		
	]
};

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
    new ExtractTextPlugin('css/[name].css'),
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
];


/********* 每个JS文件单独打包 **********/ 
let jsFiles = glob.sync(path.resolve(__dirname, '../src/js/*.js')),
	entries = {};

jsFiles.forEach(function(filePath){
	let arr = filePath.split('/');
	let name = arr[arr.length-1].replace(/\.js$/, '');
	entries[name] = filePath;
});
config.entry = Object.assign({}, config.entry, entries);


/************ 输出多个html文件 ***********/ 
let ejsFiles = glob.sync(path.resolve(__dirname, '../src/template/*.ejs'));
ejsFiles.forEach(function(filePath){
	let arr = filePath.split('/');
	let name = arr[arr.length-1].replace(/\.ejs$/, '');
	config.plugins.push(
		new HtmlWebpackPlugin({
			template: 'src/template/'+ name +'.ejs',
			filename: name+'.html',
			// inject: false,
			// hash: true,
			//压缩HTML文件
	        minify:{
	        	//移除html中的注释
	            removeComments:true,
	            //删除空白符与换行符
	            collapseWhitespace:false,
	        },
	        chunks: ['vendor',name],
		})
	);
});






module.exports = config;