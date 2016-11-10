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
import { camelizeKeys } from 'humps';
import { getReportParameters, validateReportParameters } from '../actions/ParametersActionCreators';
import { createMarkup, getDocumentId, getPageCount, getTocUrl, isAbsoluteUri, downloadDocument, printDocument } from '../utils/viewerAssets';
import ActionTypes from '../constants/ActionTypes';

/**
 * Obtains the report TOC
 * @param {string} url - TOC url.
 */
export function getToc(url) {
  return {
    [CALL_API]: {
      endpoint: isAbsoluteUri(url) ? url : `${endpoints.arsResourceHandler}/${url}`,
      method: 'GET',
      types: [
        ActionTypes.REQUEST_TOC,
        ActionTypes.RECEIVE_TOC,
        ActionTypes.FAILURE_TOC,
      ],
    },
  };
}

/**
 * Performs search with given options
 * @param {object} searchOptions
 * @param {string} searchOptions.text
 * @param {boolean} [searchOptions.matchCase]
 * @param {boolean} [searchOptions.wholePhrase]
 * @param {number} [searchOptions.maxSearchResults]
 */
export function getSearchMatches(searchOptions) {
  return {
    type: ActionTypes.GET_SEARCH_MATCHES,
    payload: searchOptions,
  };
}

/**
 * Show search matches (indicate the pages where your search terms were found)
 * @param {Object} searchMatch
 * @param {string} searchMatch.idx - Index
 * @param {number} searchMatch.page - Page number
 */
export function showSearchResult(searchMatch) {
  return {
    type: ActionTypes.SHOW_SEARCH_RESULTS,
    payload: searchMatch,
  };
}

/**
 * Dismiss Actions Panel
 */
export function dismissSidebar() {
  return {
    type: ActionTypes.HIDE_VIEWER_SIDEBAR,
  };
}

/**
 * Change active tab
 * @param {string} panel - Panel ID
 */
export function changeSidebarAction(panel) {
  return (dispatch, getState) => {
    const actionType = getState().viewer.sidebarAction === panel
      ? ActionTypes.HIDE_VIEWER_SIDEBAR
      : ActionTypes.SHOW_VIEWER_SIDEBAR;
    return dispatch({
      type: actionType,
      payload: panel,
    });
  };
}

/**
 * Changes current page
 * @param {number} pageNumber
 */
export function changePageNumber(pageNumber) {
  return {
    type: ActionTypes.SET_PAGE_NUMBER,
    payload: pageNumber,
  };
}

/**
 * Starts exporting the report
 * @param {Object} [parameters={}]
 * s@param {string} [parameters.extensionName]
 * @param {Object} [parameters.extensionSettings]
 * @param {boolean} [parameters.extensionSettings.saveAsDialog]
 * @param {boolean} [parameters.extensionSettings.printOnOpen]
 * @param {string|null} [reportId=null]
 * @param {number|null} [requestId=null]
 * @param {boolean} [useBlank=null]
 */
export function exportDocument(parameters = {}, reportId = null, requestId = null, useBlank = true) {
  return (dispatch, getState) => {
    const id = reportId || getState().viewer.reportId;
    let endpoint = `reports/${id}/exportRequests`;
    let method = 'POST';
    let body = parameters;

    if (requestId) {
      // The report exporting is in progress
      // Forming another request
      endpoint = `reports/exportRequests/${requestId}`;
      method = 'GET';
      body = null;
    }

    if (!parameters.documentId) {
      Object.assign(parameters, { documentId: getState().viewer.documentId });
    }

    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/${endpoint}`,
        method,
        body,
        types: [
          ActionTypes.REQUEST_REPORT_EXPORT,
          {
            type: ActionTypes.RECEIVE_REPORT_EXPORT,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('application/json')) {
                // The report exporting is in progress.
                // Handle the RequestId
                return res.json().then((json) => camelizeKeys(json));
              }
              // The report exported successfully.
              // Handle a link to the exported document
              return res.text();
            },
          },
          ActionTypes.FAILURE_REPORT_EXPORT,
        ],
      },
    }).then(() => {
      const exportId = getState().viewer.exportId;
      const exportUrl = getState().viewer.exportUrl;
      if (exportId) {
        // The report exporting is in progress so we need check it again
        return dispatch(exportDocument(parameters, id, exportId, useBlank));
      }

      // The report exported successfully
      // Handle the exported document
      if (exportUrl) {
        if (parameters.extensionSettings && parameters.extensionSettings.saveAsDialog) {
          // Handle file export
          downloadDocument(exportUrl, useBlank);
        }
        if (parameters.extensionSettings && parameters.extensionSettings.printOnOpen) {
          // Handle file print
          const documentName = parameters.extensionSettings.documentName || '';
          printDocument(exportUrl, documentName, useBlank);
        }
      }

      // We don’t have to return Promises, but it’s a handy convention
      // so the caller can always call .then() on async dispatch result
      return Promise.resolve();
    });
  };
}

/**
 * Starts rendering the report
 * @param {string} reportId
 * @param {Object} [parameters={}]
 * @param {string} [parameters.extensionName]
 * @param {Object} [parameters.extensionSettings]
 * @param {boolean} [parameters.extensionSettings.includePageMargins]
 * @param {boolean} [parameters.extensionSettings.needExportSupport]
 * @param {boolean} [parameters.extensionSettings.tocStream]
 * @param {string} [parameters.extensionSettings.renderMode]
 * @param {string} [parameters.extensionSettings.target]
 * @param {number} [requestId=0]
 */
export function renderReport(reportId, parameters, requestId = 0) {
  return (dispatch, getState) => {
    const hasRequestId = !!requestId;
    const endpoint = hasRequestId ? `reports/renderingRequests/${requestId}` : `reports/${reportId}/renderingRequests`;
    const method = hasRequestId ? 'GET' : 'POST';
    const body = hasRequestId ? null : {
      extensionName: 'Html',
      extensionSettings: {
        includePageMargins: false,
        needExportSupport: true,
        renderMode: 'Paginated',
        target: 'Screen',
        tocStream: true,
      },
      reportParameters: parameters || [],
    };

    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/${endpoint}`,
        method,
        body,
        types: [
          {
            type: ActionTypes.REQUEST_REPORT_RENDER,
            payload: { reportId },
          },
          {
            type: ActionTypes.RECEIVE_REPORT_RENDER,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');
              if (contentType && ~contentType.indexOf('text/html')) {
                // Report Content
                return res.text().then((text) => {
                  const markup = createMarkup(text, endpoints.arsResourceHandler);
                  return ({
                    markup: markup.outerHTML,
                    documentId: getDocumentId(markup),
                    pages: getPageCount(markup),
                    tocUrl: getTocUrl(markup),
                  });
                });
              } else if (contentType && ~contentType.indexOf('application/json')) {
                // The report exporting is in progress. Handle the RequestId
                return res.json().then((json) => camelizeKeys(json));
              }
              return null;
            },
          },
          ActionTypes.FAILURE_REPORT_RENDER,
        ],
      },
    }).then(() => {
      const reportRequestId = getState().viewer.requestId;
      if (!!reportRequestId) dispatch(renderReport(reportId, parameters, reportRequestId));
    });
  };
}

export function assembleReport(reportId = null, reportParams = null, exportParams = {}) {
  return (dispatch, getState) => {
    const id = reportId || getState().document.id;
    return dispatch(
      reportParams
        ? validateReportParameters(id, reportParams)
        : getReportParameters(id)
    ).then(() => {
      const params = getState().parameters.data;
      const hasInvalidParameters = getState().parameters.hasInvalidParameters;
      const hasError = getState().viewer.hasError;
      if (!hasInvalidParameters) {
        return dispatch(renderReport(id, params))
          .then(() => {
            if (exportParams.extensionSettings && (exportParams.extensionSettings.saveAsDialog || exportParams.extensionSettings.printOnOpen)) {
              dispatch(exportDocument(exportParams, reportId, null, false));
            } else {
              const tocUrl = getState().viewer.tocUrl;
              if (tocUrl) dispatch(getToc(tocUrl));
            }
          });
      } else if (!hasError) {
        return dispatch(changeSidebarAction('PARAMETERS'));
      }
      return Promise.resolve();
    });
  };
}

export function getDrilldownGroup(toggleElementId) {
  return (dispatch, getState) => {
    const reportId = getState().document.id;
    const documentId = getState().viewer.documentId;
    const documentType = getState().document.data.type;
    const documentName = getState().document.data.name;
    const toggleHistory = getState().viewer.toggleHistory;
    const toggleDuplicates = toggleHistory.findIndex(element => element === toggleElementId);

    if (toggleDuplicates !== -1) {
      toggleHistory.splice(toggleDuplicates, 1);
    } else {
      toggleHistory.push(toggleElementId);
    }

    const params = {
      documentId,
      extensionName: 'Html',
      extensionSettings: {
        renderMode: 'Paginated',
        NeedExportSupport: true,
        TocStream: true,
        IncludePageMargins: true,
      },
      name: documentName,
      reportType: documentType,
      toggleHistory,
    };

    return dispatch(exportDocument(params, reportId))
      .then(() => {
        const exportUrl = getState().viewer.exportUrl;
        if (exportUrl) {
          fetch(`${endpoints.arsResourceHandler}/${exportUrl}`)
            .then(res => res.text().then((text) => {
              const markup = createMarkup(text, endpoints.arsResourceHandler);
              return dispatch({
                type: ActionTypes.RECEIVE_REPORT_RENDER,
                payload: {
                  markup: markup.outerHTML,
                  toggleHistory,
                  pages: getPageCount(markup),
                  tocUrl: getTocUrl(markup),
                },
              });
            }));
        }
      });
  };
}
