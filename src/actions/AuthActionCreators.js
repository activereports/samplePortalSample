/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CALL_API } from 'redux-api-middleware';
import { endpoints } from '../config';
import ActionTypes from '../constants/ActionTypes';

/**
 * Log into the server with the specified credentials
 *
 * @method logIn
 * @param {String} user - User Name
 * @param {String} password - User Password
 * @param {Boolean} isRemember - Keeping user logged in
 */
export function logIn(user, password, isRemember) {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/accounts/login`,
      method: 'POST',
      body: { user, password },
      types: [
        ActionTypes.REQUEST_AUTHENTICATION,
        {
          type: ActionTypes.RECEIVE_AUTHENTICATION,
          meta: { isRemember },
        },
        ActionTypes.FAILURE_AUTHENTICATION,
      ],
    },
  };
}

/**
 * Check the authentication token (Login by AuthToken)
 *
 * @method checkToken
 */
export function loginByToken(token = null) {
  return (dispatch, getState) => {
    const authToken = token || getState().auth.token;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/accounts/check`,
        method: 'GET',
        headers: { AuthToken: authToken },
        types: [
          ActionTypes.REQUEST_CHECK_TOKEN,
          ActionTypes.RECEIVE_CHECK_TOKEN,
          ActionTypes.FAILURE_CHECK_TOKEN,
        ],
      },
    });
  };
}


/**
 * Log out from the server
 *
 * @method logOut
 */
export function logOut() {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/accounts/logout`,
        method: 'POST',
        body: { token },
        types: [
          ActionTypes.REQUEST_LOG_OUT,
          ActionTypes.RECEIVE_LOG_OUT,
          ActionTypes.FAILURE_LOG_OUT,
        ],
      },
    });
  };
}
