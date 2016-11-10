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
import Multiselect from 'react-select';
import s from './Parameters.scss';

class Parameters extends Component {

  state = { values: [] };

  componentWillMount = () => {
    this.setState({
      values: this.props.data.map((param, key) =>
        this.getInitialParameterValues(param, key)),
    });
  };

  componentWillReceiveProps(nextProps) {
    const values = this.state.values.slice();
    const data = nextProps.data || [];
    values.forEach((param, key) => {
      const nextPropsData = data[key];
      const stateValue = param && param.values || null;
      if (stateValue !== nextPropsData.values) {
        values[key] = this.getInitialParameterValues(nextPropsData, key, data);
        this.setState({ values });
      }
    });
  }

  // Utils
  getParameterValues = (values = [], isMultiValue = false) => {
    let result = [];
    if (isMultiValue) {
      // convert array object to flat array
      result = values.length && values.map(item => item.value) || [];
    } else {
      // convert object to flat array
      result = values && values.value ? values.value.split() : [];
    }
    return result;
  };

  getInitialParameterValues = (param, key, parameters) => {
    const data = parameters || this.props.data;
    const initialValues = data[key].availableValues.filter(item => data[key].values.find(value => value === item.value));
    return param.multiValue ? initialValues : initialValues.length && initialValues[0] || null;
  };

  hasDependencies = (parameters) => !!parameters.filter(param => param.parameterState.hasOutstandingDependencies).length;

  // Actions Handlers
  handleChangeParams = (params) => this.props.onChangeParams(params);
  handleUpdateParams = (params) => this.props.onUpdateParams(params);

  // Events Handlers
  handleOnCloseSelectMenu = (key, isMultiValue) => {
    const stateValues = this.state.values.slice();
    const stateParams = this.props.data.slice();
    const hasChanges = !!stateParams.filter((param, id) => {
      const unspecifiedVal = 'Unspecified';
      const stateValue = stateValues[id] && stateValues[id].length
        ? stateValues[id].map(i => i.value).toString()
        : stateValues[id] && stateValues[id].value || unspecifiedVal;
      const paramValue = param.values.toString().length
        ? param.values.toString()
        : unspecifiedVal;
      return paramValue !== stateValue;
    }).length;

    if (hasChanges) {
      stateParams[key].values = this.getParameterValues(stateValues[key], isMultiValue);
      stateParams[key].parameterState.expectValue = false;
      this.handleChangeParams(stateParams);
      if (this.hasDependencies(stateParams) || stateParams[key].dependentParameters) {
        this.handleUpdateParams(stateParams);
      }
    }
  };

  handleOnChangeSelect = (values, key, isMulti) => {
    const stateValues = this.state.values.slice();
    if (isMulti) {
      stateValues[key] = values || [];
    } else {
      stateValues[key] = values ? {
        value: values.value,
        label: values.label,
      } : {};
    }
    this.setState({ values: stateValues });
  };

  // Render assets
  renderFormControl = (param, key) => {
    const { classFormGroup, classControlLabel, strings } = this.props;
    const { values } = this.state;
    return (
      <div
        key={key}
        className={cx(classFormGroup, s.group, {
          [s.group_hidden]: param.hidden,
          [s.group_success]: param.parameterState.ok,
          [s.group_error]: !param.parameterState.ok,
        })}
      >
        <label className={ cx(s.label, classControlLabel) }>
          {param.prompt}
        </label>
        <Multiselect
          className={s.multiselect}
          disabled={!param.availableValues.length}
          multi={param.multiValue}
          openAfterFocus
          backspaceRemoves={false}
          options={param.availableValues}
          value={values[key]}
          onBlur={() => this.handleOnCloseSelectMenu(key, param.multiValue)}
          onChange={data => this.handleOnChangeSelect(data, key, param.multiValue)}
          onClose={() => this.handleOnCloseSelectMenu(key, param.multiValue)}
        />
        <div className={s.help}>
          {param.parameterState.expectValue && <span>{strings.expectValue}</span>}
          {param.parameterState.hasOutstandingDependencies && <span>{strings.hasOutstandingDependencies}</span>}
        </div>
      </div>
    );
  };

  // Render component
  render() {
    const { classComponent, data, strings, hasData, hasVisibleData } = this.props;
    return hasData ? (
      <div className={classComponent}>
        { data.map((param, key) => this.renderFormControl(param, key)) }
        { !hasVisibleData && strings.hiddenParams }
      </div>
    ) : (
      <div className={classComponent}>
        { strings.noParams }
      </div>
    );
  }
}

Parameters.propTypes = {
  // Data
  classComponent: PropTypes.string,
  classControlLabel: PropTypes.string,
  classFormGroup: PropTypes.string,
  data: PropTypes.array,
  hasData: PropTypes.bool,
  hasVisibleData: PropTypes.bool,
  strings: PropTypes.object,
  // Actions
  onChangeParams: PropTypes.func,
  onSubmitParams: PropTypes.func,
  onUpdateParams: PropTypes.func,
};

Parameters.defaultProps = {
  strings: {
    expectValue: 'Value expected',
    hasOutstandingDependencies: 'Has outstanding dependencies',
    hiddenParams: 'There is no direct control over the parameters that are provided.',
    noParams: 'There are no parameters for this document.',
  },
};

export default Parameters;
