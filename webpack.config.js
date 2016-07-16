var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'javascripts/bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        exclude: /node_modules/,
        loader : 'babel'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'src/client/app/modules',
      'node_modules',
    ]
  },
  watch: true
};

module.exports = config;
