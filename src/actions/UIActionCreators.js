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
 * Request the site settings
 */
export function getSiteSettings() {
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/settings/site`,
        method: 'GET',
        types: [
          ActionTypes.REQUEST_SITE_SETTINGS,
          ActionTypes.RECEIVE_SITE_SETTINGS,
          ActionTypes.FAILURE_SITE_SETTINGS,
        ],
      },
    });
}

/**
 * Show the sidebar
 */
export function showSidebar() {
  return {
    type: ActionTypes.SHOW_SIDEBAR,
  };
}

/**
 * Hide the sidebar
 */
export function hideSidebar() {
  return {
    type: ActionTypes.HIDE_SIDEBAR,
  };
}

/**
 * Shows Schedules
 */
export function showSchedules() {
  return {
    type: ActionTypes.SHOW_SCHEDULES,
  };
}

/**
 * Hides Schedules
 */
export function hideSchedules() {
  return {
    type: ActionTypes.HIDE_SCHEDULES,
  };
}

/**
 * Shows the revision panel
 */
export function showRevisions() {
  return {
    type: ActionTypes.SHOW_REVISIONS,
  };
}

/**
 * Hides the revision panel
 */
export function hideRevisions() {
  return {
    type: ActionTypes.HIDE_REVISIONS,
  };
}

/**
 * Shows permissions
 */
export function showProperties() {
  return {
    type: ActionTypes.SHOW_PROPERTIES,
  };
}

/**
 * Hides permissions
 */
export function hidePermissions() {
  return {
    type: ActionTypes.HIDE_PERMISSIONS,
  };
}

/**
 * Shows the properties panel
 */
export function showPermissions() {
  return {
    type: ActionTypes.SHOW_PERMISSIONS,
  };
}

/**
 * Hides the properties panel
 */
export function hideProperties() {
  return {
    type: ActionTypes.HIDE_PROPERTIES,
  };
}

/**
 * Toggle the properties panel
 */
export function toggleProperties() {
  return {
    type: ActionTypes.TOGGLE_PROPERTIES,
  };
}

/**
 * Shows a report viewer
 */
export function showViewer() {
  return {
    type: ActionTypes.SHOW_VIEWER,
  };
}

/**
 * Hides a report viewer
 */
export function hideViewer() {
  return {
    type: ActionTypes.HIDE_VIEWER,
  };
}

/**
 * Shows a report viewer
 */
export function showReportDialog() {
  return {
    type: ActionTypes.SHOW_REPORT_DIALOG,
  };
}

/**
 * Hides a report viewer
 */
export function hideReportDialog() {
  return {
    type: ActionTypes.HIDE_REPORT_DIALOG,
  };
}

/**
 * Sets the current tool type
 * @param {string|null} toolType
 * @param {*} [context]
 */
export function setCurrentToolType(toolType, context = null) {
  return {
    type: ActionTypes.SET_CURRENT_TOOL_TYPE,
    payload: { toolType, context },
  };
}
