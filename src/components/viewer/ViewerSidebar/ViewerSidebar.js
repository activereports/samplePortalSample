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
import SearchPane from '../ViewerSearchPane';
import ParametersPane from '../ViewerParametersPane';
import FontIcon from '../../common/FontIcon';
import s from './ViewerSidebar.scss';

class ViewerSidebar extends Component {

  // Action Handlers
  handleUpdateDocumentParams = (params) => this.props.onChangeDocumentParams(params);
  handleChangeSearchParams = (params) => this.props.onChangeSearchParams(params);
  handleChangeTab = (action) => this.props.onChangeTab(action);
  handleDismiss = () => this.props.onDismiss();
  handleOnClickOnToc = (pageNum) => this.props.onChangeCurrentPage(pageNum);
  handleSubmitDocumentParams = (params) => this.props.onSubmitDocumentParams(params);
  handleSubmitSearchParams = (searchOptions) => this.props.onSubmitSearchParams(searchOptions);

  // Panels
  panels = {
    ['TOC']: () => {
      const { toc, strings } = this.props;
      return (
        <div className={s.pane}>
          <ul className={s.tocList}>
            { toc.kids.length
              ? toc.kids.map((item, key) => (
                <li
                  key={key}
                  className={s.tocListItem}
                  title={item.name}
                  onClick={() => this.handleOnClickOnToc(item.page + 1)}
                >
                  <span>{item.name}</span>
                </li>
              ))
              : <span>{strings.emptyToc}</span>
            }
          </ul>
        </div>
      );
    },
    ['SEARCH']: () => (
      <SearchPane
        className={s.pane}
        searchMatches={this.props.searchMatches}
        onChangeSearchParams={this.handleChangeSearchParams}
        onSearch={this.handleSubmitSearchParams}
      />
    ),
    ['PARAMETERS']: () => (
      <ParametersPane
        className={s.pane}
        params={this.props.params}
        hasParameters={this.props.hasParameters}
        hasVisibleParameters={this.props.hasVisibleParameters}
        onUpdateParams={this.handleUpdateDocumentParams}
        onSubmitParams={this.handleSubmitDocumentParams}
      />
    ),
  };

  // Render Assets
  renderToggle = (action, key) => {
    const currentAction = this.props.action;
    return (
      <li
        key={key}
        className={cx(s.tab, { [s.tab_active]: currentAction === action.type })}
        onClick={() => this.handleChangeTab(action.type)}
      >
        <div className={s.tabAction}>
          { action.caption }
        </div>
      </li>
    );
  };

  // Render Component
  render() {
    const { action, isVisible, strings, hasToc, hasParameters } = this.props;
    const actions = [
      { type: 'TOC', caption: strings.panels.toc, enabled: hasToc },
      { type: 'PARAMETERS', caption: strings.panels.parameters, enabled: hasParameters },
      { type: 'SEARCH', caption: strings.panels.search, enabled: true },
    ];
    return (
      <div className={cx(s.root, { [s.root_visible]: isVisible })}>
        <div className={s.container}>
          <div className={s.head}>
            <div className={s.headCaption}>
              <span className={s.headCaptionText}>
                { strings.caption }
              </span>
            </div>
            <div className={s.headDismiss} onClick={this.handleDismiss}>
              <FontIcon name="times" />
            </div>
          </div>
          <ul className={s.nav}>
            { actions.map((item, key) => item.enabled && this.renderToggle(item, key)) }
          </ul>
          <div className={s.body}>
            { action && this.panels[action]() }
          </div>
        </div>
      </div>
    );
  }
}

ViewerSidebar.propTypes = {
  // Data
  action: PropTypes.oneOf(['TOC', 'PARAMETERS', 'SEARCH']),
  hasParameters: PropTypes.bool,
  hasToc: PropTypes.bool,
  hasVisibleParameters: PropTypes.bool,
  isVisible: PropTypes.bool,
  params: PropTypes.array,
  searchMatches: PropTypes.array,
  strings: PropTypes.object,
  toc: PropTypes.object,
  // Action
  onChangeCurrentPage: PropTypes.func,
  onChangeDocumentParams: PropTypes.func,
  onChangeSearchParams: PropTypes.func,
  onChangeTab: PropTypes.func,
  onDismiss: PropTypes.func,
  onSubmitDocumentParams: PropTypes.func,
  onSubmitSearchParams: PropTypes.func,
};

ViewerSidebar.defaultProps = {
  strings: {
    caption: 'Actions Panel',
    emptyToc: 'Current document does not contain a table of contents',
    panels: {
      toc: 'TOC',
      parameters: 'Parameters',
      search: 'Search',
    },
  },
};

export default ViewerSidebar;
