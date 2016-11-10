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
import s from './ReportsFilter.scss';

class ReportsFilter extends Component {

  // ACTION HANDLERS

  handleChange = (str) => this.props.onChange(str);

  // EVENT HANDLERS

  handleOnChange = (event) =>
    this.handleChange(event.target.value.toLowerCase());

  handleOnReset = () =>
    this.handleChange('');

  // RENDER COMPONENT

  render() {
    const { value } = this.props;
    return (
      <div className={cx(s.root, { [s.active]: !!value })}>
        <input
          className={s.input}
          onChange={this.handleOnChange}
          placeholder="Filter list by report name"
          type="text"
          value={value}
        />
        <div
          className={s.button}
          onClick={this.handleOnReset}
          role="button"
          title="Reset filter"
        >
          <FontIcon name="times" />
        </div>
      </div>
    );
  }
}

ReportsFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default ReportsFilter;
