/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react';
import scopeTab from '../../../utils/scopeTab';
import cx from 'classnames';
import s from './Modal.scss';

class Modal extends Component {

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleOnClickOnDismiss = () => this.props.onDismiss();

  handleOnClickOnConfirm = (event) => {
    event.preventDefault();
    if (!this.props.isConfirmDisabled) this.props.onConfirm();
    if (this.props.closeOnConfirm) this.handleOnClickOnDismiss();
  };

  handleKeyDown = (event) => {
    if (event.keyCode === 27) this.handleOnClickOnDismiss(); // esc
    if (event.keyCode === 9) scopeTab(this.refs.content, event); // tab
  };

  render() {
    const { caption, children, customBodyClassName, dismissText, isConfirmDisabled, confirmText } = this.props;
    return (
      <div>
        <div className={s.root} tabIndex="-1" role="dialog" ref="content">
          <div className={s.dialog} role="document">
            <div className={s.content}>
              <div className={s.header}>
                <span className={s.close} role="button" onClick={this.handleOnClickOnDismiss}>&times;</span>
                <span className={s.caption}>{caption}</span>
              </div>
              <div className={cx(s.body, customBodyClassName)}>
                {children}
              </div>
              <div className={s.footer}>
                <button className={s.button} type="button" onClick={this.handleOnClickOnDismiss}>
                  {dismissText}
                </button>
                {!!confirmText &&
                  <button
                    type="button"
                    className={cx(s.button, s.button_primary, { [s.button_disabled]: isConfirmDisabled })}
                    disabled={isConfirmDisabled}
                    onClick={this.handleOnClickOnConfirm}
                  >
                    {confirmText}
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={s.backdrop} onClick={this.handleOnClickOnDismiss}></div>
      </div>
    );
  }
}

Modal.propTypes = {
  caption: PropTypes.string,
  children: PropTypes.element,
  confirmText: PropTypes.string,
  customBodyClassName: PropTypes.string,
  dismissText: PropTypes.string,
  closeOnConfirm: PropTypes.bool,
  isConfirmDisabled: PropTypes.bool,
  onConfirm: PropTypes.func,
  onDismiss: PropTypes.func,
};

Modal.defaultProps = {
  confirmText: 'OK',
  dismissText: 'Cancel',
  closeOnConfirm: false,
  isConfirmDisabled: false,
};

export default Modal;
