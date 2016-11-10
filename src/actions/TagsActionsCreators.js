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
import { getDocuments } from './DocumentsActionCreators';
import ActionTypes from '../constants/ActionTypes';

/**
 * Toggle tree node
 * @param {string} id - Tree Node ID
 * @param {boolean} state
 */
export function toggleTreeNode(id, state) {
  return {
    type: ActionTypes.TOGGLE_TAG_NODE,
    payload: { id, state },
  };
}

/**
 * Select a tree node
 * @param {string} [id] - Tree Node ID
 * @param {string} [name] - Node's name
 */
export function selectTreeNode(id = '0', name = '') {
  return dispatch =>
    dispatch({
      type: ActionTypes.SELECT_TAG_NODE,
      payload: { id, name },
    }).then(() => dispatch(getDocuments(id)));
}

/**
 * Requests a list of tags
 */
export function getTags() {
  return (dispatch, getState) => {
    const { tagId, tagName } = getState().tags;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/tags${setQueryParams({ type: 'personal' })}`,
        method: 'GET',
        types: [
          ActionTypes.REQUEST_TAGS,
          ActionTypes.RECEIVE_TAGS,
          ActionTypes.REQUEST_TAGS,
        ],
      },
    }).then(() => dispatch(selectTreeNode(tagId, tagName)));
  };
}

/**
 * Add Tag
 * @param {string} name - Tag Name
 * @param {string} [parent] - Parent Tag ID
 */
export function addTag(name, parent = '0') {
  return (dispatch, getState) =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/tags`,
        method: 'POST',
        body: {
          name,
          description: name,
          parent: parent === '0' ? null : parent },
        types: [
          ActionTypes.REQUEST_ADD_TAG,
          {
            type: ActionTypes.RECEIVE_ADD_TAG,
            meta: name,
          },
          ActionTypes.FAILURE_ADD_TAG,
        ],
      },
    })
    .then(() => dispatch(getTags()))
    .then(() => dispatch(() => {
      const { tagId, tagName } = getState().tags;
      selectTreeNode(tagId, tagName);
    }));
}

/**
 * Deletes the tag
 * @param {string} [tagId] - Tag ID
 */
export function deleteTag(tagId) {
  return (dispatch, getState) => {
    const id = tagId || getState().tags.tagId;
    return dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/tags/${id}`,
        method: 'DELETE',
        types: [
          ActionTypes.REQUEST_DELETE_TAG,
          ActionTypes.RECEIVE_DELETE_TAG,
          ActionTypes.FAILURE_DELETE_TAG,
        ],
      },
    })
      .then(() => dispatch(selectTreeNode()))
      .then(() => dispatch(getTags()));
  };
}

/**
 * Updates only the specified properties of the tags
 * @param {object} tag
 * @param {string} tag.id
 * @param {string} tag.name
 * @param {string} [tag.description]
 * @param {string} [tag.parent]
 * @param {boolean} [tag.isSystem]
 */
export function updateTag(tag) {
  return dispatch =>
    dispatch({
      [CALL_API]: {
        endpoint: `${endpoints.arsRest}/tags/${tag.id}`,
        method: 'PATCH',
        body: tag,
        types: [
          ActionTypes.REQUEST_UPDATE_TAG,
          ActionTypes.RECEIVE_UPDATE_TAG,
          ActionTypes.FAILURE_UPDATE_TAG,
        ],
      },
    })
      .then(() => dispatch(selectTreeNode(tag.id, tag.name)))
      .then(() => dispatch(getTags()));
}
