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
import FontIcon from '../../common/FontIcon';
import s from './TagsTree.scss';

class TagsTree extends Component {

  state = { hoveredNodeId: null };

  // ACTION HANDLERS

  handleClick = (id, name) => this.props.onClick(id, name); // Activate selected tree node

  // EVENT HANDLERS

  /**
   * Handle on Click on Tree Item
   * @param {String} id - Current Tree Node ID
   * @param {String} name - Current Tree Node name
   * @param {Event} event - Event
   */
  handleOnClickOnTreeItem = (id, name, event) => {
    this.handleClick(id, name);
    event.stopPropagation();
  };

  /**
   * Handle on Mouse Over on Tree Item
   * @param {String} id - Current Tree Node ID
   * @param {Event} event - Event
   */
  handleOnMouseOverOnTreeItem = (id, event) => {
    this.setState({ hoveredNodeId: id });
    event.stopPropagation();
  };

  /**
   * Handle on Mouse Out on Tree Item
   * @param {String} id - Current Tree Node ID
   * @param {Event} event - Event
   */
  handleOnMouseOutOnTreeItem = (id, event) => {
    this.setState({ hoveredNodeId: null });
    event.stopPropagation();
  };

  /**
   * Expand or collapse tree node
   * @param {Object} node - Current Tree Node
   * @param {Event} event - Event
   */
  toggleTreeNode = (node, event) => {
    if (node.hasChildren) {
      event.stopPropagation();
      this.props.onToggle(node.id, node.isExpanded);
    }
  };

  // RENDER ASSETS

  /**
   * Render tree item
   * @param {Object} node - Tree Node
   * @return {XML} - Tree Item
   */
  renderChild = (node) => {
    const { tagsList, hideEmptyTags } = this.props;
    const children = node ? tagsList.map(child => child.parentId === node.id ? this.renderChild(child) : null) : null;

    const nodeIconClass = cx({
      ['star']: node.isFavorites,
      ['folder-open']: node.isExpanded,
      ['folder']: !(node.isFavorites || node.isExpanded),
    });

    const nodeToggleIconClass = cx({
      'caret-down': node.hasChildren && node.isExpanded,
      'caret-right': node.hasChildren && !node.isExpanded,
    });

    const itemClass = cx(s.child, {
      [s.child_active]: node.isActive,
      [s.child_hovered]: this.state.hoveredNodeId === node.id,
    });

    const nodeClass = cx(s.node, {
      [s.node_expanded]: node.isExpanded,
      [s.node_collapsed]: !node.isExpanded,
    });

    return hideEmptyTags && node.isEmpty ? null : (
      <li className={itemClass} role="treeitem" key={node.id}
        onClick={(event) => this.handleOnClickOnTreeItem(node.id, node.name, event)}
        onMouseOver={(event) => this.handleOnMouseOverOnTreeItem(node.id, event)}
        onMouseOut={(event) => this.handleOnMouseOutOnTreeItem(node.id, event)}
      >
        <div className={s.toggle} onClick={(event) => this.toggleTreeNode(node, event)}>
          <FontIcon name={nodeToggleIconClass} />
        </div>
        <div className={s.label}>
          <FontIcon className={s.icon} name="stack">
            <FontIcon name={nodeIconClass} stack="1x" />
            <FontIcon className={s.icon_special} name={cx({ lock: node.isSystem })} stack="1x" inverse />
          </FontIcon>
          { node.name }
        </div>
        <ul className={nodeClass} role="group">
          { children }
        </ul>
      </li>
    );
  };

  // RENDER COMPONENT

  render() {
    return (
      <div className={s.data}>
        <ul className={s.node} role="tree">
          { this.props.tagsList.map(node =>
              node.isRoot
                ? this.renderChild(node)
                : null
            )
          }
        </ul>
      </div>
    );
  }
}

TagsTree.propTypes = {
  tagsList: PropTypes.array,
  hideEmptyTags: PropTypes.bool,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onToggle: PropTypes.func,
};

TagsTree.defaultProps = {
  tagsList: [],
};

export default TagsTree;
