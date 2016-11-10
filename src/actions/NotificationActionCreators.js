/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ActionTypes from '../constants/ActionTypes';

/**
 * Shows a notification message
 * @param {Object} data
 */
export function showNotification(data) {
  return {
    type: ActionTypes.SHOW_NOTIFICATION,
    payload: {
      message: data.message,
      description: data.description,
    },
  };
}

/**
 * Hides a notification message
 */
export function hideNotification() {
  return {
    type: ActionTypes.HIDE_NOTIFICATION,
  };
}
