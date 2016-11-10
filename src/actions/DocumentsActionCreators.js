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
import { getTags } from './TagsActionsCreators';
import ActionTypes from '../constants/ActionTypes';


export function updateDocument(doc) {
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${doc.id}`,
        method: 'PATCH',
        body: { name: doc.name },
        types: [
          ActionTypes.REQUEST_UPDATE_REPORT,
          ActionTypes.RECEIVE_UPDATE_REPORT,
          ActionTypes.FAILURE_UPDATE_REPORT,
        ],
      },
    }).then(() => dispatch(getTags()));
}

/**
 * Replace the specified tags in the report
 * @param {string} id - ID of the document
 * @param {array} tags - An array of tag IDs to replace
 */
export function updateDocumentTags(id, tags) {
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${id}/tags`,
        method: 'PUT',
        body: tags,
        types: [
          ActionTypes.REQUEST_UPDATE_REPORT_TAG,
          ActionTypes.RECEIVE_UPDATE_REPORT_TAG,
          ActionTypes.FAILURE_UPDATE_REPORT_TAG,
        ],
      },
    }).then(() => dispatch(getTags()));
}

/**
 * Add a document to favorites
 * @param {string} [documentId] - ID of the document
 * @param {string} [favoritesId] - Favorites tag IDs
 */
export function addToFavorites(documentId, favoritesId) {
  return (dispatch, getState) => {
    const id = documentId || getState().document.id;
    const tags = getState().document.data.tags || [];
    const favorites = favoritesId || getState().tags.favoritesId;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${id}/tags`,
        method: 'PUT',
        body: favorites ? tags.concat(favorites.split(',')) : tags,
        types: [
          ActionTypes.REQUEST_UPDATE_REPORT_TAG,
          ActionTypes.RECEIVE_UPDATE_REPORT_TAG,
          ActionTypes.FAILURE_UPDATE_REPORT_TAG,
        ],
      },
    }).then(() => dispatch(getTags()));
  };
}

/**
 * Remove a document from favorites
 * @param {string} [documentId] - ID of the document
 * @param {string} [favoritesId] - Favorites tag IDs
 */
export function removeFromFavorites(documentId, favoritesId) {
  return (dispatch, getState) => {
    const id = documentId || getState().document.id;
    const favorites = favoritesId || getState().tags.favoritesId;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${id}/tags/${favorites}`,
        method: 'DELETE',
        types: [
          ActionTypes.REQUEST_DELETE_REPORT_TAG,
          ActionTypes.RECEIVE_DELETE_REPORT_TAG,
          ActionTypes.FAILURE_DELETE_REPORT_TAG,
        ],
      },
    }).then(() => dispatch(getTags()));
  };
}


/**
 * Delete the specified documents
 * @param {string} id - A comma-separated string containing document IDs.
 */
export function deleteDocument(id) {
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${id}`,
        method: 'DELETE',
        types: [
          ActionTypes.REQUEST_DELETE_REPORT,
          ActionTypes.RECEIVE_DELETE_REPORT,
          ActionTypes.FAILURE_DELETE_REPORT,
        ],
      },
    }).then(() => dispatch(getTags()));
}

/**
 * Filter the list of documents
 * @param {string} filterText Filter text
 */
export function filterDocumentsList(filterText) {
  return {
    type: ActionTypes.SET_FILTER_TEXT,
    payload: { filterText },
  };
}

/**
 * Get access control list (ACL).
 * @param {string} [id] - ID of the document
 */
export function getDocumentPermissions(id) {
  return (dispatch, getState) => {
    const { roles } = getState.user;
    const documentId = id || getState().document.id;
    const params = id ? setQueryParams({ selector: 'myroles' }) : '';
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${documentId}/permissions${params}`,
        method: 'GET',
        types: [
          ActionTypes.REQUEST_REPORT_PERMISSIONS,
          {
            type: ActionTypes.RECEIVE_REPORT_PERMISSIONS,
            meta: roles,
          },
          ActionTypes.RECEIVE_REPORT_PERMISSIONS,
        ],
      },
    });
  };
}

/**
 * Get all versions of the document
 * @param {string} [reportId]
 */
export function getReportVersions(reportId) {
  return (dispatch, getState) => {
    const id = reportId || getState().document.id;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${id}/versions`,
        method: 'GET',
        types: [
          ActionTypes.REQUEST_REPORT_VERSIONS,
          ActionTypes.RECEIVE_REPORT_VERSIONS,
          ActionTypes.FAILURE_REPORT_VERSIONS,
        ],
      },
    });
  };
}

/**
 * Get a list of models
 */
export function getModels() {
  return {
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/models`,
      method: 'GET',
      types: [
        ActionTypes.REQUEST_MODELS,
        ActionTypes.RECEIVE_MODELS,
        ActionTypes.FAILURE_MODELS,
      ],
    },
  };
}

/**
 * Delete the specified documents
 * @param {string} [reportId] - A comma-separated string containing document IDs
 */
export function deleteReport(reportId) {
  return (dispatch, getState) => {
    const id = reportId || getState().document.id;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${id}`,
        method: 'DELETE',
        types: [
          ActionTypes.REQUEST_DELETE_REPORT,
          ActionTypes.RECEIVE_DELETE_REPORT,
          ActionTypes.FAILURE_DELETE_REPORT,
        ],
      },
    });
  };
}

/**
 * Sorts the reports list by sort flag
 */
export function setSortFlag(sortFlag) {
  return {
    type: ActionTypes.SET_SORT_FLAG,
    payload: sortFlag,
  };
}

/**
 * Sorts the reports list by sort method
 */
export function setSortMethod(sortMethod) {
  return {
    type: ActionTypes.SET_SORT_METHOD,
    payload: sortMethod,
  };
}

/**
 * Gets a document from the collection by ID
 * @param {string} id - ID of the document
 */
export function getDocument(id) {
  return (dispatch, getState) =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/reports/${id}`,
        method: 'GET',
        types: [
          {
            type: ActionTypes.REQUEST_REPORT,
            payload: { documentId: id },
          },
          {
            type: ActionTypes.RECEIVE_REPORT,
            meta: { favoritesId: getState().tags.favoritesId },
          },
          ActionTypes.FAILURE_REPORT,
        ],
      },
    }).then(() => dispatch(getReportVersions()));
}

/**
 * Returns a list of available reports
 * @param {string} [id] - Tree Node ID
 */
export function getDocuments(id = '0') {
  const params = id === '0'
    ? setQueryParams({ selector: '{"Tags":[]}' })
    : setQueryParams({ selector: `{"Tags":["${id}"]}` });
  return (dispatch, getState) => dispatch({
    [CALL_API]: {
      endpoint: `${endpoints.arsRest}/reports${params}`,
      method: 'GET',
      types: [
        ActionTypes.REQUEST_REPORTS,
        {
          type: ActionTypes.RECEIVE_REPORTS,
          meta: { favoritesId: getState().tags.favoritesId },
        },
        ActionTypes.FAILURE_REPORTS,
      ],
    },
  });
}
