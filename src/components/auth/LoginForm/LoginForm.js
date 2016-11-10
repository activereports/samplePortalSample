/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { Component, PropTypes } from 'react';
import FontIcon from '../../common/FontIcon';
import s from './LoginForm.scss';

class LoginForm extends Component {

  state = {
    email: '',
    password: '',
    isRemember: false,
  };

  componentDidMount() { this.checkAuth(); }
  componentDidUpdate() { this.checkAuth(); }

  // Utils

  redirect = (path) => window.location.replace(path);

  checkAuth = () => {
    const { location, hasAuthToken, isAuthenticated, isAuthenticating } = this.props;
    if (isAuthenticated) {
      if (location && location.state && location.state.nextPathname) {
        const path = this.context.router.createPath({
          pathname: location.state.nextPathname,
          query: location.state.query || {},
        });
        this.redirect(path);
      } else {
        this.redirect('/');
      }
    } else if (!isAuthenticating && hasAuthToken) {
      this.handleLoginByToken();
    }
  };

  // Action Handlers
  handleSubmit = (event) => {
    const { email, password, isRemember } = this.state;
    event.preventDefault();
    event.stopPropagation();
    this.props.onSubmit(email, password, isRemember);
  };

  handleLoginByToken = () => {
    this.props.onLoginByToken();
  };

  // Event Handlers
  handleOnChangeEmail = (event) => this.setState({ email: event.target.value });
  handleOnChangePassword = (event) => this.setState({ password: event.target.value });
  handleOnChangeRemember = (event) => this.setState({ isRemember: event.target.value });
  handleOnSubmit = (event) => this.handleSubmit(event);

  // Render Assets
  renderEmailGroup = () => (
    <div className={s.group}>
      <label className={s.label}>
        Login
      </label>
      <input
        className={s.input}
        onChange={this.handleOnChangeEmail}
        placeholder="Enter your username"
        required="true"
        type="text"
      />
    </div>
  );

  renderPasswordGroup = () => (
    <div className={s.group}>
      <label className={s.label}>
        Password
      </label>
      <input
        className={s.input}
        onChange={this.handleOnChangePassword}
        placeholder="Enter your password"
        required="true"
        type="password"
      />
    </div>
  );

  renderActionsGroup = () => (
    <div className={s.group}>
      <div className={s.row}>
        <div className={s.column}>
          <div className={s.checkbox}>
            <label className={s.label}>
              <input
                className={s.checkbox}
                type="checkbox"
                defaultChecked={this.state.isRemember}
                onChange={this.handleOnChangeRemember}
              />
              Keep me logged in
            </label>
          </div>
        </div>
        <div className={s.column}>
          <button className={s.button} type="submit">
            {this.props.isAuthenticating
              ? <FontIcon name="spinner" spin />
              : 'Log in'
            }
          </button>
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <form onSubmit={this.handleOnSubmit}>
        {this.renderEmailGroup()}
        {this.renderPasswordGroup()}
        {this.renderActionsGroup()}
        <div className={s.status}>
          {this.props.authStatusText}
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  authStatusText: PropTypes.string,
  hasAuthToken: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
  isAuthenticating: PropTypes.bool,
  location: PropTypes.object,
  onLoginByToken: PropTypes.func,
  onSubmit: PropTypes.func,
  router: PropTypes.object,
};

LoginForm.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default LoginForm;
