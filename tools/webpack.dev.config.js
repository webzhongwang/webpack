const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = require('./webpack.base.config.js');

// config.devtool = '#source-map';
// config.output.publicPath = 'http:0.0.0.0:8009/dist/'

config.devServer = {
    // 访问的域名
    host: '0.0.0.0',
    // 禁止host检测
    disableHostCheck: true,
    // 端口
    port: 8009,
    //自动打开浏览器，不需要可以去掉
    // open: true, 
    //接口代理
    proxy: {
    
        '/i/*': {
            target: 'http://i.api.sdns.ksyun.com',
            changeOrigin: true,
            secure: false
        },
        '/m/*': {
            target: 'http://m.inner.sdns.ksyun.com',
            changeOrigin: true,
            secure: false
        },
    }
};
// 加载器
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
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                loader: 'css-loader'
            })
        },
        // zepto
        {
            test: require.resolve('zepto'),
            loader: 'exports-loader?window.Zepto!script-loader'
        },
        // 开发环境中的file-loader
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        publicPath: '/',
                        name: '[path][name].[ext]',
                    }  
                }
            ]
        }
        
    ]
};
// 插件
config.plugins = [
	
	// 生成样式 文件
    new ExtractTextPlugin( 'css/style.css'),

    // 生成index.html文件件
    // new HtmlWebpackPlugin(),
    // 通过ejs模板生成
    new HtmlWebpackPlugin({ // 构建html文件
        filename: './index.html',
        template: './src/template/index.ejs',
        inject: false,
        minify:{//压缩HTML文件
            removeComments:true,//移除html中的注释
            collapseWhitespace:false//删除空白符与换行符
        }
    })
];



module.exports = config;