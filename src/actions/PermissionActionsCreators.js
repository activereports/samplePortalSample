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
import { setQueryParams } from '../utils/index';
import ActionTypes from '../constants/ActionTypes';

/**
 * Gets access control list
 */
export function getPermissions() {
  return (dispatch, getState) => {
    const params = setQueryParams({ selector: 'myroles' });
    const documentId = getState().document.id;
    const userRoles = getState().user.roles;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${documentId}/permissions${params}`,
        method: 'GET',
        types: [
          ActionTypes.REQUEST_REPORT_PERMISSIONS,
          {
            type: ActionTypes.RECEIVE_REPORT_PERMISSIONS,
            meta: userRoles,
          },
          ActionTypes.FAILURE_REPORT_PERMISSIONS,
        ],
      },
    });
  };
}

/**
 * Update the access control list
 * @param {Object[]} items - ACL items
 */
export function updatePermissions(items) {
  return (dispatch, getState) => {
    const documentId = getState().document.id;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${documentId}/permissions`,
        method: 'PATCH',
        body: items,
        types: [
          ActionTypes.REQUEST_UPDATE_REPORT_PERMISSIONS,
          ActionTypes.RECEIVE_UPDATE_REPORT_PERMISSIONS,
          ActionTypes.FAILURE_UPDATE_REPORT_PERMISSIONS,
        ],
      },
    }).then(() => dispatch(getPermissions()));
  };
}
