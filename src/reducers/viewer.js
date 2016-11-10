/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createReducer } from '../utils/index';
import { getSearchMatches } from '../utils/viewerAssets';
import ActionTypes from '../constants/ActionTypes';

const initialState = {
  documentId: null,
  errorMessage: null,
  exportId: null,
  exportUrl: null,
  hasError: false,
  hasRenderedDocument: false,
  isProcessing: false,
  markup: null,
  pageCount: 1,
  pageNumber: 1,
  parentId: null,
  reportId: null,
  requestId: null,
  searchElementId: null,
  searchMatches: [],
  sidebar: false,
  sidebarAction: null,
  toc: { name: '$root', kids: [] },
  tocUrl: null,
  toggleHistory: [],
};

function getErrorMessage(payload) {
  const response = payload.response && payload.response.error;
  return response || payload.message || '';
}

export default createReducer(initialState, {

  [ActionTypes.REQUEST_REPORT_RENDER]: (state, payload) =>
    Object.assign({}, state, {
      parentId: state.parentId === payload.reportId ? null : state.reportId,
      reportId: payload.reportId,
      requestId: null,
      isProcessing: true,
    }),

  [ActionTypes.RECEIVE_REPORT_RENDER]: (state, payload) => {
    const isRendering = !!payload.requestId;
    return Object.assign({}, state, initialState, {
      documentId: payload.documentId || state.documentId,
      hasRenderedDocument: !isRendering,
      isProcessing: isRendering,
      markup: isRendering ? null : payload.markup,
      pageCount: payload.pages || initialState.pageCount,
      parentId: state.parentId,
      reportId: state.reportId,
      requestId: payload.requestId || null,
      tocUrl: payload.tocUrl || initialState.tocUrl,
      toggleHistory: payload.toggleHistory || initialState.toggleHistory,
    });
  },

  [ActionTypes.FAILURE_REPORT_RENDER]: (state, payload) =>
    Object.assign({}, state, initialState, {
      hasError: true,
      errorMessage: getErrorMessage(payload),
    }),

  [ActionTypes.SET_PAGE_NUMBER]: (state, payload) =>
    Object.assign({}, state, {
      pageNumber: payload,
    }),

  [ActionTypes.REQUEST_REPORT_EXPORT]: (state) =>
    Object.assign({}, state, {
      exportId: null,
      exportUrl: null,
      isProcessing: true,
    }),

  [ActionTypes.RECEIVE_REPORT_EXPORT]: (state, payload) =>
    Object.assign({}, state, {
      exportUrl: payload.requestId ? null : payload,
      exportId: payload.requestId || null,
      isProcessing: false,
    }),

  [ActionTypes.FAILURE_REPORT_EXPORT]: (state, payload) =>
    Object.assign({}, state, initialState, {
      hasError: true,
      errorMessage: getErrorMessage(payload),
    }),

  [ActionTypes.RECEIVE_TOC]: (state, payload) =>
    Object.assign({}, state, {
      toc: payload,
    }),

  [ActionTypes.FAILURE_TOC]: (state, payload) =>
    Object.assign({}, state, initialState, {
      hasError: true,
      errorMessage: getErrorMessage(payload),
    }),

  [ActionTypes.SHOW_VIEWER_SIDEBAR]: (state, payload) =>
    Object.assign({}, state, {
      sidebar: true,
      sidebarAction: payload,
    }),

  [ActionTypes.HIDE_VIEWER_SIDEBAR]: (state) =>
    Object.assign({}, state, {
      sidebar: false,
      sidebarAction: null,
    }),

  [ActionTypes.GET_SEARCH_MATCHES]: (state, payload) => {
    const search = getSearchMatches(state.markup, payload);
    return Object.assign({}, state, {
      searchMatches: search.result,
      markup: search.document,
    });
  },

  [ActionTypes.SHOW_SEARCH_RESULTS]: (state, payload) =>
    Object.assign({}, state, {
      searchElementId: payload.idx,
      pageNumber: payload.page,
    }),

  [ActionTypes.HIDE_VIEWER]: (state) =>
    Object.assign({}, state, initialState),

});
