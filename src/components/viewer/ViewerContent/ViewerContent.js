/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { Component, PropTypes } from 'react';
import { setParams, parseDrillthroughLink } from '../../../utils/viewerAssets';
import s from './ViewerContent.scss';

class ViewerContent extends Component {

  // COMPONENT LIFECYCLE

  componentDidUpdate() {
    // automatically scrolls up to display the search keyword
    const keyword = document.querySelectorAll('[data-match-element]');
    if (keyword.length) keyword[0].scrollIntoView();

    // handle drill hyperlinks
    const drills = document.querySelectorAll('a.ars-drillthrough');
    if (drills.length) {
      for (let key = 0; key < drills.length; key++) {
        const drill = drills[key];
        drill.addEventListener('click', this.handleOnClickOnDrillThrough, false);
      }
    }

    // handle drill toggles hyperlinks
    const toggles = document.querySelectorAll('.ars-toggle');
    if (toggles.length) {
      for (let key = 0; key < toggles.length; key++) {
        const toggle = toggles[key];
        toggle.addEventListener('click', this.handleOnClickOnDrillToggle, false);
      }
    }
  }


  // ACTION HANDLERS

  handleClickOnDrillLink = (reportName, params) => this.props.onClickOnDrillLink(reportName, params);
  handleClickOnDrillToggle = (data) => this.props.onClickOnDrillToggle(data);


  // EVENT HANDLERS

  handleOnClickOnDrillThrough = (event) => {
    event.preventDefault();
    if (event.target.href) {
      const document = parseDrillthroughLink(event.target.getAttribute('href'));
      this.handleClickOnDrillLink(document.reportName, document.params);
    }
  };

  handleOnClickOnDrillToggle = (event) => {
    event.preventDefault();
    const toggleInfo = JSON.parse(event.currentTarget.getAttribute('data'));
    if (toggleInfo.Data) this.handleClickOnDrillToggle(toggleInfo.Data);
  };


  // RENDER COMPONENT

  render() {
    const { hasRenderedDocument, markup, pageNumber, searchElementId } = this.props;
    return (
      <div id="viewerContent">
        { hasRenderedDocument && (
          <div
            className={s.root}
            dangerouslySetInnerHTML={{
              __html: setParams(markup, pageNumber, searchElementId),
            }}
          />
        )}
      </div>
    );
  }
}

ViewerContent.propTypes = {
  // data
  caption: PropTypes.string,
  errorMessage: PropTypes.bool,
  hasError: PropTypes.bool,
  hasRenderedDocument: PropTypes.bool,
  markup: PropTypes.string,
  pageCount: PropTypes.number,
  pageNumber: PropTypes.number,
  reportId: PropTypes.string,
  searchElementId: PropTypes.number,
  strings: PropTypes.object,
  // actions
  onClickOnDrillLink: PropTypes.func,
  onClickOnDrillToggle: PropTypes.func,
};

export default ViewerContent;
