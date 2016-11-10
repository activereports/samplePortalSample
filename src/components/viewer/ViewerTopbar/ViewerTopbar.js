/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react';
import FontIcon from '../../common/FontIcon';
import s from './ViewerTopbar.scss';

class ViewerTopbar extends Component {

  // Action Handlers
  handleDismiss = () => this.props.onDismiss();

  // Render Component
  render() {
    const { caption, strings } = this.props;
    return (
      <div className={s.root}>
        <div className={s.caption}>
          { caption }
        </div>
        <div
          className={s.dismiss}
          role="button"
          title={strings.dismiss}
          onClick={this.handleDismiss}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 15.642 15.642">
            <path fill="#000" fillRule="evenodd" d="M8.882,7.821l6.541-6.541c0.293-0.293,0.293-0.768,0-1.061  c-0.293-0.293-0.768-0.293-1.061,0L7.821,6.76L1.28,0.22c-0.293-0.293-0.768-0.293-1.061,0c-0.293,0.293-0.293,0.768,0,1.061  l6.541,6.541L0.22,14.362c-0.293,0.293-0.293,0.768,0,1.061c0.147,0.146,0.338,0.22,0.53,0.22s0.384-0.073,0.53-0.22l6.541-6.541  l6.541,6.541c0.147,0.146,0.338,0.22,0.53,0.22c0.192,0,0.384-0.073,0.53-0.22c0.293-0.293,0.293-0.768,0-1.061L8.882,7.821z" />
          </svg>
        </div>
      </div>
    );
  }
}

ViewerTopbar.propTypes = {
  caption: PropTypes.string,
  onDismiss: PropTypes.func,
  strings: PropTypes.object,
};

ViewerTopbar.defaultProps = {
  strings: {
    dismiss: 'Dismiss',
  },
};

export default ViewerTopbar;
