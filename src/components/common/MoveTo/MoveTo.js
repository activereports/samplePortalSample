/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import Modal from '../Modal';
import FontIcon from '../FontIcon';
import s from './MoveTo.scss';

/**
 * Confirm Component
 */
class MoveTo extends Component {

  state = {
    isRoot: false,
    nodeId: '',
    treeData: [],
  };

  componentDidMount = () => this.setState({ treeData: this.props.treeData })

  handleOnDismiss = () => this.props.onCancel();

  handleOnConfirm = () => {
    const { tagName, tagId } = this.props;
    this.props.onConfirm({
      name: tagName,
      id: tagId,
      parent: this.state.nodeId,
    });
    this.handleOnDismiss();
  };

  /**
   * Handles click on tree view's element
   * @param {String} [id] Current Tree Node ID
   * @param {String} [name] Current Tree Node name
   * @param {Event} [event] Event
   */
  handleOnClickOnTreeItem = (id, event) => {
    event.stopPropagation();
    if (this.props.tagId !== id) {
      this.setState({
        isRoot: false,
        nodeId: id,
        treeData: this.state.treeData.map(node =>
          node.id === id
            ? Object.assign({}, node, { isTarget: true })
            : Object.assign({}, node, { isTarget: false })
        ),
      });
    }
  };

  /**
   * Handles key down on tree view's element
   * @param {String} [id] Current Tree Node ID
   * @param {String} [name] Current Tree Node name
   * @param {Event} [event] Event
   */
  handleOnKeyDownOnTreeItem = (id, event) => {
    if (event.keyCode === 13) this.handleOnClickOnTreeItem(id, event); // enter
  };

  /**
   * Handles click on tree view's root node
   * @param {Event} [event] Event
   */
  handleOnClickOnTreeRoot = (event) => {
    event.stopPropagation();
    this.setState({
      isRoot: true,
      nodeId: null,
      treeData: this.state.treeData.map(node =>
        Object.assign({}, node, { isTarget: false })
      ),
    });
  };

  /**
   * Render tree item
   * @param {Object} [node] Tree Node
   * @return {XML} Tree Item.
   */
  renderChild = (node) => {
    const { treeData } = this.state;
    const children = node ? treeData.map(child => child.parentId === node.id && !node.isActive ? this.renderChild(child) : null) : null;
    return node.id !== '0' && !node.isFavorites ? (
      <li
        role="treeitem" tabIndex="0" key={node.id}
        onClick={(event) => this.handleOnClickOnTreeItem(node.id, event)}
        onKeyDown={(event) => this.handleOnKeyDownOnTreeItem(node.id, event)}
        className={cx(s.child, {
          [s.child_active]: node.isActive,
          [s.child_target]: node.isTarget,
        })}
      >
        <div className={s.item}>
          <FontIcon name={cx({
            folder: node.isTarget,
            'folder-open': node.isActive,
            'folder-o': !(node.isActive && node.isTarget),
          })}
          />
          <span>{node.name}</span>
        </div>
        <ul className={s.node} role="group">{children}</ul>
      </li>
    ) : null;
  };

  render() {
    const { caption, confirmLabel, dismissText } = this.props;
    const { isRoot, nodeId, treeData } = this.state;
    return (
      <Modal
        caption={caption}
        confirmText={confirmLabel}
        customBodyClassName={s.muted}
        dismissText={dismissText}
        isConfirmDisabled={nodeId === ''}
        onConfirm={this.handleOnConfirm}
        onDismiss={this.handleOnDismiss}
      >
        <div className={s.tree}>
          <ul className={s.node} role="tree">
            <li
              role="treeitem" tabIndex="0" autoFocus="true"
              onClick={this.handleOnClickOnTreeRoot}
              className={cx(s.child, { [s.child_target]: isRoot })}
            >
              <div className={s.item}>
                <FontIcon name={cx({
                  folder: this.state.isRoot,
                  'folder-o': !this.state.isRoot,
                })}
                />
                <span>Root</span>
              </div>
            </li>
            <ul className={s.node} role="tree">
              {treeData.map(node =>
                node.isRoot
                  ? this.renderChild(node)
                  : null
              )}
            </ul>
          </ul>
        </div>
      </Modal>
    );
  }
}

MoveTo.propTypes = {
  cancelLabel: PropTypes.string,
  caption: PropTypes.string,
  confirmLabel: PropTypes.string,
  dismissText: PropTypes.string,
  message: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onMount: PropTypes.func,
  treeData: PropTypes.array,
  tagId: PropTypes.string,
  tagName: PropTypes.string,
};

MoveTo.defaultProps = {
  cancelLabel: 'Cancel',
  caption: 'Move To...',
  confirmLabel: 'Move',
  message: '',
  onCancel: () => {},
  onConfirm: () => {},
  onMount: () => {},
  treeData: [],
};

export default MoveTo;
