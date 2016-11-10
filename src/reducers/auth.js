/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createReducer } from '../utils/index';
import { getCookie, setCookie } from '../utils/cookie';
import ActionTypes from '../constants/ActionTypes';

const AUTH_TOKEN = 'AuthToken';
const authToken = getCookie(AUTH_TOKEN) || null;

const initialState = {
  token: authToken,
  isAuthenticated: false,
  isAuthenticating: false,
  isCheckingToken: false,
  statusText: null,
};

export default createReducer(initialState, {
  /**
   * LogIn request
   * @param {Object} state
   */
  [ActionTypes.REQUEST_AUTHENTICATION]: (state) =>
    Object.assign({}, state, {
      isAuthenticated: false,
      isAuthenticating: true,
      statusText: null,
    }),

  /**
   * LogIn successfully
   * @param {Object} state
   * @param {Object} payload
   * @param {String} payload.token
   * @param {Object} meta
   * @param {Boolean} meta.isRemember
   */
  [ActionTypes.RECEIVE_AUTHENTICATION]: (state, payload, meta) => {
    setCookie(AUTH_TOKEN, payload.token, {
      maxAge: meta.isRemember ? 31536e3 : 0, // Set cookie expiration time to one year.
    });
    return Object.assign({}, state, {
      token: payload.token,
      isAuthenticating: false,
      isAuthenticated: true,
      statusText: 'You have been successfully logged in.',
    });
  },

  /**
   * LogIn failed
   * @param {Object} state
   * @param {Object} payload
   * @param {Object} payload.response
   * @param {String} payload.response.error
   * @param {String} payload.message
   */
  [ActionTypes.FAILURE_AUTHENTICATION]: (state, payload) => {
    setCookie(AUTH_TOKEN, '');
    return Object.assign({}, state, {
      token: null,
      isAuthenticating: false,
      isAuthenticated: false,
      statusText: payload.response.error || `Authentication Error: ${payload.message}`,
    });
  },

  /**
   * Check Token Request
   * @param {Object} state
   */
  [ActionTypes.REQUEST_CHECK_TOKEN]: (state) =>
    Object.assign({}, state, {
      isCheckingToken: true,
      isAuthenticating: true,
      isAuthenticated: false,
      token: null,
      statusText: null,
    }),

  /**
   * Check Token Success
   * @param {Object} state
   * @param {Object} payload
   * @param {String} payload.valid
   */
  [ActionTypes.RECEIVE_CHECK_TOKEN]: (state, payload) => {
    if (!payload.valid) setCookie(AUTH_TOKEN, '');
    return Object.assign({}, state, {
      isAuthenticated: payload.valid,
      isAuthenticating: false,
      isCheckingToken: false,
      token: payload.valid ? authToken : null,
      statusText: null,
    });
  },

  /**
   * Check Token Failure
   * @param {Object} state
   * @param {Object} payload
   * @param {Object} payload.response
   * @param {String} payload.message
   */
  [ActionTypes.FAILURE_CHECK_TOKEN]: (state, payload) => {
    setCookie(AUTH_TOKEN, '');
    return Object.assign({}, state, {
      token: null,
      isAuthenticating: false,
      isAuthenticated: false,
      isCheckingToken: false,
      statusText: payload.response.error || `Authentication Error: ${payload.message}`,
    });
  },

  /**
   * Log Out Request
   * @param {Object} state
   */
  [ActionTypes.REQUEST_LOG_OUT]: (state) => {
    setCookie(AUTH_TOKEN, '');
    window.location.replace('/');
    return Object.assign({}, initialState, state);
  },

  /**
   * Log Out Success
   * @param {Object} state
   */
  [ActionTypes.RECEIVE_LOG_OUT]: (state) => {
    setCookie(AUTH_TOKEN, '');
    return Object.assign({}, state, {
      statusText: 'You have been successfully logged out.',
    });
  },

  /**
   * Log Out Failure
   * @param {Object} state
   * @param {Object} payload
   * @param {Object} payload.response
   * @param {String} payload.message
   */
  [ActionTypes.FAILURE_LOG_OUT]: (state, payload) => {
    setCookie(AUTH_TOKEN, '');
    return Object.assign({}, initialState, state, {
      statusText: payload.response.error || `Authentication Error: ${payload.message}`,
    });
  },
});
