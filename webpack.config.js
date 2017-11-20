var path = require('path');
var webpack = require('webpack');

 module.exports = {
     entry: ['babel-polyfill', './index.js'],
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['env']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
	devtool: 'source-map'
 };
