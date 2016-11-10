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
 * Request information about the report parameters
 * @param {string} reportId - The report ID.
 */
export function getReportParameters(reportId) {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/reports/${reportId}/parameters`,
      method: 'GET',
      types: [
        {
          type: ActionTypes.REQUEST_REPORT_PARAMETERS,
          meta: { validation: false },
        },
        ActionTypes.RECEIVE_REPORT_PARAMETERS,
        ActionTypes.FAILURE_REPORT_PARAMETERS,
      ],
    },
  };
}

/**
 * Validates parameter values
 * @param {string} reportId - The report ID.
 * @param {Object} parameters
 */
export function validateReportParameters(reportId, parameters) {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/reports/${reportId}/parameters/validateValues`,
      body: parameters,
      method: 'POST',
      types: [
        {
          type: ActionTypes.REQUEST_REPORT_PARAMETERS,
          meta: { validation: true },
        },
        ActionTypes.RECEIVE_REPORT_PARAMETERS,
        ActionTypes.FAILURE_REPORT_PARAMETERS,
      ],
    },
  };
}
