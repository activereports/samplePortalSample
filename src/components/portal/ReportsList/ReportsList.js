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
import { formatDateString } from '../../../utils/index';
import FontIcon from '../../common/FontIcon';
import s from './ReportsList.scss';

class ReportsList extends Component {

  // ACTIONS HANDLERS

  handleOnDoubleClickOnDoc = () => this.props.onShowViewer();
  handleOnClickOnViewer = () => this.props.onShowViewer();
  handleOpenContextMenu = (context) => this.props.onOpenContextMenu(context);

  // EVENT HANDLERS

  handleOnMouseDownOnDoc = (docId) => {
    if (this.props.document._id !== docId) {
      this.props.onChangeDocument(docId);
    }
  };

  handleOnContextMenu = (event) => {
    event.preventDefault();
    const context = {
      clientX: event.nativeEvent.clientX,
      clientY: event.nativeEvent.clientY,
    };
    this.handleOpenContextMenu(context);
  };

  // RENDER ASSETS

  /**
   * Render Report Item
   * @return {XML}
   */
  renderReportItem(document, isActive) {
    const meta = document.$metadata;
    const { strings } = this.props;
    const isFavorited = document.isFavorited || false;
    const isParametrized = document.isParametrized || false;
    return (
      <tr
        className={cx(s.row, { [s.row_active]: isActive })}
        key={document._id}
        onMouseDown={() => this.handleOnMouseDownOnDoc(document._id)}
        onDoubleClick={this.handleOnDoubleClickOnDoc}
        onContextMenu={this.handleOnContextMenu}
      >
        <td className={ cx(s.cell, s.cell_title) }>
          <span className={s.link} onClick={this.handleOnClickOnViewer}>
            { document.name || 'Untitled' }
          </span>
          {isFavorited && <FontIcon className={s.meta} title={strings.reportsList.favourited} name="star" />}
          {isParametrized && <FontIcon className={s.meta} title={strings.reportsList.parametrized} name="list-alt" />}
          <FontIcon className={s.external} name="external-link" />
        </td>
        <td className={s.cell}>{ formatDateString(meta.created) }</td>
        <td className={s.cell}>{ formatDateString(meta.modified) }</td>
        <td className={s.cell}>{ meta.modifiedBy }</td>
      </tr>
    );
  }

  // RENDER COMPONENT

  render() {
    const { currentDocId, documents, filterText } = this.props;
    const hasFilterText = !!filterText;

    // Filter documents list if needed
    const filteredDocuments = hasFilterText
      ? documents.filter(doc => doc.name.toLowerCase().includes(filterText))
      : documents;

    return filteredDocuments.length ? (
      /* Render List */
      <div className={s.root}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.th}>Report name</th>
              <th className={s.th}>Created</th>
              <th className={s.th}>Last Modified</th>
              <th className={s.th}>Modified By</th>
            </tr>
          </thead>
          <tbody>
            { filteredDocuments.map(item =>
                this.renderReportItem(item, item._id === currentDocId)
            )}
          </tbody>
        </table>
      </div>
    ) : (
      /* Render Dummy */
      <div>
        No reports found containing: "{filterText}"
      </div>
    );
  }
}

ReportsList.propTypes = {
  // Data
  currentDocId: PropTypes.string,
  document: PropTypes.object,
  documents: PropTypes.array,
  filterText: PropTypes.string,
  strings: PropTypes.object,
  // Actions
  onChangeDocument: PropTypes.func,
  onShowViewer: PropTypes.func,
  onOpenContextMenu: PropTypes.func,
};

ReportsList.defaultProps = {
  strings: {
    reportsList: {
      parametrized: 'A parameterized report that uses input values to complete report processing',
      favourited: 'Starred',
    },
  },
};

export default ReportsList;
