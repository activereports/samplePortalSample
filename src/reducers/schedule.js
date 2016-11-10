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
  isProcessingTemplate: false,
  data: [],
  templates: [],
};

/**
 * ## Schedule Reducers
 */
export default createReducer(initialState, {

  /**
   * Request report schedules
   */
  [ActionTypes.REQUEST_REPORT_SCHEDULES]: (state) =>
    Object.assign({}, state, {
      isProcessing: true,
      data: initialState.data,
    }),

  /**
   * Receive an array of report schedules
   * @param {Object[]} payload
   * @param {string} [Id]
   * @param {string} [TemplateId]
   * @param {string} [CreatedBy]
   * @param {string} [CreationDate]
   * @param {string} [ModifiedBy]
   * @param {string} [ModifiedDate]
   * @param {string} [Distribution]
   * @param {boolean} [Enabled]
   * @param {string} [Name]
   * @param {string} [ReportId]
   * @param {array} [ReportParameters]
   * @param {string} [DocumentFormat]
   */
  [ActionTypes.RECEIVE_REPORT_SCHEDULES]: (state, payload) =>
    Object.assign({}, state, {
      isProcessing: false,
      data: payload,
    }),

  /**
   * Request a template from the collection
   */
  [ActionTypes.REQUEST_SCHEDULE_TEMPLATE]: (state) =>
    Object.assign({}, state, {
      isProcessingTemplate: true,
    }),

  /**
   * Receive a template from the collection
   * @param {Object} payload
   * @param {string} payload._id
   * @param {string} [payload.name]
   * @param {Object} [payload.distribution]
   * @param {string} [payload.documentFormat]
   * @param {string} [payload.templateId]
   */
  [ActionTypes.RECEIVE_SCHEDULE_TEMPLATE]: (state, payload, meta) =>
    Object.assign({}, state, {
      isProcessingTemplate: false,
      data: state.data.map(schedule =>
        schedule.id === meta
          ? Object.assign({}, schedule, {
            template: payload,
            templateId: payload._id,
          })
          : schedule
      ),
    }),

  /**
   * Request a list of all of the schedule templates
   */
  [ActionTypes.REQUEST_SCHEDULE_TEMPLATES]: (state) =>
    Object.assign({}, state, {
      templates: initialState.templates,
    }),

  /**
   * Request a list of all of the schedule templates
   * @param {Object[]} payload
   * @param {string} [_id]
   * @param [integer] [_version]
   * @param {string} [name]
   * @param {string} [description]
   * @param {string} [$metadata]
   * @param {string} [$effectivePermissions]
   */
  [ActionTypes.RECEIVE_SCHEDULE_TEMPLATES]: (state, payload) =>
    Object.assign({}, state, {
      templates: payload,
    }),
});
