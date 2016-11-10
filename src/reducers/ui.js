/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createReducer, getCurrentLocale } from '../utils/index';
import Action from '../constants/ActionTypes';

const initialState = {
  currentToolContext: null,
  currentToolType: null,
  hideEmptyCategories: false,
  isBusy: false,
  locale: getCurrentLocale(),
  permissionsVisibility: false,
  propertiesVisibility: true,
  reportDialogVisibility: false,
  revisionsVisibility: false,
  schedulesVisibility: false,
  sidebarVisibility: true,
  viewerVisibility: false,
};

export default createReducer(initialState, {

  /**
   * Request the site settings
   * @param {Object} state
   */
  [Action.RECEIVE_SITE_SETTINGS]: (state) => Object.assign({}, state, { sidebarVisibility: true }),

  /**
   * Receive the site settings
   * @param {Object} state
   * @param {Object} [payload]
   * @param {string} [payload.notificationLinkUrl]
   * @param {boolean} [payload.disableEveryoneRole]
   * @param {string} [payload.previewMode]
   * @param {boolean} [payload.hideEmptyCategories]
   * @param {Array} [payload.hiddenAdminPages]
   * @param {string} [payload.dataSources]
   */
  [Action.REQUEST_SITE_SETTINGS]: (state) => Object.assign({}, state, { isBusy: true }),
  [Action.RECEIVE_SITE_SETTINGS]: (state, payload) => Object.assign({}, state, {
    isBusy: false,
    hideEmptyCategories: payload.hideEmptyCategories,
  }),
  [Action.FAILURE_SITE_SETTINGS]: (state) => Object.assign({}, state, { isBusy: false }),

  [Action.SHOW_SIDEBAR]: (state) => Object.assign({}, state, { sidebarVisibility: true }),
  [Action.HIDE_SIDEBAR]: (state) => Object.assign({}, state, { sidebarVisibility: false }),

  [Action.SHOW_REPORT_DIALOG]: (state) => Object.assign({}, state, { reportDialogVisibility: true }),
  [Action.HIDE_REPORT_DIALOG]: (state) => Object.assign({}, state, { reportDialogVisibility: false }),

  [Action.SHOW_SCHEDULES]: (state) => Object.assign({}, state, { schedulesVisibility: true }),
  [Action.HIDE_SCHEDULES]: (state) => Object.assign({}, state, { schedulesVisibility: false }),

  [Action.SHOW_PROPERTIES]: (state) => Object.assign({}, state, { propertiesVisibility: true }),
  [Action.HIDE_PROPERTIES]: (state) => Object.assign({}, state, { propertiesVisibility: false }),
  [Action.TOGGLE_PROPERTIES]: (state) => Object.assign({}, state, { propertiesVisibility: !state.propertiesVisibility }),

  [Action.SHOW_PERMISSIONS]: (state) => Object.assign({}, state, { permissionsVisibility: true }),
  [Action.HIDE_PERMISSIONS]: (state) => Object.assign({}, state, { permissionsVisibility: false }),

  [Action.SHOW_REVISIONS]: (state) => Object.assign({}, state, { revisionsVisibility: true }),
  [Action.HIDE_REVISIONS]: (state) => Object.assign({}, state, { revisionsVisibility: false }),

  [Action.SHOW_VIEWER]: (state) => Object.assign({}, state, { viewerVisibility: true }),
  [Action.HIDE_VIEWER]: (state) => Object.assign({}, state, { viewerVisibility: false }),


  [Action.REQUEST_USER_INFO]: (state) => Object.assign({}, state, { isBusy: true }),
  [Action.RECEIVE_USER_INFO]: (state) => Object.assign({}, state, { isBusy: false }),
  [Action.FAILURE_USER_INFO]: (state) => Object.assign({}, state, { isBusy: false }),

  [Action.REQUEST_REPORT_PARAMETERS]: (state) => Object.assign({}, state, { isBusy: true }),
  [Action.RECEIVE_REPORT_PARAMETERS]: (state) => Object.assign({}, state, { isBusy: false }),
  [Action.FAILURE_REPORT_PARAMETERS]: (state) => Object.assign({}, state, { isBusy: false }),

  [Action.REQUEST_REPORT_RENDER]: (state) => Object.assign({}, state, { isBusy: true }),
  [Action.RECEIVE_REPORT_RENDER]: (state) => Object.assign({}, state, { isBusy: false }),
  [Action.FAILURE_REPORT_RENDER]: (state) => Object.assign({}, state, { isBusy: false }),

  [Action.REQUEST_REPORT_EXPORT]: (state) => Object.assign({}, state, { isBusy: true }),
  [Action.RECEIVE_REPORT_EXPORT]: (state) => Object.assign({}, state, { isBusy: false }),
  [Action.FAILURE_REPORT_EXPORT]: (state) => Object.assign({}, state, { isBusy: false }),

  /**
   * Sets the current tool type
   * @param {Object} state
   * @param {Object} [payload]
   * @param {string|null} [payload.toolType]
   * @param {*} [payload.context]
   */
  [Action.SET_CURRENT_TOOL_TYPE]: (state, payload) =>
    Object.assign({}, state, {
      currentToolType: payload.toolType,
      currentToolContext: payload.context,
    }),
});
