/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes } from 'react';
import ViewerDataProviders from '../../providers/ViewerDataProviders';
import Type from '../../constants/ToolTypes';
import s from './Viewer.scss';

// Common Components
import Input from '../../components/common/Input';
import Menu from '../../components/common/DropdownItem';
import Omni from '../../components/common/Dropdown';
import Tool from '../../components/common/Button';

// Viewer Components
import Content from '../../components/viewer/ViewerContent';
import Sidebar from '../../components/viewer/ViewerSidebar';
import Topbar from '../../components/viewer/ViewerTopbar';


const Viewer = (props) => (
  <ViewerDataProviders style={s} className={s.root} location={props.location}>
    <div className={s.container}>
      <div className={s.head}>
        <Topbar />
        <div className={s.toolbar}>
          <div className={s.left}>
            <Tool id={Type.TOGGLE_TOC_PANE} className={s.tool_toggle} />
            <Tool id={Type.TOGGLE_PARAMETERS_PANE} className={s.tool_toggle} />
            <Tool id={Type.TOGGLE_SEARCH_PANE} className={s.tool_toggle} />
          </div>
          <div className={s.left}>
            <Tool id={Type.BACK_TO_PARENT} />
          </div>
          <div className={s.left}>
            <Tool id={Type.FAST_BACKWARD} />
            <Tool id={Type.STEP_BACKWARD} />
            <Input id={Type.PAGE_NUMBER} />
            <Tool id={Type.STEP_FORWARD} />
            <Tool id={Type.FAST_FORWARD} />
          </div>
          <div className={s.right}>
            <Tool id={Type.PRINT} />
            <Omni id={Type.TOGGLE_EXPORT_MENU}>
              <Menu id={Type.EXPORT_AS_PDF} />
              <Menu id={Type.EXPORT_AS_DOC} />
              <Menu id={Type.EXPORT_AS_IMG} />
              <Menu id={Type.EXPORT_AS_WEB} />
              <Menu id={Type.EXPORT_AS_XLS} />
            </Omni>
          </div>
        </div>
      </div>
      <div className={s.body}>
        <div className={s.view}>
          <Sidebar />
          <div className={s.content}>
            <div className={s.inner}>
              <Content />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ViewerDataProviders>
);

Viewer.propTypes = {
  location: PropTypes.object,
};

export default Viewer;
