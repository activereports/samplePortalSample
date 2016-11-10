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

class Input extends Component {

  // ACTION/EVENT HANDLERS

  handleKeyDown = (event) => {
    const value = this.refs.input.value;
    if (event.keyCode === 13) {
      this.props.onChange(value); // enter
      this.refs.input.value = '';
    } else if (event.keyCode === 27) {
      this.refs.input.value = ''; // escape
    }
  };

  // RENDER COMPONENT

  render() {
    const { className, style, hidden } = this.props;
    return !hidden && (
      <input
        ref="input"
        className={cx(className, style.input)}
        onKeyDown={this.handleKeyDown}
        {...this.props}
      />
    );
  }
}

Input.propTypes = {
  // Data
  className: PropTypes.string,
  hidden: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.string,
  // Actions
  onChange: PropTypes.func,
};

Input.defaultProps = {
  hidden: false,
  style: {
    input: 'input',
    input_disabled: 'input_disabled',
  },
};

export default Input;
