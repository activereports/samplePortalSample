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
import PropertiesPane from '../PropertiesPane';
import s from './PropertiesDock.scss';

class PropertiesDock extends Component {

  // ACTIONS HANDLERS

  handleOnShowRevisions = () => this.props.onShowRevisions();
  handleOnHideRevisions = () => this.props.onHideRevisions();
  handleOnHideProperties = () => this.props.onHideProperties();

  // RENDER COMPONENT

  render() {
    const { hasDataToDisplay, isPropertiesVisible } = this.props;
    const classes = cx(s.root, { [s.root_hidden]: !isPropertiesVisible });
    return hasDataToDisplay ? (
      /* Render Properties Panel */
      <div className={classes}>
        <PropertiesPane
          {...this.props}
          onShowRevisions={this.handleOnShowRevisions}
          onHideRevisions={this.handleOnHideRevisions}
          onHideProperties={this.handleOnHideProperties}
        />
      </div>
    ) : (
      /* Render Dummy Panel */
      <div className={classes}>
        <div className={s.dummy}>
          <div className={s.icon}>
            <FontIcon name="stack">
              <FontIcon name="circle" stack="2x" />
              <FontIcon name="check" stack="1x" inverse />
            </FontIcon>
          </div>
          <div className={s.caption}>
            Select a report to view its details.
          </div>
        </div>
      </div>
    );
  }
}

PropertiesDock.propTypes = {
  document: PropTypes.object,
  hasDataToDisplay: PropTypes.bool,
  isPropertiesVisible: PropTypes.bool,
  onHideProperties: PropTypes.func,
  onHideRevisions: PropTypes.func,
  onShowRevisions: PropTypes.func,
};

export default PropertiesDock;
