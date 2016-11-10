/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

class ContextMenu extends Component {

  state = {
    rect: {},
    innerWidth: 0,
    innerHeight: 0,
  };

  // COMPONENT LIFECYCLE

  componentDidMount() {
    document.addEventListener('click', this.handleDismiss);
    const { innerWidth, innerHeight } = window;
    const node = ReactDOM.findDOMNode(this);
    const rect = node.getBoundingClientRect();
    this.setState({ rect, innerWidth, innerHeight }); // eslint-disable-line react/no-did-mount-set-state
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDismiss);
  }

  // UTILS

  getMenuPosition = (event) => {
    const { rect, innerWidth, innerHeight } = this.state;
    const position = {
      top: event.clientY,
      left: event.clientX,
      maxHeight: innerHeight - 20,
    };

    if (rect.top + rect.height > innerHeight) position.top -= rect.height;
    if (rect.left + rect.width > innerWidth) position.left -= rect.width;

    return position;
  };

  // ACTION HANDLERS

  handleDismiss = () => this.props.onDismiss();

  // RENDER COMPONENT

  render() {
    const { className, children, style, event } = this.props;
    return (
      <ul
        className={ cx(style.contextMenu, className) }
        style={this.getMenuPosition(event)}
      >
        { children }
      </ul>
    );
  }
}

ContextMenu.propTypes = {
  // Data
  children: PropTypes.array,
  className: PropTypes.string,
  contextID: PropTypes.string,
  event: PropTypes.object,
  style: PropTypes.object,
  // Actions
  onDismiss: PropTypes.func,
};

ContextMenu.defaultProps = {
  style: {},
};

export default ContextMenu;
