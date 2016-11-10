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
  description: '',
  visibility: false,
  type: null,
  message: '',
};

export default createReducer(initialState, {

  [ActionTypes.SHOW_NOTIFICATION]: (state, payload) =>
    Object.assign({}, state, {
      visibility: true,
      message: payload.message || '',
      description: payload.description || '',
    }),

  [ActionTypes.HIDE_NOTIFICATION]: (state) =>
    Object.assign({}, state, initialState),

});
