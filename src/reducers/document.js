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
import ToolActionTypes from '../constants/ToolTypes';
import getPermissions from '../utils/getPermissions';

const initialState = {
  data: {},
  id: null,
  isProcessing: false,
  isProcessingRevisions: false,
  isProcessingModels: false,
  operations: {
    canRead: false,
    canModify: false,
    canUpdate: false,
    canDelete: false,
    canChangePermission: false,
  },
  list: [],
  listSortFlag: ToolActionTypes.SORT_BY_DOCUMENT_NAME,
  listSortMethod: ToolActionTypes.SORT_ORDER_ASC,
  listFilterText: '',
  models: [],
  revisions: [],
};

/**
 * Method is used for sorting reports collection
 * @access private
 * @param {Object} [data]
 * @param {Object} [data.list] - List collections
 * @param {Object} [data.sortFlag] - Sort Flag
 * @param {Object} [data.sortMethod] - Sort Method
 * @return {Object}
 */
function sortReportsList(data) {
  const {
    SORT_BY_DOCUMENT_NAME,
    SORT_BY_MODIFIED_BY,
    SORT_BY_LAST_MODIFIED,
    SORT_ORDER_DESC,
    SORT_ORDER_ASC,
  } = ToolActionTypes;

  // Extend default data
  Object.assign({
    list: [],
    sortFlag: SORT_BY_DOCUMENT_NAME,
    sortMethod: SORT_ORDER_ASC,
  }, data);

  switch (data.sortFlag) {
    case SORT_BY_DOCUMENT_NAME: data.list.sort((a, b) => (a.name.localeCompare(b.name))); break;
    case SORT_BY_MODIFIED_BY: data.list.sort((a, b) => (a.$metadata.modifiedBy.localeCompare(b.$metadata.modifiedBy))); break;
    case SORT_BY_LAST_MODIFIED: data.list.sort((a, b) => (a.name > b.name) - (a.name < b.name)); break;
    default: data.list.sort((a, b) => (a.name.localeCompare(b.name))); break;
  }

  return {
    list: data.sortMethod === SORT_ORDER_DESC ? data.list.reverse() : data.list,
    listSortMethod: data.sortMethod,
    listSortFlag: data.sortFlag,
  };
}

/**
 * ## Tags Reducers
 */
export default createReducer(initialState, {

  /**
   * Request a document from the collection by ID
   * @param {Object} [state]
   * @param {Object} [payload]
   * @param {string} [payload.documentId]
   */
  [ActionTypes.REQUEST_REPORT]: (state, payload) => {
    const currentDocument = state.list.find(doc => doc._id === payload.documentId);
    return Object.assign({}, state, {
      data: currentDocument,
      id: payload.documentId,
      operations: getPermissions(currentDocument.$effectivePermissions),
      revisions: initialState.revisions,
    });
  },

  /**
   * Receive a document from the collection by ID
   * @param {Object} state
   * @param {Object} payload
   * @param {string} [payload.id]
   * @param {number} [payload.version]
   * @param {string} [payload.name]
   * @param {string} [payload.description]
   * @param {string} [payload.type]
   * @param {string} [payload.modelId]
   * @param {number} [payload.modelVersion]
   * @param {boolean} [payload.isParametrized]
   * @param {boolean} [payload.isSubreport]
   * @param {string} [payload.themeId]
   * @param {Array.<string>} [payload.tags]
   * @param {Array.<string>} [payload.subreportIds]
   * @param {string} [payload.assemblyResourceId]
   * @param {string} [payload.className]
   * @param {string} [payload.styleSheetId]
   * @param {Array.<string>} [payload.dataSetIds]
   * @param {boolean} [payload.IsMaster]
   * @param {string} [payload.MasterReportId]
   * @param {boolean} [payload.IsCpl]
   * @param {Object} [payload.$metadata]
   * @param {string} [payload.$metadata.createdBy]
   * @param {string} [payload.$metadata.created]
   * @param {string} [payload.$metadata.modified]
   * @param {string} [payload.$metadata.modifiedBy]
   * @param {string} [payload.$metadata.comment]
   * @param {string} [payload.$effectivePermissions]
   */
  [ActionTypes.RECEIVE_REPORT]: (state, payload, meta) =>
    Object.assign({}, state, {
      data: Object.assign({}, payload, { isFavorited: !!payload.tags.find(tag => tag === meta.favoritesId) }),
      operations: getPermissions(payload.$effectivePermissions),
    }),

  [ActionTypes.REQUEST_REPORTS]: (state) =>
    Object.assign({}, state, {
      isProcessing: true,
    }),

  [ActionTypes.RECEIVE_REPORTS]: (state, payload, meta) => {
    const { list, listSortFlag, listSortMethod } = sortReportsList({
      list: payload,
      sortFlag: state.listSortFlag,
      sortMethod: state.listSortMethod,
    });
    return Object.assign({}, state, {
      isProcessing: false,
      id: initialState.id,
      data: initialState.data,
      list: list.map(report => Object.assign(report, {
        isFavorited: !!report.tags.find(tag => tag === meta.favoritesId),
      })),
      listSortFlag,
      listSortMethod,
    });
  },

  [ActionTypes.SELECT_TAG_NODE]: (state) =>
    Object.assign({}, state, {
      isProcessing: true,
      data: initialState.data,
      id: initialState.id,
      operations: initialState.operations,
      list: initialState.list,
      versions: initialState.versions,
    }),

  [ActionTypes.SET_FILTER_TEXT]: (state, payload) =>
    Object.assign({}, state, {
      listFilterText: payload.filterText,
    }),

  [ActionTypes.SET_SORT_FLAG]: (state, payload) => {
    const { list, listSortFlag, listSortMethod } = sortReportsList({
      list: state.list.slice(),
      sortFlag: payload || initialState.listSortFlag,
      sortMethod: initialState.listSortMethod,
    });
    return Object.assign({}, state, {
      list,
      listSortFlag,
      listSortMethod,
    });
  },

  [ActionTypes.SET_SORT_METHOD]: (state, payload) => {
    const { list, listSortFlag, listSortMethod } = sortReportsList({
      list: state.list.slice(),
      sortFlag: initialState.listSortFlag,
      sortMethod: payload || initialState.listSortMethod,
    });
    return Object.assign({}, state, {
      list,
      listSortFlag,
      listSortMethod,
    });
  },

  [ActionTypes.REQUEST_REPORT_VERSIONS]: (state) =>
    Object.assign({}, state, {
      isProcessingRevisions: true,
    }),

  [ActionTypes.RECEIVE_REPORT_VERSIONS]: (state, payload) =>
    Object.assign({}, state, {
      isProcessingRevisions: false,
      revisions: payload,
    }),

  /**
   * Request a list of models
   * @param {Object} [state]
   */
  [ActionTypes.REQUEST_MODELS]: (state) =>
    Object.assign({}, state, {
      isProcessingModels: true,
      models: initialState.models,
    }),

  /**
   * Receive a list of models
   * @param {Object} [state]
   * @param {array} [payload]
   */
  [ActionTypes.RECEIVE_MODELS]: (state, payload) =>
    Object.assign({}, state, {
      isProcessingModels: false,
      models: payload || initialState.models,
    }),
});
