import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

const config = {
  cache: DEBUG,
  debug: DEBUG,

  context: path.resolve(__dirname, '../src'),

  entry: {
    app: DEBUG
      ? ['webpack-hot-middleware/client', './client.js']
      : ['./client.js'],
  },

  output: {
    publicPath: './',
    path: path.join(__dirname, '../build'),
    filename: DEBUG ? '[name].js?[hash]' : '[name].[chunkhash].js',
    chunkFilename: DEBUG ? '[name].[id].js?[hash]' : '[name].[id].[chunkhash].js',
  },

  // Choose a developer tool to enhance debugging
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: ['babel-loader'],
        include: path.resolve(__dirname, '../src/'),
        query: {
          cacheDirectory: DEBUG,
          babelrc: false,
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-runtime',
            ...(DEBUG ? [
              ['react-transform', {
                transforms: [
                  {
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module'],
                  }, {
                    transform: 'react-transform-catch-errors',
                    imports: ['react', 'redbox-react'],
                  },
                ],
              }]] : []
            ),
          ],
        },
      }, {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          `css-loader?${JSON.stringify({
            sourceMap: DEBUG,
            modules: true,
            localIdentName: DEBUG ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
            minimize: !DEBUG,
          })}`,
          'postcss-loader?parser=postcss-scss',
        ],
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.(eot|ttf|svg|woff|woff2|wav|mp3)$/,
        loader: 'file-loader',
      },
    ],
  },

  resolve: {
    root: path.resolve(__dirname, '../src'),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.json'],
  },

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [

    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({ ...GLOBALS, 'process.env.BROWSER': true }),

    new HtmlWebpackPlugin({
      baseHref: '/',
      template: ('./public/index.html'),
      inject: 'body',
      minify: !DEBUG && { collapseWhitespace: true, minifyCSS: true },
      googleAnalytics: {
        trackingId: 'UA-XXXX-XX',
        pageViewOnLoad: true,
      },
    }),

    ...(DEBUG ? [
      new webpack.HotModuleReplacementPlugin(),
    ] : [
      // Assign the module and chunk ids by occurrence count
      // Consistent ordering of modules required if using any hashing ([hash] or [chunkhash])
      // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
          warnings: VERBOSE,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ]),
  ],

  postcss: function plugins(bundler) {
    return [
      require('postcss-import')({ addDependencyTo: bundler }),
      require('precss')(),
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
    ];
  },
};

export default config;
