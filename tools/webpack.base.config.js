const path = require('path');

let config = {
	entry: {
		app: ['./src/main.js'],
		vendor: ['jquery']
	},
	output: {
		filename: 'js/[name][chunkhash].js',
		path: path.resolve(__dirname, '../dist')
	}
};
module.exports = config;