## Build Automation Tools

##### `npm start` (`start.js`)

* Cleans up the output `/build` directory (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Launches [Webpack](https://webpack.github.io/) compiler
* Launches [Browsersync](https://browsersync.io/),
  [HMR](https://webpack.github.io/docs/hot-module-replacement), and
  [React Transform](https://github.com/gaearon/babel-plugin-react-transform)

##### `npm run build` (`build.js`)

* Cleans up the output `/build` folder (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Creates application bundles with Webpack (`bundle.js`, `webpack.config.js`)

##### Options

Flag        | Description
----------- | -------------------------------------------------- 
`--release` | Minimizes and optimizes the compiled output
`--verbose` | Prints detailed information to the console

For example:

```sh
$ npm run build -- --release --verbose   # Build the app in production mode
```

or

```sh
$ npm start -- --release                 # Launch dev server in production mode
```

#### Misc

* `webpack.config.js` - Webpack configuration for client-side bundle
* `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
* `.eslintrc` - ESLint overrides for built automation scripts
