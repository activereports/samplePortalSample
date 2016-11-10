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
import s from './AssignTo.scss';

class AssignTo extends Component {

  state = {
    nodeIdx: null,
    treeData: [],
  };

  componentDidMount = () => this.setState({
    nodeIdx: this.props.document.tags,
    treeData: this.props.treeData.map(node =>
      this.props.document.tags.indexOf(node.id) !== -1
        ? Object.assign({}, node, { isTarget: true })
        : Object.assign({}, node, { isTarget: false })
    ),
  });

  /**
   * Handles dismiss
   */
  handleOnDismiss = () => this.props.onCancel();

  /**
   * Handles confirmation
   */
  handleOnConfirm = () => {
    this.props.onConfirm(this.props.document._id, this.state.nodeIdx);
    this.handleOnDismiss();
  };

  /**
   * Handles click on tree view's element
   * @param {String} id - Current Tree Node
   * @param {Event} event - Event
   * @param isDisabled {Boolean}
   */
  handleOnClickOnTreeItem = (id, event, isDisabled) => {
    event.stopPropagation();
    if (!isDisabled) {
      const { nodeIdx } = this.state;
      const newNodeIdx = nodeIdx.indexOf(id) !== -1
        ? nodeIdx.filter(node => node !== id)  // remove if already added
        : [...new Set([...this.state.nodeIdx, id])];
      this.setState({
        nodeIdx: newNodeIdx,
        isRoot: false,
        treeData: this.state.treeData.map(node =>
          newNodeIdx.indexOf(node.id) !== -1
            ? Object.assign({}, node, { isTarget: true })
            : Object.assign({}, node, { isTarget: false })
        ),
      });
    }
  };

  /**
   * Handles key down on tree view's element
   * @param {String} id - Current Tree Node ID
   * @param {Event} event - Event
   * @param isDisabled {Boolean}
   */
  handleOnKeyDownOnTreeItem = (id, event, isDisabled) => {
    if (!isDisabled) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        this.handleOnClickOnTreeItem(id, event, isDisabled); // enter or space
      }
    }
  };

  /**
   * Render tree item
   * @param {Object} [node] Tree Node
   * @param {number} [key]
   * @return {XML} Tree Item.
   */
  renderChild = (node) => {
    const { treeData } = this.state;
    const { canAssignSystemTags } = this.props;
    const isDisabled = !canAssignSystemTags && node.isSystem;
    const children = node
      ? treeData.map(child => child.parentId === node.id ? this.renderChild(child) : null)
      : null;

    return node.id === '0' ? null : (
      <li
        role="treeitem" key={node.id} tabIndex="0"
        onClick={(event) => this.handleOnClickOnTreeItem(node.id, event, isDisabled)}
        onKeyDown={(event) => this.handleOnKeyDownOnTreeItem(node.id, event)}
        className={cx(s.child, {
          [s.child_target]: node.isTarget,
          [s.child_disabled]: isDisabled,
        })}
      >
        <div className={s.item}>
          <FontIcon
            name={cx({
              ['folder']: node.isTarget,
              ['folder-o']: !node.isTarget,
            })}
          />
          <span>{node.name}</span>
        </div>
        <ul className={s.node} role="group">{children}</ul>
      </li>
    );
  };

  render() {
    const { caption, confirmLabel, dismissText } = this.props;
    const { nodeIdx, treeData } = this.state;
    return (
      <Modal
        caption={caption}
        confirmText={confirmLabel}
        customBodyClassName={s.muted}
        dismissText={dismissText}
        isConfirmDisabled={nodeIdx === null}
        onConfirm={this.handleOnConfirm}
        onDismiss={this.handleOnDismiss}
      >
        <div className={s.tree}>
          <ul className={s.node} role="tree">
            {treeData.map(node =>
              node.isRoot
                ? this.renderChild(node)
                : null
            )}
          </ul>
        </div>
      </Modal>
    );
  }
}

AssignTo.propTypes = {
  canAssignSystemTags: PropTypes.bool,
  cancelLabel: PropTypes.string,
  caption: PropTypes.string,
  confirmLabel: PropTypes.string,
  dismissText: PropTypes.string,
  document: PropTypes.object,
  message: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onMount: PropTypes.func,
  tagId: PropTypes.string,
  tagName: PropTypes.string,
  treeData: PropTypes.array,
};

AssignTo.defaultProps = {
  canAssignSystemTags: false,
  cancelLabel: 'Cancel',
  caption: 'Assign To...',
  confirmLabel: 'Assign',
  message: '',
  onCancel: () => {},
  onConfirm: () => {},
  onMount: () => {},
  treeData: [],
};

export default AssignTo;
