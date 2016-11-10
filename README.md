# sampleReportPortal
This is a Report Portal which runs on ActiveReports Server. It has been created using the REST API available with the server. It mimics the complete functionality of the Out-of-the-box Report Portal that comes with ActiveReports Server. 

## Sample Customized ActiveReports Portal

> [Sample Customized ActiveReports Portal] built on top of Facebook's
> [React](https://facebook.github.io/react/) library, and
> [Redux](http://redux.js.org/) architecture. Containing
> modern web development tools such as [Webpack](http://webpack.github.io/),
> [Babel](http://babeljs.io/) and [BrowserSync](http://www.browsersync.io/).


## Getting Started

### Requirements

  * Mac OS X, Windows, or Linux
  * [Node.js](https://nodejs.org/) v5.0 or newer
  * `npm` v3.3 or newer (new to [npm](https://docs.npmjs.com/)?)
  * `node-gyp` prerequisites mentioned [here](https://github.com/nodejs/node-gyp)
  * Text editor or IDE pre-configured with React/JSX/Flow/ESlint ([learn more](./how-to-configure-text-editors.md))

### ActiveReports Server prerequisites

This sample code works with ActiveReports Server's REST API.

For the sample to work properly, the ActiveReports Server web site needs to accept cross-domain requests. Add the following lines to the system.webServer section of the web.config file located in the <ActiveReports Server Installation folder>\site directory.

```
    <httpProtocol>
      <customHeaders>
        <add name="Access-Control-Allow-Origin" value="*" />
        <add name="Access-Control-Allow-Headers" value="Authorization, Origin, Content-Type, Accept, X-Requested-With, AuthToken" />
        <add name="Access-Control-Allow-Methods" value="GET, PATCH, POST, PUT, DELETE, OPTIONS" />
      </customHeaders>
    </httpProtocol>
```

If you are using Internet Explorer, the sample application requires IE 10 or higher.


### Directory Layout

```
.
├── /build/                     # The folder for compiled output
├── /node_modules/              # 3rd-party libraries and utilities
├── /src/                       # The source code of the application
│   ├── /actions/               # Action creators that allow to trigger a dispatch to stores
│   ├── /components/            # React components
│   ├── /constants/             # Constants (action types etc.)
│   ├── /middleware/            # Provides a third-party extension point between dispatching an action
│   ├── /public/                # Static files which are copied into the /build/public folder
│   ├── /reducers/              # Reducers contain the application state and logic
│   ├── /store/                 # Holds application state
│   ├── /utils/                 # Utility classes and functions
│   ├── /variables.scss         # Sass variables
│   ├── /client.js              # Client-side startup script
│   └── /config.js              # Global application settings
├── /tools/                     # Build automation scripts and utilities
│   ├── /lib/                   # Library for utility snippets
│   ├── /build.js               # Builds the project from source to output (build) folder
│   ├── /bundle.js              # Bundles the web resources into package(s) through Webpack
│   ├── /clean.js               # Cleans up the output (build) folder
│   ├── /webpack.config.js      # Configurations for client-side and server-side bundles
│   ├── /copy.js                # Copies static files to output (build) folder
│   ├── /deploy.js              # Deploys your web application
│   └── /server.js               # Launches the development web server with "live reload"
└── package.json                # The list of 3rd party libraries and utilities
```

### Get the latest version

You can start by cloning the latest version of SampleReportPortal (SRP) on your local machine.


### How to Install

```shell
$ npm install
```

This will install both run-time project dependencies and developer tools listed in package.json file.

### How to Configure

In the src folder, update config.js with your ActiveReports Server location

```shell
 export const arsHost = '<your ActiveReports Server>';
 export const arsPort = '<your ActiveReports Server Port>';
```

### How to Start

```shell
$ npm start
```

This command will build the app from the source files (/src) into the output /build folder.
As soon as the initial build completes, it will start a light-weight developer server (node build/server.js)
and Browsersync.

Now you can open your web app in a browser, on mobile devices and start hacking.
Whenever you modify any of the source files inside the /src folder, the module bundler (Webpack)
will recompile the app on the fly and refresh all the connected browsers.

Note that the npm start command launches the app in development mode, the compiled output files are not optimized
and minimized in this case.


### How to Build

If you need just to build the app (without running a dev server), simply run:

```shell
$ npm run build                 # or, `npm run build -- --release`
```

By default, it builds in *debug* mode. If you need to build in release
mode, just add a `-- --release` flag. This will optimize the output bundle for
production.


### Sample Developed by:

GrapeCity, Inc. Copyright © 2016
