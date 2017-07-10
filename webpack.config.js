/**************************************
*
*	Webpack dev configuration file
*
**************************************/

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	entry: ['./public/app.js', './public/app.scss'],
	output: {	
		path: __dirname + '/public/dist',
		publicPath: '/',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /.scss$/,
				exclude: /node_modules/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'sass-loader']
				}),
			},
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css')
	]
};﻿