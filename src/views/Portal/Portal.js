/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import Type from '../../constants/ToolTypes';
import PortalDataProviders from '../../providers/PortalDataProviders';
import s from './Portal.scss';

// Common Components
import AssignTo from '../../components/common/AssignTo';
import Confirm from '../../components/common/Confirm';
import ContextMenu from '../../components/common/ContextMenu';
import Menu from '../../components/common/DropdownItem';
import MoveTo from '../../components/common/MoveTo';
import Omni from '../../components/common/Dropdown';
import Prompt from '../../components/common/Prompt';
import Tool from '../../components/common/Button';

// Portal Components
import NewReport from '../../components/portal/NewReport';
import Permissions from '../../components/portal/Permissions';
import PropertiesDock from '../../components/portal/PropertiesDock';
import ReportsDock from '../../components/portal/ReportsDock';
import ReportsFilter from '../../components/portal/ReportsFilter';
import Schedule from '../../components/portal/Schedule';
import Sidebar from '../../components/portal/Sidebar';


/**
 * This module represents the portal view.
 *
 * This way activities that require authorization.
 * MUST be shown to user only when user is logged in.
 *
 */
const PortalView = () => (
  <PortalDataProviders style={s} className={s.root}>
    <div className={s.container}>
      <Sidebar />

      <div className={s.main}>

        { /* TOPBAR */ }
        <div className={s.topbar}>
          <div className={s.left}>
            <Tool className={s.tool_toggle} id={Type.TOGGLE_SIDEBAR} />
            <Omni className={s.tool_primary} id={Type.TOGGLE_ACTION_MENU}>
              <Menu id={Type.CREATE_DOC} />
              <Menu id={Type.CREATE_TAG_ROOT} />
            </Omni>
            <ReportsFilter />
          </div>
          <div className={s.right}>
            <Tool id={Type.LOG_OUT} />
          </div>
        </div>

        { /* TOOLBAR */ }
        <div className={s.toolbar}>
          <div className={s.left}>
            <Omni id={Type.TOGGLE_TAG_MENU}>
              <Menu id={Type.CREATE_TAG} />
              <Menu divider />
              <Menu id={Type.MOVE_TAG} />
              <Menu id={Type.RENAME_TAG} />
              <Menu divider />
              <Menu id={Type.DELETE_TAG} />
            </Omni>
          </div>
          <div className={s.right}>
            <Tool id={Type.SHARE_DOC} />
            <Tool id={Type.SCHEDULE_DOC} />
            <Omni id={Type.TOGGLE_DOC_MENU}>
              <Menu id={Type.ADD_TO_FAVORITES} />
              <Menu id={Type.REMOVE_FROM_FAVORITES} />
              <Menu divider />
              <Menu id={Type.ASSIGN_DOC} />
              <Menu id={Type.RENAME_DOC} />
              <Menu divider />
              <Menu id={Type.PRINT} />
              <Menu divider />
              <Menu id={Type.EXPORT_AS_PDF} />
              <Menu id={Type.EXPORT_AS_DOC} />
              <Menu id={Type.EXPORT_AS_IMG} />
              <Menu id={Type.EXPORT_AS_WEB} />
              <Menu id={Type.EXPORT_AS_XLS} />
              <Menu divider />
              <Menu id={Type.DELETE_DOC} />
            </Omni>
          </div>
          <div className={s.right}>
            <Omni id={Type.TOGGLE_SORT_MENU}>
              <Menu id={Type.SORT_BY_DOCUMENT_NAME} />
              <Menu id={Type.SORT_BY_LAST_MODIFIED} />
              <Menu id={Type.SORT_BY_MODIFIED_BY} />
            </Omni>
          </div>
          <div className={s.right}>
            <Tool id={Type.TOGGLE_PROPERTIES_PANE} />
          </div>
        </div>

        { /* CONTEXT MENU */ }
        <ContextMenu>
          <Menu id={Type.SHARE_DOC} />
          <Menu id={Type.SCHEDULE_DOC} />
          <Menu divider />
          <Menu id={Type.ADD_TO_FAVORITES} />
          <Menu id={Type.REMOVE_FROM_FAVORITES} />
          <Menu id={Type.ASSIGN_DOC} />
          <Menu id={Type.RENAME_DOC} />
          <Menu divider />
          <Menu id={Type.PRINT} />
          <Menu divider />
          <Menu id={Type.DELETE_DOC} />
        </ContextMenu>

        <div className={s.content}>
          <div className={s.reports}>
            <ReportsDock />
            <PropertiesDock />
          </div>
        </div>
      </div>

      { /* MODALS */ }
      <AssignTo />
      <Confirm />
      <MoveTo />
      <NewReport />
      <Permissions />
      <Prompt />
      <Schedule />

    </div>
  </PortalDataProviders>
);

export default PortalView;
