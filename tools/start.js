import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import historyApiFallback from 'connect-history-api-fallback';
import webpackConfig from './webpack.config.js';
import run from './run';

const host = 'localhost';
const port = '3000';
const compiler = webpack(webpackConfig);


async function server() {
  await run(require('./build'));

  // historyApiFallback: Middleware to proxy requests through a specified index page,
  // useful for Single Page Applications that utilise the HTML5 History API.

  browserSync({
    host,
    port,
    notify: false,
    ui: false,
    server: {
      baseDir: 'build',
      middleware: [
        webpackDevMiddleware(compiler, {
          hot: true,
          publicPath: `http://${host}:${port}/`,
          stats: { colors: true },
        }),
        webpackHotMiddleware(compiler),
        historyApiFallback(),
      ],
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      'build/*.css',
      '!build/index.html',
    ],
  });
}

export default server;
