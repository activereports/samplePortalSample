/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { endpoints } from '../../config';
import s from './Designer.scss';

const Designer = (props) => {
  const query = props.location.search || null;
  const url = query ? `${endpoints.arsDefaultHandler}${query}` : null;
  return (
    <div className={s.root}>
      { url
        ? <iframe className={s.frame} src={url}></iframe>
        : <div>Malformed URL. Expected parameters not transmitted. Please <Link to="/">try again</Link>.</div>
      }
    </div>
  );
};

Designer.propTypes = {
  location: PropTypes.object,
};

export default Designer;
