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
import FontIcon from '../FontIcon';

class Button extends Component {

  // ACTION/EVENT HANDLERS

  handleOnClick = (event) => {
    event.preventDefault();
    if (!this.props.disabled) {
      this.props.onClick(event);
    }
  };

  // RENDER COMPONENT

  render() {
    const { caret, icon, label, title, active, disabled, processing, className, children, style, hidden } = this.props;
    const classes = cx(className, style.tool, {
      [style.tool_active]: active,
      [style.tool_disabled]: disabled,
    });

    return !hidden && (
      <div
        className={classes}
        disabled={disabled}
        role="button"
        title={title || label}
        onClick={this.handleOnClick}
      >
        { icon && <FontIcon className={style.toolIcon} spin={processing} name={icon} /> }
        { label && <span className={style.toolLabel}>{label}</span> }
        { caret && <FontIcon className={style.toolCaret} name={caret} /> }
        { children }
      </div>
    );
  }
}

Button.propTypes = {
  // Data
  active: PropTypes.bool,
  caret: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  processing: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
  // Actions
  onClick: PropTypes.func,
};

Button.defaultProps = {
  active: false,
  disabled: false,
  hidden: false,
  processing: false,
  style: {
    tool: 'tool',
    tool_active: 'tool_active',
    tool_disabled: 'tool_disabled',
    toolIcon: 'toolIcon',
    toolLabel: 'toolLabel',
    toolCaret: 'toolCaret',
  },
};

export default Button;
