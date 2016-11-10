/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes } from 'react';
import ReportsList from '../ReportsList';
import s from './ReportsDock.scss';

const ReportsDock = (props) => (
  props.documents.length ? (
    /* Render List */
    <div className={s.root}>
      <ReportsList {...props} />
    </div>
  ) : (
    /* Render Dummy */
    <div className={s.root}>
      { !props.isProcessingDocument && <span className={s.dummy}>There are no documents in this category.</span> }
    </div>
  )
);


ReportsDock.propTypes = {
  documents: PropTypes.array,
  isProcessingDocument: PropTypes.bool,
};

export default ReportsDock;
