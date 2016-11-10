/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createReducer } from '../utils/index';
import ActionTypes from '../constants/ActionTypes';

const initialState = {
  isProcessing: false,
  data: [],
  access: {
    canRead: false,
    canModify: false,
    canUpdate: false,
    canDelete: false,
    canChange: false,
  },
};

/**
 * Checks access
 * @param {Object[]} permissions - Permissions data
 * @param {Object[]} roles - Group Ids data
 */
function checkAccess(permissions, roles) {
  Object.assign([{ role: '', operations: '' }], permissions);
  Object.assign([{ id: '', name: '' }], roles);

  let documentPermissions = {
    none: false,
    create: false,
    read: false,
    update: false,
    delete: false,
    changePermission: false,
    modify: false,
    all: false,
  };

  permissions.map(permission =>
    roles.map(role => {
      if (role.name === permission.role && permission.operations) {
        const operations = permission.operations;
        documentPermissions = {
          none: operations.includes('None') || documentPermissions.none,
          create: operations.includes('Create') || documentPermissions.create,
          read: operations.includes('Read') || documentPermissions.read,
          update: operations.includes('Update') || documentPermissions.update,
          delete: operations.includes('Delete') || documentPermissions.delete,
          changePermission: operations.includes('ChangePermission') || documentPermissions.changePermission,
          modify: operations.includes('Modify') || documentPermissions.modify,
          all: operations.includes('All') || documentPermissions.all,
        };
      }
      return null;
    })
  );

  return documentPermissions;
}

/**
 * ## Permission Reducers
 */
export default createReducer(initialState, {

  /**
   * Request access control list (ACL)
   */
  [ActionTypes.REQUEST_REPORT_PERMISSIONS]: (state) =>
    Object.assign({}, state, {
      isProcessing: true,
    }),

  /**
   * Receive access control list (ACL)
   */
  [ActionTypes.RECEIVE_REPORT_PERMISSIONS]: (state, payload, meta) => {
    const userRoles = meta || [];
    const documentPermissions = payload.permissions || [];
    const permissions = checkAccess(documentPermissions, userRoles);

    return Object.assign({}, state, {
      isProcessing: false,
      data: documentPermissions,
      access: {
        canRead: permissions.read || permissions.all,
        canModify: permissions.modify || permissions.all,
        canUpdate: permissions.update || permissions.modify || permissions.all,
        canDelete: permissions.delete || permissions.modify || permissions.all,
        canChange: permissions.changePermission || permissions.all,
      },
    });
  },
});
