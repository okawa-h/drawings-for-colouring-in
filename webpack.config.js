const path = require('path');
module.exports = {
	entry: {
		script: './src/app.ts'
	},
	output: {
		path: path.join(__dirname,'public/files/js/'),
		filename: '[name].js'
	},
	resolve: {
		extensions:['.ts','.js']
	},
	devServer: {
		contentBase: path.join(__dirname,'public'),
		port: 3000
	},
	module: {
		rules: [
			{
				test:/\.ts$/,loader:'ts-loader'
			}
		]
	}
}