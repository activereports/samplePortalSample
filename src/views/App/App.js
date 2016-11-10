/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes } from 'react';
import AppDataProviders from '../../providers/AppDataProviders';
import BusyIndicator from '../../components/common/BusyIndicator';
import Notifications from '../../components/common/Notifications';
import s from './App.scss';

const App = (props) => (
  <AppDataProviders>
    <div className={s.root}>
      <BusyIndicator className={s.busy} />
      <Notifications />
      {props.children}
    </div>
  </AppDataProviders>
);

App.propTypes = {
  children: PropTypes.object,
};

export default App;
