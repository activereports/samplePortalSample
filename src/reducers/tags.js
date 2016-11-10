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
  data: {},
  favoritesId: null,
  isProcessing: false,
  tagId: '0',
  tagName: 'Uncategorized',
  tagsTree: [],
};

/**
 * Expands all parent nodes of specified tree node
 * @param {Object[]} tree - Tree data
 * @param {Object} targetNode - Target node
 * @param {boolean} [isExpanded]
 */
function expandTreeNodes(tree, targetNode, isExpanded = false) {
  Object.assign(targetNode, { isExpanded });
  if (targetNode.hasParent) {
    expandTreeNodes(tree, tree.find(node => node.id === targetNode.parentId), true);
  }
}

function checkChildIsEmpty(data, target) {
  const tags = target || [];
  const result = data.find(item => tags.includes(item.id) && item.reportsCount > 0) || false;
  return !result;
}

/**
 * Processes tags
 * @param {Object[]} rawData - Tree data
 * @param {Object} [activeNodeId=0] - Active node ID
 * @return {Object[]}
 */
function processTags(rawData = [], activeNodeId = 0) {
  const tagsData = [{
    id: '0',
    isFavorites: false,
    isSystem: true,
    isActive: true,
    isRoot: true,
    name: initialState.tagName,
  }];

  // Set custom data
  rawData.forEach(tag => {
    tagsData.push({
      childrenIds: tag.childTags || [],
      hasChildren: !!(tag.childTags && !checkChildIsEmpty(rawData, tag.childTags)) || false,
      hasParent: false,
      id: tag.id,
      isActive: false,
      isEmpty: tag.reportsCount <= 0 && checkChildIsEmpty(rawData, tag.childTags),
      isExpanded: false,
      isFavorites: tag.isFavorites,
      isRoot: true,
      isSystem: tag.isSystem,
      name: tag.name,
      parentId: null,
    });
  });

  // Init tree state
  tagsData.forEach(tag => {
    if (tag.hasChildren) {
      tag.childrenIds.forEach(childId => {
        tagsData.forEach(child => {
          if (child.id === childId) {
            Object.assign(child, {
              isActive: child.id === activeNodeId,
              parentId: tag.id, // Node, I am your father
              hasParent: true,
              isRoot: false,
            });
          }
        });
      });
    }
  });

  if (activeNodeId) {
    expandTreeNodes(tagsData, tagsData.find(node => node.id === activeNodeId));
  }

  return tagsData;
}


/**
 * ## Tags Reducers
 */
export default createReducer(initialState, {

  [ActionTypes.REQUEST_ADD_TAG]: (state) =>
    Object.assign({}, state, {
      isProcessing: true,
    }),

  [ActionTypes.RECEIVE_ADD_TAG]: (state, payload, meta) =>
    Object.assign({}, state, {
      isProcessing: false,
      tagId: payload.id,
      tagName: meta,
    }),

  [ActionTypes.REQUEST_TAGS]: (state) =>
    Object.assign({}, state, {
      isProcessing: true,
    }),

  [ActionTypes.RECEIVE_TAGS]: (state, payload) =>
    Object.assign({}, state, {
      favoritesId: payload.find(tag => tag.isFavorites).id || null,
      isProcessing: false,
      tagsTree: processTags(payload, state.tagId),
    }),

  [ActionTypes.SELECT_TAG_NODE]: (state, payload) => {
    const tagId = payload.id || initialState.tagId;
    return Object.assign({}, state, {
      data: state.tagsTree.find(tag => tag.id === tagId),
      tagId,
      tagName: payload.name || initialState.tagName,
      tagsTree: state.tagsTree.map(node =>
        node.id === payload.id
          ? Object.assign({}, node, { isActive: true })
          : Object.assign({}, node, { isActive: false })
      ),
    });
  },

  [ActionTypes.TOGGLE_TAG_NODE]: (state, payload) =>
    Object.assign({}, state, {
      tagsTree: state.tagsTree.map(node =>
        node.id === payload.id
          ? Object.assign({}, node, { isExpanded: !payload.state })
          : node
      ),
    }),

});
