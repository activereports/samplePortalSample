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
import { isNotEmptyObject } from '../../../utils/index';
import Dropdown from '../../common/Dropdown';
import DropdownItem from '../../common/DropdownItem';
import FontIcon from '../../common/FontIcon';
import Modal from '../../common/Modal';
import ScheduleTab from '../ScheduleTab';
import s from './Schedule.scss';

class Schedule extends Component {

  state = {
    currentScheduleIdx: 0,
    scheduleParams: [],
  };

  // COMPONENT LIFECYCLE

  componentDidMount = () => this.handleOnMount();

  // ACTION HANDLERS

  handleOnChangeTab = (scheduleData) => this.props.onChangeTab(scheduleData);
  handleOnCreateTask = (templateId, documentId) => this.props.onCreateTask(documentId, templateId);
  handleOnDismiss = () => this.props.onDismiss();
  handleOnMount = () => this.props.onMount();
  handleOnRemoveTask = (scheduleId) => this.props.onRemoveTask(scheduleId);
  handleOnSubmit = (scheduleParams) => this.props.onSubmit(scheduleParams);
  handleChangeScheduleTemplate = (targetId, scheduleId) => this.props.onChangeScheduleTemplate(targetId, scheduleId);
  handleUpdateScheduleParams = (id, params) => this.props.onUpdateScheduleParams(id, params);

  // EVENTS HANDLERS

  /**
   * Handles click on Remove of Schedule Tab
   * @params {string} scheduleId - Schedule ID
   */
  handleOnClickOnRemove = (scheduleId) => {
    this.setState({ currentScheduleIdx: 0, scheduleParams: [] });
    this.handleOnRemoveTask(scheduleId);
    this.forceUpdate();
  };

  /**
   * Handles change of Schedule data
   * @params {Object} data - Schedule Data
   * @params {string} id - Schedule ID
   */
  handleOnChangeScheduleData = (data, id) => {
    const { scheduleParams } = this.state;
    this.setState({ scheduleParams: Object.assign({}, scheduleParams, { [id]: data }) });
  };

  /**
   * Handles update of Schedule parameters
   * @params {Object} params - Schedule parameters
   */
  handleOnUpdateScheduleParams = (params) => {
    const id = this.props.documentId;
    this.handleUpdateScheduleParams(id, params);
  };

  /**
   * Handles click on confirm
   */
  handleOnClickOnConfirm = () => {
    const { scheduleParams } = this.state;
    this.setState({ scheduleParams: [] });
    this.handleOnSubmit(scheduleParams);
  };

  /**
   * Handles click on specific item in the navigation menu list
   * @param {string} key
   */
  handleOnClickOnNav = (key) => {
    const scheduleData = this.props.data[key];
    this.setState({ currentScheduleIdx: key });
    this.handleOnChangeTab(scheduleData);
  };

  // RENDER ASSETS

  /**
   * Render Loading Icon
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
   * Render Panel Caption
   * @return {XML}
   */
  renderCaption = () => {
    const { documentName } = this.props;
    return (
      <div className={s.target}>
        Define schedule properties for&nbsp;
        <span className={s.name}>"{documentName}"</span>:
      </div>
    );
  };

  /**
   * Render Nav Tabs
   * @return {XML}
   */
  renderNav = () => {
    const { data, documentId, templates } = this.props;
    const currentScheduleIdx = this.state.currentScheduleIdx;
    const scheduleParams = this.state.scheduleParams;
    return (
      <ul className={s.nav} role="tablist">
        { data.map((schedule, key) => (
            <li className={ cx(s.navItem, { [s.navItem_active]: currentScheduleIdx === key }) } key={key}>
              <div
                className={s.navLink}
                role="tab"
                onClick={() => this.handleOnClickOnNav(key)}
              >
                {isNotEmptyObject(scheduleParams[key]) && <FontIcon className={s.modified} name="pencil" />}
                <span>{schedule.name}</span>
                <div
                  role="button"
                  className={s.remove}
                  title="Remove"
                  onClick={() => this.handleOnClickOnRemove(schedule.id)}
                >
                  <FontIcon name="trash-o" />
                </div>
              </div>
            </li>
          ))
        }
        { templates.length ? (
          <li className={s.navItem}>
            <div className={s.navLink} onClick={() => this.handleOnCreateTask(templates[0]._id, documentId)}>
              <FontIcon name="plus-circle" size="lg" />
            </div>
          </li>
        ) : null }
      </ul>
    );
  };

  /**
   * Render Schedule Tabs
   * @return {XML}
   */
  renderSchedules = () => {
    const { data, documentId, documentName, templates, documentParameters, hasDocumentParameters, hasVisibleParameters,
      isProcessingTemplate, isProcessingParameters, isRequestingParameters } = this.props;
    return data.length ? (
      <div>
        { this.renderCaption() }
        { this.renderNav() }
        { data.map((tab, key) => {
          const isHidden = this.state.currentScheduleIdx !== key;
          return !isHidden && (
            <ScheduleTab
              className={cx({ [s.hidden]: isHidden })}
              data={data[key]}
              documentParameters={documentParameters}
              hasDocumentParameters={hasDocumentParameters}
              hasVisibleParameters={hasVisibleParameters}
              id={key}
              isProcessing={isProcessingTemplate}
              isProcessingParameters={isProcessingParameters}
              isRequestingParameters={isRequestingParameters}
              key={key}
              onChangeScheduleData={this.handleOnChangeScheduleData}
              onChangeScheduleTemplate={this.handleChangeScheduleTemplate}
              onUpdateScheduleParams={this.handleOnUpdateScheduleParams}
              scheduleTemplates={templates}
            />
          );
        })}
      </div>
    ) : (
      <div className={s.empty}>
        <div>
          There is no scheduled task associated with&nbsp;
          <span className={s.name}>"{documentName}"</span>.
        </div>
        { templates.length ? (
          <div className={s.dropdown}>
            <Dropdown style={s} label="Add scheduled task" icon="calendar-plus-o">
              { templates.map((template, key) =>
                  <DropdownItem
                    key={key}
                    style={s}
                    label={template.name}
                    description={template.description}
                    onClick={() => this.handleOnCreateTask(template._id, documentId)}
                  />
              )}
            </Dropdown>
          </div>
        ) : null }
      </div>
    );
  };

  // RENDER COMPONENT

  render() {
    const { isProcessing } = this.props;
    const { scheduleParams } = this.state;
    return (
      <Modal
        caption="Scheduling"
        confirmText="Update"
        customBodyClassName={s.muted}
        closeOnConfirm
        isConfirmDisabled={!isNotEmptyObject(scheduleParams)}
        onConfirm={this.handleOnClickOnConfirm}
        onDismiss={this.handleOnDismiss}
      >
        { isProcessing
            ? this.renderLoader()
            : this.renderSchedules()
        }
      </Modal>
    );
  }
}

Schedule.propTypes = {
  // Data
  data: PropTypes.array,
  documentId: PropTypes.string,
  documentName: PropTypes.string,
  documentParameters: PropTypes.array,
  hasDocumentParameters: PropTypes.bool,
  hasVisibleParameters: PropTypes.bool,
  isProcessing: PropTypes.bool,
  isProcessingParameters: PropTypes.bool,
  isProcessingTemplate: PropTypes.bool,
  isRequestingParameters: PropTypes.bool,
  templates: PropTypes.array,

  // Actions
  onChangeScheduleTemplate: PropTypes.func,
  onChangeTab: PropTypes.func,
  onCreateTask: PropTypes.func,
  onDismiss: PropTypes.func,
  onMount: PropTypes.func,
  onRemoveTask: PropTypes.func,
  onSubmit: PropTypes.func,
  onUpdateScheduleParams: PropTypes.func,
};

Schedule.defaultProps = {
  data: [],
  templates: [],
};

export default Schedule;
