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
import Modal from '../../common/Modal';
import s from './Permissions.scss';

class Permissions extends Component {

  state = { params: [] };

  // COMPONENT LIFECYCLE

  componentDidMount = () => this.props.onMount();

  // ACTIONS HANDLERS

  handleDismiss = () => this.props.onDismiss();
  handleSubmit = (permissions) => this.props.onSubmit(permissions);

  // EVENT HANDLERS

  /**
   * Handle on change on select
   * @param {string} value
   * @param {string} key
   */
  handleOnChangeSelect = (value, key) => {
    const params = Object.assign([], this.props.data, this.state.params);
    params[key] = Object.assign({}, params[key], { operations: value });
    this.setState({ params });
  };

  /**
   * Handles confirm
   */
  handleOnClickOnConfirm = () => {
    const permissions = this.state.params.slice();
    permissions.map((permission, key) =>
      permission.role === 'Administrator'
        ? permissions.splice(key, 1)
        : permission
    );
    this.setState({ params: [] });
    this.handleSubmit(permissions);
  };

  // RENDER ASSETS

  /**
   * Render Loader
   * @return {XML}
   */
  renderLoader = () => (
    <div className={s.loader}>
      <FontIcon name="stack">
        <FontIcon name="refresh" spin stack="1x" />
        <FontIcon name="circle-thin" stack="2x" />
      </FontIcon>
    </div>
  );

  /**
   * Render Permission
   * @return {XML}
   */
  renderPermissions = () => {
    const { documentName, data } = this.props;
    const { params } = this.state;
    const permission = Object.assign([], data, params);
    return (
      <div>
        <div className={s.target}>
          Define permissions&nbsp;
          <span className={s.name}>"{documentName}"</span>:
        </div>
        <table className={s.form}>
          <thead>
            <tr>
              <th className={s.th}>Role</th>
              <th className={s.th}>Privilege</th>
            </tr>
          </thead>
          <tbody>
            { permission.map((item, key) => (
              <tr className={s.row} key={key}>
                <td className={s.cell}>{item.role}</td>
                <td className={s.cell}>
                  <select
                    autoFocus={key === 1}
                    className={s.control}
                    defaultValue={item.operations || 'None'}
                    disabled={item.role === 'Administrator'}
                    onChange={(event) => this.handleOnChangeSelect(event.target.value, key)}
                    tabIndex={key}
                  >
                    <option value="None">None</option>
                    <option value="Read">Read</option>
                    <option value="Read, Modify">Read & Modify</option>
                    <option value="All">Full</option>
                  </select>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    );
  };

  // RENDER COMPONENT

  render() {
    const { isProcessing } = this.props;
    return (
      <Modal
        caption="Permissions"
        confirmText={isProcessing ? '' : 'Save'}
        customBodyClassName={s.muted}
        isConfirmDisabled={!this.state.params.length}
        onConfirm={this.handleOnClickOnConfirm}
        onDismiss={this.handleDismiss}
      >
        { isProcessing
            ? this.renderLoader()
            : this.renderPermissions()
        }
      </Modal>
    );
  }
}

Permissions.propTypes = {
  data: PropTypes.array,
  documentId: PropTypes.string,
  documentName: PropTypes.string,
  isProcessing: PropTypes.bool,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
  onMount: PropTypes.func,
  onSubmit: PropTypes.func,
  templates: PropTypes.array,
};

Permissions.defaultProps = {
  data: [],
  templates: [],
};

export default Permissions;
