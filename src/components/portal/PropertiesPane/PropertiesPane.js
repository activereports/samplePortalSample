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
import s from './PropertiesPane.scss';

class PropertiesPane extends Component {

  // ACTIONS HANDLERS

  handleOnShowRevisions = () => this.props.onShowRevisions();
  handleOnHideRevisions = () => this.props.onHideRevisions();
  handleOnHideProperties = () => this.props.onHideProperties();

  // RENDER ASSETS

  /**
   * Render Details Tab
   * @return {XML}
   */
  renderDetailsTabPane = () => {
    const { document, locale } = this.props;
    return (
      <div className={s.panel} role="tabpanel">
        <div className={s.properties}>
          <table className={s.table}>
            <tbody>
            <tr className={s.row}>
              <td className={s.cell}>Owner</td>
              <td className={s.cell}>
                <span className={s.username}>
                  {document.$metadata.createdBy}
                </span>
              </td>
            </tr>
            <tr className={s.row}>
              <td className={s.cell}>Created</td>
              <td className={s.cell}>
                {formatDateString(document.$metadata.created, locale)}
              </td>
            </tr>
            <tr className={s.row}>
              <td className={s.cell}>Modified</td>
              <td className={s.cell}>
                {formatDateString(document.$metadata.modified, locale)}
              </td>
            </tr>
            <tr className={s.row}>
              <td className={s.cell}>Modified by</td>
              <td className={s.cell}>
                <span className={s.username}>
                  {document.$metadata.modifiedBy}
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className={s.description}>
          <div>{document.description}</div>
        </div>
      </div>
    );
  };

  /**
   * Render Revisions Tab
   * @return {XML}
   */
  renderRevisionsTabPane = () => {
    const { documentVersions, isProcessingRevisions, locale } = this.props;
    return isProcessingRevisions ? (
      <div className={s.panel} role="tabpanel">
        <FontIcon className={s.spinner} name="spinner" spin size="2x" />
      </div>
    ) : (
      <div className={s.panel} role="tabpanel">
        <table className={s.revisions}>
          <tbody>
          {documentVersions.map(revision => (
            <tr className={s.revisionsRow} key={revision._version}>
              <td className={s.revisionsCell}>
                {revision._version}
              </td>
              <td className={s.revisionsCell}>
                <div className={s.revisionsCellAuthor}>
                  Modified by <span className={s.username}>{revision.$metadata.modifiedBy}</span>
                </div>
                <div className={s.revisionsCellDate}>
                  {formatDateString(revision.$metadata.modified, locale)}
                </div>
              </td>
              <td className={s.revisionsCell}>
                <div className={s.button} role="button">
                  <FontIcon name="eye" />
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  };

  // RENDER COMPONENT

  render() {
    const { document, isRevisionsVisible } = this.props;
    return (
      <div className={s.pane}>
        <div className={s.head}>
          <div className={s.title}>
            <FontIcon className={s.icon} name="file" />
            <span className={s.caption}>{document.name}</span>
          </div>
          <div className={s.dismiss} role="button" onClick={this.handleOnHideProperties}>
            <FontIcon name="times" />
          </div>
        </div>
        <div className={s.body}>
          <ul className={s.tabs} role="tablist">
            <li
              className={ cx(s.tab, { [s.tab_active]: !isRevisionsVisible }) }
              onClick={this.handleOnHideRevisions}
            >
              <div className={s.tabLabel} role="tab">
                Details
              </div>
            </li>
            <li
              className={ cx(s.tab, { [s.tab_active]: isRevisionsVisible }) }
              onClick={this.handleOnShowRevisions}
            >
              <div className={s.tabLabel} role="tab">
                Revisions
              </div>
            </li>
          </ul>
          <div>
            { isRevisionsVisible
              ? this.renderRevisionsTabPane()
              : this.renderDetailsTabPane()
            }
          </div>
        </div>
      </div>
    );
  }
}

PropertiesPane.propTypes = {
  document: PropTypes.object,
  documentVersions: PropTypes.array,
  isProcessingRevisions: PropTypes.bool,
  isPropertiesVisible: PropTypes.bool,
  isRevisionsVisible: PropTypes.bool,
  locale: PropTypes.string,
  onHideProperties: PropTypes.func,
  onHideRevisions: PropTypes.func,
  onShowRevisions: PropTypes.func,
};

export default PropertiesPane;
