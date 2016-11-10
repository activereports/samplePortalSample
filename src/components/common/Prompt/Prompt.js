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
import s from './Prompt.scss';


class Prompt extends Component {

  state = { value: '' };

  componentDidMount = () => this.props.onMount();

  handleOnCancel = () => this.props.onCancel();

  handleOnChange = (value) => this.setState({ value });

  handleOnConfirm = () => {
    this.props.onConfirm(this.state.value);
    this.handleOnCancel();
  };

  handleKeyDown = (event) => {
    if (this.state.value && event.keyCode === 13) {
      this.handleOnConfirm(); // enter
    }
  };

  render() {
    const { caption, text } = this.props;
    return (
      <Modal
        caption={caption}
        confirmText={'OK'}
        customBodyClassName={s.muted}
        isConfirmDisabled={!this.state.value}
        onConfirm={this.handleOnConfirm}
        onDismiss={this.handleOnCancel}
      >
        <div className={s.form}>
          <input
            autoFocus="true"
            className={s.input}
            type="text"
            defaultValue={text}
            onKeyDown={this.handleKeyDown}
            onChange={(event) => this.handleOnChange(event.target.value)}
          />
        </div>
      </Modal>
    );
  }
}

Prompt.propTypes = {
  caption: PropTypes.string,
  onCancel: PropTypes.func,
  onMount: PropTypes.func,
  onConfirm: PropTypes.func,
  text: PropTypes.string,
};

Prompt.defaultProps = {
  onCancel: () => {},
  onMount: () => {},
  onConfirm: () => {},
  text: '',
};

export default Prompt;
