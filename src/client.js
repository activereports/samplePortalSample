import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import configureStore from './store/configureStore';
import { basename } from './config';
import { loginByToken } from './actions/AuthActionCreators';
import App from './views/App';
import Auth from './views/Auth';
import Designer from './views/Designer';
import Portal from './views/Portal';
import Viewer from './views/Viewer';

const store = configureStore({}); // Configure the app store
const browserHistory = useRouterHistory(createHistory)({ basename }); // Add a base URL

function validateToken() {
  const authToken = store.getState().auth.token;
  return new Promise((resolve, reject) => {
    if (!!authToken) {
      store.dispatch(loginByToken(authToken)).then(() => {
        if (store.getState().auth.isAuthenticated) {
          resolve();
        } else {
          reject();
        }
      });
    } else {
      reject();
    }
  });
}

/**
 * This way activities that require authorization
 * MUST be shown to user only when user is logged in
 */
function requireAuth(nextState, replace, next) {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  if (!isAuthenticated) {
    validateToken()
      .then(
        () => next(),
        () => {
          replace({
            pathname: '/login',
            state: {
              nextPathname: nextState.location.pathname,
              query: nextState.location.query,
            },
          });
          next();
        }
      );
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="login" component={Auth} />
        <Route path="designer" component={Designer} onEnter={requireAuth} />
        <Route path="viewer" component={Viewer} onEnter={requireAuth} />
        <IndexRoute component={Portal} onEnter={requireAuth} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
