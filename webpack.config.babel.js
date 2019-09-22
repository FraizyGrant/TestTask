'use strict';

import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import Clean from 'clean-webpack-plugin';

const common = {
  entry: {
    app: ['babel-polyfill', 'app'],
  },
  output: {
    path: path.resolve(__dirname + '/dist'),
    publicPath: '',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.min.js', '.custom.js', '.vue'],
    modules: [
      'app',
      'app/components',
      'app/general/svg',
      'app/general/sass',
      'app/general/sass/modules',
      'app/general/sass/settings',
      'app/general/fonts',
      'app/general/img',
      'node_modules'
    ],
    alias: {
      modernizr$: path.resolve(__dirname + '/.modernizrrc'),
      vue$: 'vue/dist/vue.min.js',
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules(?!(\/|\\)dom-utils)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-assign'],
        },
      },
      {
        test: /\.(svg|woff|woff2|eot|ttf|htc)$/i,
        exclude: /svg[\/\\]/,
        loader: 'url-loader',
        options: {
          limit: '10000',
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        include: /img[\/\\]/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /\.svg$/,
        include: /svg[\/\\]/,
        loader:
          'svg-sprite-loader?' +
          JSON.stringify({
            name: 'icon-' + '[name]',
            prefixize: true,
          })		
      },
      {
        test: /\.modernizrrc(\.json)?$/,
        loader: 'modernizr-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          scss: 'style!css!sass',
        },
      },
    ],
  },

  plugins: [
    new Clean(['dist']),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: false,
      disable: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

const sassLoaderPlugins = [
  { loader: 'css-loader', query: { sourceMap: true } },
  {
    loader: 'postcss-loader',
    query: {
      config: __dirname + 'postcss.config.js',
      sourceMap: true,
    },
  },
  { loader: 'sass-loader', query: { salse: true, sourceMap: true } },
];

const devConfig = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: sassLoaderPlugins,
        }),
      },
    ],
  },
  stats: {
    children: false,
  },
};

const productionConfig = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: sassLoaderPlugins,
        }),
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function(module) {
        let context = module.context;
        if (typeof context !== 'string') return false;
        return context.indexOf('node_modules') >= 0;
      },
    }),
  ],
};

module.exports = env => {
  let isDevelopment;

  if (typeof env !== 'undefined') {
    isDevelopment = env.target !== 'production';
  } 

  console.log(isDevelopment ? 'development' : 'production');

  if (isDevelopment) {

    return merge(common, devConfig);
  }
  return merge(common, productionConfig);
};
