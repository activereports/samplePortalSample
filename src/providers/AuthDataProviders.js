/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as authActionsCreators from '../actions/AuthActionCreators';
import * as notificationActionCreators from '../actions/NotificationActionCreators';
import * as uiActionsCreators from '../actions/UIActionCreators';
import createDataProviders from '../utils/createDataProviders';
import LoginForm from '../components/auth/LoginForm';

class AppDataProviders extends Component {

  // Assign properties
  components = {
    [LoginForm]: () => {
      const { auth, authActions } = this.props;
      return {
        // Data
        authStatusText: auth.statusText,
        hasAuthToken: !!auth.token,
        isAuthenticated: auth.isAuthenticated,
        isAuthenticating: auth.isAuthenticating,
        // Actions
        onLoginByToken: authActions.loginByToken,
        onSubmit: authActions.logIn,
      };
    },
  };

  render() {
    return (
      <div className={this.props.className}>
        {createDataProviders(this.props.children, this.components)}
      </div>
    );
  }
}

AppDataProviders.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,

  // Action Creators
  authActions: PropTypes.object,
  notificationActions: PropTypes.object,
  uiActions: PropTypes.object,

  // Action Methods
  logIn: PropTypes.func,
  loginByToken: PropTypes.func,

  // Data
  auth: PropTypes.object,
  document: PropTypes.object,
  notification: PropTypes.object,
  ui: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  document: state.document.data,
  notification: state.notification,
  ui: state.ui,
});

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(authActionsCreators, dispatch),
  notificationActions: bindActionCreators(notificationActionCreators, dispatch),
  uiActions: bindActionCreators(uiActionsCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppDataProviders);
