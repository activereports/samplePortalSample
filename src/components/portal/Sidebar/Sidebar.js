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
import TreeView from '../TagsTree';
import s from './Sidebar.scss';

class Sidebar extends Component {

  // ACTION HANDLERS

  handleOnClickOnDismiss = () => this.props.onHideSidebar();
  handleOnClickOnTreeItem = (id, name) => this.props.onChangeTreeItem(id, name);
  handleOnHoverOnTreeNode = (id, state) => this.props.onHoverOnTreeItem(id, state);
  handleOnToggleOnTreeNode = (id, state) => this.props.onToggleTreeNode(id, state);

  // RENDER COMPONENT

  render() {
    const { isSidebarVisible } = this.props;
    return (
      <div className={ cx(s.root, { [s.root_hidden]: !isSidebarVisible }) }>

        { /* Sidebar Header */ }
        <div className={s.head}>
          <div className={s.branding}>
            <div className={s.logo}>
              <img src="./branding/portal-main-logo.png" alt="Active Reports Server" />
            </div>
          </div>
          <div className={s.dismiss} role="button" onClick={this.handleOnClickOnDismiss}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 15.642 15.642">
              <path fill="#FFF" fillRule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z" />
            </svg>
          </div>
        </div>

        { /* Sidebar Body */ }
        <div className={s.body}>
          <TreeView
            onClick={this.handleOnClickOnTreeItem}
            onToggle={this.handleOnToggleOnTreeNode}
            onHover={this.handleOnHoverOnTreeNode}
            {...this.props}
          />
        </div>

      </div>
    );
  }
}

Sidebar.propTypes = {
  isSidebarVisible: PropTypes.bool,
  onChangeTreeItem: PropTypes.func,
  onHideSidebar: PropTypes.func,
  onHoverOnTreeItem: PropTypes.func,
  onToggleTreeNode: PropTypes.func,
  tagsList: PropTypes.array,
};

export default Sidebar;
