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
import { getReportParameters, validateReportParameters } from '../actions/ParametersActionCreators';
import ActionTypes from '../constants/ActionTypes';

/**
 * Get a template from the collection by ID
 * @param {string} templateId - Template ID
 * @param {string|null} [scheduleId] - Schedule ID
 */
export function getScheduleTemplate(templateId, scheduleId = null) {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/scheduletemplates/${templateId}`,
      method: 'GET',
      types: [
        ActionTypes.REQUEST_SCHEDULE_TEMPLATE,
        {
          type: ActionTypes.RECEIVE_SCHEDULE_TEMPLATE,
          meta: scheduleId,
        },
        ActionTypes.FAILURE_SCHEDULE_TEMPLATE,
      ],
    },
  };
}

/**
 * Get a list of all of the schedule templates
 */
export function getScheduleTemplates() {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/scheduletemplates`,
      method: 'GET',
      types: [
        ActionTypes.REQUEST_SCHEDULE_TEMPLATES,
        ActionTypes.RECEIVE_SCHEDULE_TEMPLATES,
        ActionTypes.FAILURE_SCHEDULE_TEMPLATES,
      ],
    },
  };
}


/**
 * Update the schedule
 * @param {Object} schedule - Schedule data
 */
export function updateSchedule(schedule) {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/schedules/${schedule.id}`,
      method: 'PUT',
      body: schedule,
      types: [
        ActionTypes.REQUEST_UPDATE_SCHEDULE,
        ActionTypes.RECEIVE_UPDATE_SCHEDULE,
        ActionTypes.FAILURE_UPDATE_SCHEDULE,
      ],
    },
  };
}

/**
 * Update schedules
 * @param {Object} schedules - Schedules collection
 */
export function updateSchedules(schedules) {
  const promises = [];
  return dispatch => {
    Object.keys(schedules).forEach(key =>
      promises.push(dispatch(updateSchedule(schedules[key])))
    );
    return Promise.all(promises);
  };
}

/**
 * Get an array of report schedules
 * param {string} reportId - Report ID
 */
export function getSchedules(reportId) {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/reports/${reportId}/schedules`,
      method: 'GET',
      types: [
        ActionTypes.REQUEST_REPORT_SCHEDULES,
        ActionTypes.RECEIVE_REPORT_SCHEDULES,
        ActionTypes.FAILURE_REPORT_SCHEDULES,
      ],
    },
  };
}

/**
 * Assemble the schedule data
 * @param {Object} schedule - Schedule Data
 */
export function assembleSchedule(schedule) {
  return (dispatch, getState) => {
    const id = getState().document.id;
    return dispatch(getScheduleTemplate(schedule.templateId, schedule.id)).then(() => {
      console.info();
      if (getState().document.data.isParametrized) {
        dispatch(getReportParameters(id)).then(() => {
          const documentParams = getState().parameters.data;
          const scheduleData = getState().schedule.data;
          const scheduleParams = schedule.reportParameters || [];
          const params = Object.assign([], documentParams, scheduleParams);
          return dispatch({
            type: ActionTypes.RECEIVE_REPORT_SCHEDULES,
            payload: scheduleData.map(s =>
              s.id === schedule.id
                ? Object.assign({}, s)
                : s
            ),
          }).then(() => dispatch(validateReportParameters(id, params))
          );
        });
      }
      return Promise.resolve();
    });
  };
}

/**
 * Assemble schedules data
 */
export function assembleSchedules() {
  return (dispatch, getState) => {
    const id = getState().document.id;
    return dispatch(getSchedules(id)).then(() => {
      const schedules = getState().schedule.data;
      if (schedules.length) {
        dispatch(assembleSchedule(schedules[0]));
      }
      // Returns a list of all of the schedule templates.
      return dispatch(getScheduleTemplates());
    });
  };
}

/**
 * Creates the report schedule
 * param {string} reportId - Report ID
 * param {string} templateId - Template ID
 */
export function createScheduleTask(reportId, templateId) {
  const query = setQueryParams({ templateId });
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${reportId}/schedules${query}`,
        method: 'POST',
        body: { scheduleNamePrefix: 'Schedule' },
        types: [
          ActionTypes.REQUEST_REPORT_SCHEDULES,
          ActionTypes.RECEIVE_REPORT_SCHEDULES,
          ActionTypes.FAILURE_REPORT_SCHEDULES,
        ],
      },
    }).then(() => dispatch(assembleSchedules()));
}

/**
 * Update the schedule
 * @param {Object} [params] - Schedule parameters
 */
export function submitSchedules(params = {}) {
  return dispatch =>
    dispatch(updateSchedules(params));
}


/**
 * Deletes the schedule
 * param {string} scheduleId - Schedule ID
 */
export function deleteScheduleTask(scheduleId) {
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/schedules/${scheduleId}`,
        method: 'DELETE',
        types: [
          ActionTypes.REQUEST_DELETE_SCHEDULE,
          ActionTypes.RECEIVE_DELETE_SCHEDULE,
          ActionTypes.FAILURE_DELETE_SCHEDULE,
        ],
      },
    }).then(() => dispatch(assembleSchedules()));
}
