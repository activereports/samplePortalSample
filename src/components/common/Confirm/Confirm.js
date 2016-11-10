/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react';
import Modal from '../Modal';
import s from './Confirm.scss';

class Confirm extends Component {

  componentDidMount = () => this.props.onMount();

  handleOnDismiss = () => this.props.onCancel();

  handleOnSubmit = () => {
    this.props.onConfirm();
    this.handleOnDismiss();
  };

  render() {
    const { caption, confirmLabel, dismissText, message } = this.props;
    return (
      <Modal
        caption={caption}
        customBodyClassName={s.muted}
        dismissText={dismissText}
        onDismiss={this.handleOnDismiss}
        onConfirm={this.handleOnSubmit}
        submitText={confirmLabel}
      >
        <div className={s.message}>
          {message}
        </div>
      </Modal>
    );
  }
}

Confirm.propTypes = {
  cancelLabel: PropTypes.string,
  caption: PropTypes.string,
  confirmLabel: PropTypes.string,
  dismissText: PropTypes.string,
  message: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onMount: PropTypes.func,
};

Confirm.defaultProps = {
  cancelLabel: 'Cancel',
  caption: 'Confirm',
  confirmLabel: 'OK',
  message: '',
  onCancel: () => {},
  onConfirm: () => {},
  onMount: () => {},
};

export default Confirm;
