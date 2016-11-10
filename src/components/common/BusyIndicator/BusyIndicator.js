/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes } from 'react';
import FontIcon from '../FontIcon';

const BusyIndicator = (props) => (
  <div className={props.className}>
    <FontIcon name="stack">
      <FontIcon name={props.spinner} spin stack="1x" />
      <FontIcon name="circle-thin" stack="2x" />
    </FontIcon>
  </div>
);

BusyIndicator.propTypes = {
  className: PropTypes.string,
  spinner: PropTypes.string,
};

BusyIndicator.defaultProps = {
  spinner: 'refresh',
};

export default BusyIndicator;
