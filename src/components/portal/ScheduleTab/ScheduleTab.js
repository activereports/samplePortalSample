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
import BusyIndicator from '../../common/BusyIndicator';
import FontIcon from '../../common/FontIcon';
import Parameters from '../../common/Parameters';
import s from './ScheduleTab.scss';

class ScheduleTab extends Component {

  state = {
    currentDistributionParams: {},
    currentScheduleParams: {},
    isParametersPanelVisible: false,
  };

  // UTILS

  /**
   * Get deep value from object
   * @param {Object} obj
   * @param {string} graphPath
   * @return {string|null}
   */
  getValue = (obj, graphPath) => {
    const parts = graphPath.split('.');
    let root = obj;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (root[part] && root.hasOwnProperty(part)) {
        root = root[part];
      } else {
        return null;
      }
    }
    return graphPath.split('.').reduce((a, b) => a[b], obj);
  };

  /**
   * Test if a parameter is not null and not empty
   * @param {string|string[]} param
   */

  hasContent = (param) => Array.isArray(param) ? param.filter(n => n !== '').length : !!param; // eslint-disable-line react/sort-comp

  /**
   * Test if a distribution type is 'EMailDistribution'
   * @param {string} param
   */
  isEmailDistribution = (param) => param === 'EMailDistribution';

  /**
   * Test if a distribution type is 'FileShareDistribution'
   * @param {string} param
   */
  isFileShareDistribution = (param) => param === 'FileShareDistribution';

  // ACTION HANDLERS

  setScheduleParam = (param, data) => {
    const { id } = this.props;
    const { currentScheduleParams } = this.state;
    const scheduleParams = Object.assign({}, currentScheduleParams, { [param]: data });
    this.setState({ currentScheduleParams: scheduleParams });
    const params = this.assembleParams(Object.assign({}, currentScheduleParams, scheduleParams), false);
    this.props.onChangeScheduleData(params, id);
  };

  setDistributionParam = (param, data) => {
    const { id } = this.props;
    const { currentDistributionParams } = this.state;
    const distributionParams = Object.assign({}, currentDistributionParams, { [param]: data });
    this.setState({ currentDistributionParams: distributionParams });
    const params = this.assembleParams(false, Object.assign({}, currentDistributionParams, distributionParams));
    this.props.onChangeScheduleData(params, id);
  };

  assembleParams = (scheduleParams, distributionParams) => {
    const { data } = this.props;
    const currentScheduleParams = scheduleParams || this.state.currentScheduleParams;
    const currentDistributionParams = distributionParams || this.state.currentDistributionParams;
    const distribution = Object.assign({}, data.distribution, currentDistributionParams);
    const diff = Object.assign({}, currentScheduleParams, { distribution });
    return Object.assign({}, data, diff);
  };

  handleOnChangeTemplate = (event, scheduleId) => {
    const { id } = this.props;
    const templateId = event.target.value;
    this.props.onChangeScheduleTemplate(event.target.value, scheduleId);
    this.setState({
      currentScheduleParams: { templateId },
      currentDistributionParams: {},
    });
    const params = this.assembleParams({ templateId }, {});
    this.props.onChangeScheduleData(params, id);
  };

  handleOnChangeScheduleParams = (parameters) => {
    const reportParams = parameters.map(param => ({ name: param.name, values: param.values }));
    this.setScheduleParam('reportParameters', reportParams);
  };

  handleOnUpdateScheduleParams = (params) => {
    this.props.onUpdateScheduleParams(params);
  };

  handleOnClickOnParametersPanel = () => {
    this.setState({ isParametersPanelVisible: !this.state.isParametersPanelVisible });
  };

  // RENDER ASSETS

  // Render a schedule tab
  renderSchedule = () => {
    const { data, scheduleTemplates, strings } = this.props;
    const schedule = Object.assign({}, {
      id: this.getValue(data, 'id'),
      name: this.getValue(data, 'name'),
      template: this.getValue(data, 'template'),
      templateId: this.getValue(data, 'templateId'),
      documentFormat: this.getValue(data, 'documentFormat'),
      description: this.getValue(data, 'description'),
      modifiedBy: this.getValue(data, 'modifiedBy'),
      createdBy: this.getValue(data, 'createdBy'),
    }, this.state.currentScheduleParams);

    const distribution = Object.assign({}, {
      asAttachment: this.getValue(data, 'distribution.asAttachment'),
      asLink: this.getValue(data, 'distribution.asLink'),
      attachmentTemplate: this.getValue(data, 'distribution.attachmentTemplate'),
      baseUri: this.getValue(data, 'distribution.baseUri'),
      existingBehavior: this.getValue(data, 'distribution.existingBehavior'),
      extensionBehavior: this.getValue(data, 'distribution.extensionBehavior'),
      fileName: this.getValue(data, 'distribution.fileName'),
      messageBody: this.getValue(data, 'distribution.messageBody'),
      password: this.getValue(data, 'distribution.password'),
      path: this.getValue(data, 'distribution.path'),
      to: this.getValue(data, 'distribution.to'),
      type: this.getValue(data, 'distribution.type'),
      user: this.getValue(data, 'distribution.user'),
      subject: this.getValue(data, 'distribution.subject'),
    }, this.state.currentDistributionParams);

    const template = {
      name: this.getValue(schedule, 'template.name'),
      documentFormat: this.getValue(schedule, 'template.documentFormat'),
      description: this.getValue(schedule, 'template.description'),
      distribution: {
        asAttachment: this.getValue(schedule, 'template.distribution.asAttachment'),
        asLink: this.getValue(schedule, 'template.distribution.asLink'),
        attachmentTemplate: this.getValue(schedule, 'template.distribution.attachmentTemplate'),
        baseUri: this.getValue(schedule, 'template.distribution.baseUri'),
        existingBehavior: this.getValue(schedule, 'template.distribution.existingBehavior'),
        extensionBehavior: this.getValue(schedule, 'template.distribution.extensionBehavior'),
        fileName: this.getValue(schedule, 'template.distribution.fileName'),
        messageBody: this.getValue(schedule, 'template.distribution.messageBody'),
        password: this.getValue(schedule, 'template.distribution.password'),
        path: this.getValue(schedule, 'template.distribution.path'),
        to: this.getValue(schedule, 'template.distribution.to'),
        type: this.getValue(schedule, 'template.distribution.type'),
        user: this.getValue(schedule, 'template.distribution.user'),
        subject: this.getValue(schedule, 'template.distribution.subject'),
      },
    };
    const isEmailDistribution = this.hasContent(template.distribution.type)
      ? this.isEmailDistribution(template.distribution.type)
      : this.isEmailDistribution(distribution.type);
    const isFileShareDistribution = this.hasContent(template.distribution.type)
      ? this.isFileShareDistribution(template.distribution.type)
      : this.isFileShareDistribution(distribution.type);
    const distributionAttachment = isEmailDistribution
      ? 'Attach'
      : 'Link';

    return (
      <table className={cx(s.table)}>

        <tbody>
        <tr className={s.row}>
          <td className={s.cell}>Choose schedule</td>
          <td className={s.cell}>
            <select className={s.control} value={schedule.templateId} onChange={(event) => this.handleOnChangeTemplate(event, schedule.id)}>
              {scheduleTemplates.length && scheduleTemplates.map((scheduleTemplate, key) =>
                <option value={scheduleTemplate._id} key={key}>{scheduleTemplate.name}</option>
              )}
            </select>
          </td>
        </tr>

        <tr className={s.row}>
          <td className={s.cell}>Format</td>
          <td className={s.cell}>
            <select
              className={s.control}
              value={template.documentFormat || schedule.documentFormat}
              title={this.hasContent(template.documentFormat) && strings.predefinedParameter || ''}
              disabled={this.hasContent(template.documentFormat)}
              onChange={(event) => this.setScheduleParam('documentFormat', event.target.value)}
            >
              <option label="Select a document format" />
              <option value="PDF">PDF document</option>
              <option value="Excel">Excel file (xls)</option>
              <option value="Mht">MHT document</option>
              <option value="Image">Image file</option>
              <option value="Word">Word document</option>
              <option value="XML">XML file (xml)</option>
            </select>
          </td>
        </tr>

        <tr className={s.row}>
          <td className={s.cell}>Delivery Type</td>
          <td className={s.cell}>
            <select
              className={s.control}
              value={template.distribution.type || distribution.type}
              title={this.hasContent(template.distribution.type) && strings.predefinedParameter || ''}
              disabled={this.hasContent(template.distribution.type)}
              onChange={(event) => this.setDistributionParam('type', event.target.value)}
            >
              <option label="Select a delivery type" />
              <option value="EMailDistribution">Email</option>
              <option value="FileShareDistribution">Windows file share</option>
            </select>
          </td>
        </tr>
        </tbody>

        {isEmailDistribution && (
          <tbody>
          <tr className={s.row}>
            <td className={s.cell}>Email report to</td>
            <td className={s.cell}>
              <input
                className={s.control} type="email" placeholder="Enter email address"
                value={template.distribution.to && template.distribution.to.join(', ') || distribution.to && distribution.to.join(', ')}
                title={this.hasContent(template.distribution.to) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.to)}
                onChange={(event) => this.setDistributionParam('to', event.target.value.split(/\s*,\s*/))}
              />
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>Subject</td>
            <td className={s.cell}>
              <input
                className={s.control} type="text" placeholder="Subject"
                value={template.distribution.subject || distribution.subject || ''}
                title={this.hasContent(template.distribution.subject) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.subject)}
                onChange={(event) => this.setDistributionParam('subject', event.target.value)}
              />
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>Body</td>
            <td className={s.cell}>
              <textarea
                className={s.control} rows="3"
                value={template.distribution.messageBody || distribution.messageBody || ''}
                title={this.hasContent(template.distribution.messageBody) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.messageBody)}
                onChange={(event) => this.setDistributionParam('messageBody', event.target.value)}
              />
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>Include report</td>
            <td className={s.cell}>
              <select
                className={s.control}
                value={distributionAttachment}
                title={this.hasContent(template.distribution.asAttachment) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.asAttachment) || this.hasContent(template.distribution.asLink)}
                onChange={(event) => {
                  if (event.target.value === 'Attach') {
                    this.setDistributionParam('asAttachment', true);
                    this.setDistributionParam('asLink', false);
                  } else {
                    this.setDistributionParam('asLink', true);
                    this.setDistributionParam('asAttachment', false);
                  }
                }}
              >
                <option value="Attach">As attachment</option>
                <option value="Link">As link</option>
              </select>
            </td>
          </tr>
          </tbody>
        )}

        {isFileShareDistribution && (
          <tbody>
          <tr className={s.row}>
            <td className={s.cell}>File name</td>
            <td className={s.cell}>
              <input
                className={s.control} type="text" placeholder="File name"
                value={template.distribution.fileName || distribution.fileName || ''}
                title={this.hasContent(template.distribution.fileName) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.fileName)}
                onChange={(event) => this.setDistributionParam('fileName', event.target.value)}
              />
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>Add file extension</td>
            <td className={s.cell}>
              <select
                className={s.control}
                value={template.distribution.extensionBehavior || distribution.extensionBehavior}
                title={this.hasContent(template.distribution.extensionBehavior) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.extensionBehavior)}
                onChange={(event) => this.setDistributionParam('extensionBehavior', event.target.value)}
              >
                <option value="1">Yes</option>
                <option value="2">No</option>
              </select>
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>Path</td>
            <td className={s.cell}>
              <input
                className={s.control} type="text"
                value={template.distribution.path || distribution.path || ''}
                title={this.hasContent(template.distribution.path) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.path)}
                onChange={(event) => this.setDistributionParam('path', event.target.value)}
              />
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>User name</td>
            <td className={s.cell}>
              <input
                className={s.control} type="text" placeholder="User name"
                value={template.distribution.user || distribution.user || ''}
                title={this.hasContent(template.distribution.user) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.user)}
                onChange={(event) => this.setDistributionParam('user', event.target.value)}
              />
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>Password</td>
            <td className={s.cell}>
              <input
                className={s.control} type="password" placeholder="Password"
                value={template.distribution.password || distribution.password || ''}
                title={this.hasContent(template.distribution.password) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.password)}
                onChange={(event) => this.setDistributionParam('password', event.target.value)}
              />
            </td>
          </tr>
          <tr className={s.row}>
            <td className={s.cell}>Overwrite</td>
            <td className={s.cell}>
              <select
                className={s.control}
                value={distribution.existingBehavior}
                title={this.hasContent(template.distribution.existingBehavior) && strings.predefinedParameter || ''}
                disabled={this.hasContent(template.distribution.existingBehavior)}
                onChange={(event) => this.setDistributionParam('existingBehavior', event.target.value)}
              >
                <option value="1">Overwrite the existing file if it exists</option>
                <option value="2">Increment filename as newer versions are added</option>
              </select>
            </td>
          </tr>
          </tbody>
        )}
      </table>
    );
  };

  renderParameters = () => {
    const { documentParameters, isProcessingParameters, isRequestingParameters, hasDocumentParameters, hasVisibleParameters } = this.props;
    const { isParametersPanelVisible } = this.state;
    return (
      <div className={s.parameters}>
        { isRequestingParameters && !isParametersPanelVisible && (
          <div className={s.spinner}>
            <FontIcon name="cog" spin />
            Checking parameters...
          </div>
        )}
        { hasDocumentParameters && !isRequestingParameters && (
          <div>
            { isParametersPanelVisible ? (
              <div>
                { /* Show busy indicator while processing */
                  isProcessingParameters && <BusyIndicator className={s.busy} spinner="cog" />
                }
                <div className={s.caption} onClick={this.handleOnClickOnParametersPanel}>
                  <span>Specify report parameters</span>
                  <FontIcon name="caret-down" />
                </div>
                <Parameters
                  classComponent={s.parametersPanel}
                  classControlLabel={s.label}
                  classFormGroup={s.formGroup}
                  data={documentParameters}
                  hasVisibleData={hasVisibleParameters}
                  hasData={hasDocumentParameters}
                  onChangeParams={this.handleOnChangeScheduleParams}
                  onUpdateParams={this.handleOnUpdateScheduleParams}
                />
              </div>
            ) : (
              <div className={s.caption} onClick={this.handleOnClickOnParametersPanel}>
                <span>Specify report parameters</span>
                <FontIcon name="caret-right" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // RENDER COMPONENTS

  render() {
    const { isProcessing, className } = this.props;
    return (
      <div className={ cx(s.form, className) }>
        { isProcessing && <BusyIndicator className={s.busy} /> }
        { this.renderSchedule() }
        { this.renderParameters() }
      </div>
    );
  }
}

ScheduleTab.propTypes = {
  // Data
  className: PropTypes.string,
  data: PropTypes.object,
  documentParameters: PropTypes.array,
  hasDocumentParameters: PropTypes.bool,
  hasVisibleParameters: PropTypes.bool,
  id: PropTypes.number,
  isProcessing: PropTypes.bool,
  isProcessingParameters: PropTypes.bool,
  isRequestingParameters: PropTypes.bool,
  scheduleParameters: PropTypes.array,
  scheduleTemplates: PropTypes.array,
  strings: PropTypes.object,
  // Action
  onChangeScheduleData: PropTypes.func,
  onChangeScheduleTemplate: PropTypes.func,
  onUpdateScheduleParams: PropTypes.func,
};

ScheduleTab.defaultProps = {
  data: {},
  scheduleTemplates: [],
  strings: {
    predefinedParameter: 'This parameter is predefined by administrator',
  },
};

export default ScheduleTab;
