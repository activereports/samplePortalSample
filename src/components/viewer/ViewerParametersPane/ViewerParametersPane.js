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
import Parameters from '../../common/Parameters';
import Button from '../../common/Button';
import s from './ViewerParametersPane.scss';

class ViewerParametersPane extends Component {

  state = { parameters: [] };

  // Actions Handlers
  handleUpdateParams = (params) => this.props.onUpdateParams(params);
  handleSubmitParams = (params) => this.props.onSubmitParams(params);

  // Event Handlers
  handleOnChangeParams = (parameters) => {
    this.setState({ parameters });
  };

  handleOnUpdateParams = (params) => {
    this.handleUpdateParams(params);
  };

  handleOnClickOnSubmit = () => {
    this.handleSubmitParams(this.state.parameters);
  };

  // Render Component
  render() {
    const { className, params, hasParameters, hasVisibleParameters, strings } = this.props;
    const isSubmitDisabled = !this.state.parameters.length;
    return hasParameters ? (
      <div className={className}>
          <div>
            <Parameters
              classControlLabel={s.label}
              classFormGroup={s.formGroup}
              data={params}
              hasVisibleData={hasVisibleParameters}
              hasData={hasParameters}
              onChangeParams={this.handleOnChangeParams}
              onUpdateParams={this.handleOnUpdateParams}
            />
            { hasVisibleParameters && (
              <div className={s.paneActions}>
                <Button
                  className={cx(s.button, s.button_primary, { [s.button_disabled]: isSubmitDisabled })}
                  disabled={isSubmitDisabled}
                  label={strings.action}
                  onClick={this.handleOnClickOnSubmit}
                />
              </div>
            )}
          </div>
      </div>
    ) : (
      <div className={className}>
        <span>{strings.noParams}</span>
      </div>
    );
  }
}

ViewerParametersPane.propTypes = {
  // Data
  className: PropTypes.string,
  hasParameters: PropTypes.bool,
  hasVisibleParameters: PropTypes.bool,
  params: PropTypes.array,
  strings: PropTypes.object,
  // Actions
  onUpdateParams: PropTypes.func,
  onSubmitParams: PropTypes.func,
};

ViewerParametersPane.defaultProps = {
  strings: {
    action: 'Update Report',
    noParams: 'There are no parameters for this document.',
  },
};

export default ViewerParametersPane;
