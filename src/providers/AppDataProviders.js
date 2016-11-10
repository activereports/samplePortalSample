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
import * as notificationActionCreators from '../actions/NotificationActionCreators';
import createDataProviders from '../utils/createDataProviders';
import BusyIndicator from '../components/common/BusyIndicator';
import Notifications from '../components/common/Notifications';

class AppDataProviders extends Component {

  // Assign properties
  components = {

    [BusyIndicator]: () => {
      const { ui } = this.props;
      return ui.isBusy ? {} : null;
    },

    [Notifications]: () => {
      const { notification, notificationActions } = this.props;
      return {
        message: notification.message,
        description: notification.description,
        isVisible: notification.visibility,
        onDismiss: notificationActions.hideNotification,
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
  children: PropTypes.element,
  className: PropTypes.string,
  notification: PropTypes.object,
  notificationActions: PropTypes.object,
  ui: PropTypes.object,
};

const mapStateToProps = (state) => ({
  notification: state.notification,
  ui: state.ui,
});

const mapDispatchToProps = (dispatch) => ({
  notificationActions: bindActionCreators(notificationActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppDataProviders);
