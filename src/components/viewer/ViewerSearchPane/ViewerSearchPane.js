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
import s from './ViewerSearchPane.scss';

/**
 * Viewer Sidebar
 */
class ViewerSearchPane extends Component {

  state = {
    matchCase: false,
    text: '',
    wholePhrase: false,
    processing: false,
  };

  handleOnSearch = () => {
    const searchOptions = this.state;
    this.props.onChangeSearchParams(searchOptions);
    this.setState({ processing: true });
  };

  handleOnClear = () => {
    const input = this.refs.search;
    const state = {
      matchCase: false,
      text: '',
      wholePhrase: false,
      processing: false,
    };
    input.value = '';
    this.setState(state);
    this.props.onChangeSearchParams(state);
  };

  handleKeyDown = (event) => {
    if (event.keyCode === 13) this.handleOnSearch(); // enter
    if (event.keyCode === 27) this.handleOnClear(); // esc
  };

  handleOnChangeMatchCase = (event) => {
    this.setState({
      matchCase: event.target.checked,
      processing: false,
    });
  };

  handleOnChangeSearch = (event) => {
    this.setState({
      text: event.target.value,
      processing: false,
    });
  };

  handleOnChangeWholePhrase = (event) => {
    this.setState({
      wholePhrase: event.target.checked,
      processing: false,
    });
  };

  renderSearchMatches = (matches, query) => {
    const { onSearch } = this.props;
    return (
      <div>
        <div className={s.results}>
          {matches.length} results found for "<strong>{query}</strong>"
        </div>
        <div className={s.list}>
          {matches.map((term, key) => (
            <div className={s.item} key={key} onClick={() => onSearch(term)}>
              <FontIcon name="file-text-o" />
              <span className={s.itemPage}>#{term.page}</span>
              <span className={s.itemText}>{term.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { className, searchMatches } = this.props;
    const searchOptions = this.state;
    return (
      <div className={className} role="tabpanel">
        <input
          className={s.input}
          ref="search"
          type="text"
          placeholder="Search"
          onChange={this.handleOnChangeSearch}
          onKeyDown={this.handleKeyDown}
        />
        <div className={s.checkboxes}>
          <label className={s.label}>
            <input className={s.checkbox} type="checkbox" onChange={this.handleOnChangeMatchCase} />
            Match case
          </label>
          <label className={s.label}>
            <input className={s.checkbox} type="checkbox" onChange={this.handleOnChangeWholePhrase} />
            Whole phrase
          </label>
        </div>
        <div className={s.buttons}>
          <button
            className={cx(s.button, { [s.button_disabled]: !searchOptions.text })}
            disabled={!searchOptions.text}
            onClick={this.handleOnClear}
          >
            Clear
          </button>
          <button
            className={cx(s.button, s.button_primary, { [s.button_disabled]: !searchOptions.text })}
            disabled={!searchOptions.text}
            onClick={() => this.handleOnSearch()}
          >
            <FontIcon name="search" />
            <span>Search</span>
          </button>
        </div>
        <div className={s.matches}>
          {searchMatches.length && searchOptions.processing
            ? this.renderSearchMatches(searchMatches, searchOptions.text)
            : null
          }
          {!searchMatches.length && searchOptions.processing
            ? <div className={s.results}>No results found for "<strong>{searchOptions.text}</strong>"</div>
            : null
          }
        </div>
      </div>
    );
  }
}

ViewerSearchPane.propTypes = {
  className: PropTypes.string,
  onChangeSearchParams: PropTypes.func,
  onSearch: PropTypes.func,
  searchMatches: PropTypes.array,
};

export default ViewerSearchPane;
