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
import Modal from '../../common/Modal';
import s from './NewReport.scss';

class NewReport extends Component {

  state = { modelId: null };

  // COMPONENT LIFECYCLE

  componentDidMount = () => this.handleMount();

  // ACTION HANDLERS

  handleDismiss = () => this.props.onDismiss();
  handleMount = () => this.props.onMount();
  handleSelect = (modelId) => this.setState({ modelId });

  // EVENTS HANDLERS

  handleConfirm = () => {
    this.props.onSubmit(this.state.modelId);
    this.handleDismiss(); // Dismiss the modal after submit
  };

  // RENDER COMPONENT

  render() {
    const { isProcessing, models } = this.props;
    const { modelId } = this.state;
    return (
      <Modal
        caption="Create Report"
        customBodyClassName={s.muted}
        isConfirmDisabled={!modelId}
        onConfirm={this.handleConfirm}
        onDismiss={this.handleDismiss}
      >
        <div>
          <div className={s.target}>
            Select a data model from the list below that contains the data you want to use in your report:
          </div>
          <div className={s.models}>
            { isProcessing
                ? <BusyIndicator className={s.loader} />
                : models.map((model, key) => (
                  <div className={s.model} key={key}>
                    <div
                      className={ cx(s.item, { [s.item_active]: modelId === model.id }) }
                      key={key}
                      onClick={() => this.handleSelect(model.id)}
                    >
                      <div className={s.itemIcon}>
                        <FontIcon name="database" />
                      </div>
                      <div className={s.itemLabel} title={model.name}>
                        <span>{model.name}</span>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </Modal>
    );
  }
}

NewReport.propTypes = {
  isProcessing: PropTypes.bool,
  models: PropTypes.array,
  onDismiss: PropTypes.func,
  onMount: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default NewReport;
