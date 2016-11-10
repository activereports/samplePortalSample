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
  data: [],
  errorMessage: null,
  hasData: false,
  hasError: false,
  hasInvalidParameters: false,
  hasVisibleParameters: false,
  isRequesting: false,
  isProcessing: false,
};

function hasInvalidParams(parameters) {
  return !Object.keys(parameters).every(key =>
    parameters[key].parameterState.ok
  );
}

function hasVisibleParams(parameters) {
  return !Object.keys(parameters).every(key =>
    parameters[key].hidden
  );
}

function getErrorMessage(payload) {
  const response = payload.response && payload.response.error;
  return response || payload.message || '';
}

export default createReducer(initialState, {

  [ActionTypes.REQUEST_REPORT]: (state) =>
    Object.assign({}, state, initialState),

  [ActionTypes.REQUEST_REPORT_PARAMETERS]: (state, payload, meta) =>
    Object.assign({}, state, {
      isProcessing: true,
      isRequesting: !meta.validation,
    }),

  [ActionTypes.RECEIVE_REPORT_PARAMETERS]: (state, payload) => {
    const hasParameters = payload && payload.length;
    const parameters = hasParameters
      ? payload.map(param => Object.assign({}, param, {
        parameterState: {
          ok: param.state === 'HasValidValue',
          expectValue: param.state === 'MissingValidValue',
          hasOutstandingDependencies: param.state === 'HasOutstandingDependencies',
          dynamicValuesUnavailable: param.state === 'DynamicValuesUnavailable',
        },
      }))
      : [];
    return Object.assign({}, state, {
      data: parameters,
      hasData: !!hasParameters,
      hasInvalidParameters: hasParameters ? hasInvalidParams(parameters) : false,
      hasVisibleParameters: hasParameters ? hasVisibleParams(parameters) : false,
      isProcessing: false,
      isRequesting: false,
      errorMessage: initialState.errorMessage,
      hasError: initialState.hasError,
    });
  },

  [ActionTypes.FAILURE_REPORT_PARAMETERS]: (state, payload) =>
    Object.assign({}, state, initialState, {
      hasError: true,
      errorMessage: getErrorMessage(payload),
    }),

});
