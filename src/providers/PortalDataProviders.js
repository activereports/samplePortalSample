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
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { openWindow } from '../utils/index';
import createDataProviders from '../utils/createDataProviders';
import ToolTypes from '../constants/ToolTypes';

// Import Action Creators
import * as authActionCreators from '../actions/AuthActionCreators';
import * as documentsActionsCreators from '../actions/DocumentsActionCreators';
import * as parametersActionCreators from '../actions/ParametersActionCreators';
import * as permissionActionsCreators from '../actions/PermissionActionsCreators';
import * as scheduleActionsCreators from '../actions/ScheduleActionsCreators';
import * as tagsActionsCreators from '../actions/TagsActionsCreators';
import * as uiActionCreators from '../actions/UIActionCreators';
import * as userActionCreators from '../actions/UserActionCreators';
import * as portalActionCreators from '../actions/PortalActionCreators';

// Common Components
import AssignTo from '../components/common/AssignTo';
import Confirm from '../components/common/Confirm';
import ContextMenu from '../components/common/ContextMenu';
import Menu from '../components/common/DropdownItem';
import MoveTo from '../components/common/MoveTo';
import Omni from '../components/common/Dropdown';
import Prompt from '../components/common/Prompt';
import Tool from '../components/common/Button';

// Portal Components
import NewReport from '../components/portal/NewReport';
import Permissions from '../components/portal/Permissions';
import PropertiesDock from '../components/portal/PropertiesDock';
import ReportsDock from '../components/portal/ReportsDock';
import ReportsFilter from '../components/portal/ReportsFilter';
import Schedule from '../components/portal/Schedule';
import Sidebar from '../components/portal/Sidebar';


class PortalActionProviders extends Component {

  state = { docContextMenu: null };

  componentDidMount() {
    this.props.portalActions.initPortal();
  }

  // UTILS

  isCurrentToolType = (toolType) => this.props.ui.currentToolType === toolType;

  openDesigner = (model) => {
    const path = this.context.router.createPath({
      pathname: '/designer',
      query: {
        modelName: model,
        portal: 1,
        reportAction: 'Create',
      },
    });
    openWindow(path);
  };

  openViewer = (action, fileType) => {
    const { document } = this.props;
    const path = this.context.router.createPath({
      pathname: '/viewer',
      query: {
        action: action || null,
        id: document.id,
        name: document.data.name,
        type: fileType || null,
      },
    });
    openWindow(path);
  };

  components = {
    [Tool]: (instance) => {
      const { authActions, document, caps, operations, style, user, ui, uiActions } = this.props;
      const tools = {
        [ToolTypes.SHARE_DOC]: {
          hidden: !document.id,
          icon: 'share-alt',
          disabled: !operations.canChangePermission,
          label: 'Share',
          title: 'Share',
          onClick: uiActions.showPermissions,
        },
        [ToolTypes.SCHEDULE_DOC]: {
          hidden: !document.id,
          icon: 'calendar-check-o',
          disabled: !caps.createReportSchedule,
          label: 'Schedule',
          title: 'Schedule',
          onClick: uiActions.showSchedules,
        },
        [ToolTypes.TOGGLE_PROPERTIES_PANE]: {
          icon: 'info-circle',
          active: ui.propertiesVisibility,
          title: 'Toggle properties panel',
          onClick: uiActions.toggleProperties,
        },
        [ToolTypes.TOGGLE_SIDEBAR]: {
          hidden: ui.sidebarVisibility,
          icon: 'bars',
          onClick: uiActions.showSidebar,
        },
        [ToolTypes.LOG_OUT]: {
          icon: 'sign-out',
          label: `Hello, ${user.name.charAt(0).toUpperCase() + user.name.substr(1).toLowerCase()}`,
          title: 'Logout',
          onClick: authActions.logOut,
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, { style });
    },

    [Omni]: (instance) => {
      const { document, style, tag, tags } = this.props;
      const isCategorized = tag.id !== '0';
      const isDisabled = !isCategorized || tag.isFavorites || document.isProcessing;
      const hasDataToSort = document.list.length > 1;
      const tools = {
        [ToolTypes.TOGGLE_ACTION_MENU]: {
          icon: 'plus',
          label: 'New',
          title: 'New',
        },
        [ToolTypes.TOGGLE_TAG_MENU]: {
          caret: isDisabled ? '' : 'sort',
          icon: cx({
            ['refresh']: document.isProcessing,
            ['star-o']: tag.isFavorites,
            ['folder-o']: !tag.isFavorites,
          }),
          disabled: isDisabled,
          processing: document.isProcessing,
          label: tags.tagName,
          title: tags.tagName,
        },
        [ToolTypes.TOGGLE_DOC_MENU]: {
          hidden: !document.id,
          caret: 'caret-square-o-down',
          menuRight: true,
          label: 'More',
        },
        [ToolTypes.TOGGLE_SORT_MENU]: {
          caret: hasDataToSort ? 'sort' : '',
          hidden: !hasDataToSort,
          menuRight: true,
          label: 'Sort options',
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, { style });
    },

    [Menu]: (instance) => {
      const { document, docsActions, caps, operations, style, tag, user, uiActions } = this.props;
      const tools = {
        [ToolTypes.SHARE_DOC]: {
          label: 'Share',
          icon: 'share-alt',
          disabled: !operations.canChangePermission,
          onClick: uiActions.showPermissions,
        },
        [ToolTypes.SCHEDULE_DOC]: {
          label: 'Schedule',
          icon: 'calendar-check-o',
          disabled: !caps.createReportSchedule,
          onClick: uiActions.showSchedules,
        },
        [ToolTypes.CREATE_DOC]: {
          label: 'Report',
          icon: 'file-text',
          disabled: !user.hasDesignerAddon,
          onClick: uiActions.showReportDialog,
        },
        [ToolTypes.CREATE_TAG]: {
          label: 'New folder...',
          icon: 'folder',
          disabled: !caps.createTags,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.CREATE_TAG),
        },
        [ToolTypes.CREATE_TAG_ROOT]: {
          label: 'Folder',
          icon: 'folder',
          disabled: !caps.createTags,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.CREATE_TAG),
        },
        [ToolTypes.MOVE_TAG]: {
          label: 'Move to...',
          icon: 'folder',
          disabled: tag.isSystem,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.MOVE_TAG),
        },
        [ToolTypes.RENAME_TAG]: {
          label: 'Rename...',
          icon: '',
          disabled: tag.isSystem,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.RENAME_TAG),
        },
        [ToolTypes.DELETE_TAG]: {
          label: 'Remove',
          icon: 'trash-o',
          disabled: tag.isSystem,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.DELETE_TAG),
        },
        [ToolTypes.REMOVE_FROM_FAVORITES]: {
          hidden: !document.data.isFavorited,
          label: 'Remove from favorites',
          icon: 'star-o',
          onClick: () => docsActions.removeFromFavorites(document.id),
        },
        [ToolTypes.ADD_TO_FAVORITES]: {
          hidden: document.data.isFavorited,
          label: 'Add to favorites',
          icon: 'star',
          onClick: () => docsActions.addToFavorites(document.id),
        },
        [ToolTypes.ASSIGN_DOC]: {
          label: 'Assign to...',
          icon: 'folder',
          onClick: () => uiActions.setCurrentToolType(ToolTypes.ASSIGN_DOC),
        },
        [ToolTypes.RENAME_DOC]: {
          label: 'Rename...',
          icon: '',
          disabled: !operations.canUpdate,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.RENAME_DOC),
        },
        [ToolTypes.PRINT]: {
          label: 'Print',
          icon: 'print',
          onClick: () => this.openViewer('print'),
        },
        [ToolTypes.EXPORT_AS_PDF]: {
          label: 'Export as PDF Document',
          icon: 'file-pdf-o',
          onClick: () => this.openViewer('export', 'PDF'),
        },
        [ToolTypes.EXPORT_AS_DOC]: {
          label: 'Export as Word Document',
          icon: 'file-word-o',
          onClick: () => this.openViewer('export', 'Word'),
        },
        [ToolTypes.EXPORT_AS_IMG]: {
          label: 'Export as Image File',
          icon: 'file-image-o',
          onClick: () => this.openViewer('export', 'Image'),
        },
        [ToolTypes.EXPORT_AS_WEB]: {
          label: 'Export as MHTML Web Archives',
          icon: 'file-zip-o',
          onClick: () => this.openViewer('export', 'Html'),
        },
        [ToolTypes.EXPORT_AS_XLS]: {
          label: 'Export as Excel Workbook',
          icon: 'file-excel-o',
          onClick: () => this.openViewer('export', 'Excel'),
        },
        [ToolTypes.DELETE_DOC]: {
          label: 'Delete',
          icon: 'trash-o',
          disabled: !operations.canDelete,
          onClick: () => uiActions.setCurrentToolType(ToolTypes.DELETE_DOC),
        },
        [ToolTypes.SORT_BY_DOCUMENT_NAME]: {
          icon: document.listSortFlag === ToolTypes.SORT_BY_DOCUMENT_NAME ? 'check' : '',
          label: 'Report Name',
          onClick: () => docsActions.setSortFlag(ToolTypes.SORT_BY_DOCUMENT_NAME),
        },
        [ToolTypes.SORT_BY_LAST_MODIFIED]: {
          icon: document.listSortFlag === ToolTypes.SORT_BY_LAST_MODIFIED ? 'check' : '',
          label: 'Last Modified',
          onClick: () => docsActions.setSortFlag(ToolTypes.SORT_BY_LAST_MODIFIED),
        },
        [ToolTypes.SORT_BY_MODIFIED_BY]: {
          icon: document.listSortFlag === ToolTypes.SORT_BY_MODIFIED_BY ? 'check' : '',
          label: 'Modified By',
          onClick: () => docsActions.setSortFlag(ToolTypes.SORT_BY_MODIFIED_BY),
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, { style });
    },

    [NewReport]: () => {
      const { document, ui, docsActions, uiActions } = this.props;
      return ui.reportDialogVisibility ? {
        // Data
        isProcessing: document.isProcessingModels,
        models: document.models,
        // Actions
        onDismiss: uiActions.hideReportDialog,
        onMount: docsActions.getModels,
        onSubmit: this.openDesigner,
      } : null;
    },

    [Permissions]: () => {
      const { document, permissions, ui, permissionActions, uiActions } = this.props;
      return ui.permissionsVisibility ? {
        // Data
        data: permissions.data,
        documentId: document.data._id,
        documentName: document.data.name,
        isProcessing: permissions.isProcessing,
        // Action
        onDismiss: uiActions.hidePermissions,
        onMount: permissionActions.getPermissions,
        onSubmit: permissionActions.updatePermissions,
      } : null;
    },

    [Schedule]: () => {
      const { document, schedule, parameters, parametersActions, ui, scheduleActions, uiActions } = this.props;
      return ui.schedulesVisibility ? {
        // Data
        data: schedule.data,
        documentId: document.data._id,
        documentName: document.data.name,
        documentParameters: parameters.data,
        hasDocumentParameters: parameters.hasData,
        hasVisibleParameters: parameters.hasVisibleParameters,
        isProcessing: schedule.isProcessing,
        isProcessingTemplate: schedule.isProcessingTemplate,
        isProcessingParameters: parameters.isProcessing,
        isRequestingParameters: parameters.isRequesting,
        templates: schedule.templates,
        // Actions
        onChangeScheduleTemplate: scheduleActions.getScheduleTemplate,
        onChangeTab: scheduleActions.assembleSchedule,
        onCreateTask: scheduleActions.createScheduleTask,
        onDismiss: uiActions.hideSchedules,
        onMount: scheduleActions.assembleSchedules,
        onRemoveTask: scheduleActions.deleteScheduleTask,
        onSubmit: scheduleActions.submitSchedules,
        onUpdateScheduleParams: parametersActions.validateReportParameters,
      } : null;
    },

    [Sidebar]: () => {
      const { tags, ui, tagsActions, uiActions } = this.props;
      return {
        hideEmptyTags: ui.hideEmptyCategories,
        isSidebarVisible: ui.sidebarVisibility,
        tagsList: tags.tagsTree,
        onHideSidebar: uiActions.hideSidebar,
        onToggleTreeNode: tagsActions.toggleTreeNode,
        onChangeTreeItem: tagsActions.selectTreeNode,
      };
    },

    [ReportsDock]: () => {
      const { document, docsActions, uiActions } = this.props;
      return {
        // Data
        currentDocId: document.id,
        document: document.data,
        documents: document.list,
        filterText: document.listFilterText,
        isProcessingDocument: document.isProcessing,
        // Actions
        onOpenContextMenu: (context) => uiActions.setCurrentToolType(ToolTypes.CONTEXT_MENU, context),
        onChangeDocument: docsActions.getDocument,
        onShowViewer: this.openViewer,
      };
    },

    [ReportsFilter]: () => {
      const { document, docsActions } = this.props;
      return {
        value: document.listFilterText,
        onChange: docsActions.filterDocumentsList,
      };
    },

    [PropertiesDock]: () => {
      const { document, ui, uiActions } = this.props;
      return {
        document: document.data,
        documentVersions: document.revisions,
        hasDataToDisplay: !!document.id,
        isProcessingDocument: document.isProcessing,
        isProcessingRevisions: document.isProcessingRevisions,
        isPropertiesVisible: ui.propertiesVisibility,
        isRevisionsVisible: ui.revisionsVisibility,
        locale: ui.locale,
        onHideProperties: uiActions.hideProperties,
        onHideRevisions: uiActions.hideRevisions,
        onShowRevisions: uiActions.showRevisions,
      };
    },

    [ContextMenu]: () => {
      const { style, ui, uiActions } = this.props;
      return this.isCurrentToolType(ToolTypes.CONTEXT_MENU) ? {
        style,
        event: ui.currentToolContext,
        onDismiss: () => uiActions.setCurrentToolType(null),
      } : null;
    },

    [AssignTo]: () => {
      const { document, caps, tags, docsActions, uiActions } = this.props;
      return this.isCurrentToolType(ToolTypes.ASSIGN_DOC) ? {
        // Data
        document: document.data,
        treeData: tags.tagsTree,
        canAssignSystemTags: caps.assignSystemTags,
        // Actions
        onCancel: () => uiActions.setCurrentToolType(null),
        onConfirm: docsActions.updateDocumentTags,
      } : null;
    },

    [Prompt]: () => {
      const { document, docsActions, tags, tagsActions, uiActions } = this.props;
      if (this.isCurrentToolType(ToolTypes.CREATE_TAG)) {
        return {
          caption: 'Create Category',
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (tagName) => tagsActions.addTag(tagName, tags.tagId),
        };
      } else if (this.isCurrentToolType(ToolTypes.CREATE_TAG_ROOT)) {
        return {
          caption: 'Create Category',
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (tagName) => tagsActions.addTag(tagName),
        };
      } else if (this.isCurrentToolType(ToolTypes.RENAME_DOC)) {
        return {
          caption: 'Rename Document',
          text: document.data.name,
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (name) => docsActions.updateDocument({ name, id: document.id }),
        };
      } else if (this.isCurrentToolType(ToolTypes.RENAME_TAG)) {
        return {
          caption: 'Rename Tag',
          text: tags.tagName,
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: (name) => tagsActions.updateTag({ name, id: tags.tagId }),
        };
      }

      return null; // hidden by default
    },

    [Confirm]: () => {
      const { document, docsActions, tags, tagsActions, uiActions } = this.props;
      if (this.isCurrentToolType(ToolTypes.DELETE_DOC)) {
        return {
          caption: 'Delete Document',
          message: `Are you sure you want to delete "${document.data.name}"?`,
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: () => docsActions.deleteDocument(document.id),
        };
      } else if (this.isCurrentToolType(ToolTypes.DELETE_TAG)) {
        return {
          caption: 'Delete Tag',
          message: `Are you sure you want to delete "${tags.tagName}"?`,
          onCancel: () => uiActions.setCurrentToolType(null),
          onConfirm: () => tagsActions.deleteTag(tags.tagId),
        };
      }

      return null; // hidden by default
    },

    [MoveTo]: () => {
      const { tags, tagsActions, uiActions } = this.props;
      return this.isCurrentToolType(ToolTypes.MOVE_TAG) ? {
        tagId: tags.tagId,
        tagName: tags.tagName,
        treeData: tags.tagsTree,
        onCancel: () => uiActions.setCurrentToolType(null),
        onConfirm: (tag) => tagsActions.updateTag(tag),
      } : null;
    },

  };

  render() {
    return (
      <div className={this.props.className}>
        { createDataProviders(this.props.children, this.components) }
      </div>
    );
  }
}

PortalActionProviders.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  style: PropTypes.object,

  // Action Creators
  authActions: PropTypes.object,
  docsActions: PropTypes.object,
  parametersActions: PropTypes.object,
  permissionActions: PropTypes.object,
  portalActions: PropTypes.object,
  scheduleActions: PropTypes.object,
  tagsActions: PropTypes.object,
  uiActions: PropTypes.object,
  userActions: PropTypes.object,

  // Action Methods
  addTag: PropTypes.func,
  addToFavorites: PropTypes.func,
  assembleSchedule: PropTypes.func,
  assembleSchedules: PropTypes.func,
  createScheduleTask: PropTypes.func,
  deleteDocument: PropTypes.func,
  deleteScheduleTask: PropTypes.func,
  deleteTag: PropTypes.func,
  filterDocumentsList: PropTypes.func,
  getDocument: PropTypes.func,
  getModels: PropTypes.func,
  getPermissions: PropTypes.func,
  getScheduleTemplate: PropTypes.func,
  getSchedule: PropTypes.func,
  getTags: PropTypes.func,
  getUserInfo: PropTypes.func,
  logOut: PropTypes.func,
  removeFromFavorites: PropTypes.func,
  selectTreeNode: PropTypes.func,
  setSortFlag: PropTypes.func,
  toggleTreeNode: PropTypes.func,
  updateDocument: PropTypes.func,
  updateDocumentTags: PropTypes.func,
  updatePermissions: PropTypes.func,
  submitSchedules: PropTypes.func,
  updateTag: PropTypes.func,
  getSiteSettings: PropTypes.func,
  initPortal: PropTypes.func,

  // UI Action Creators
  hideNotification: PropTypes.func,
  hidePermissions: PropTypes.func,
  hideProperties: PropTypes.func,
  hideReportDialog: PropTypes.func,
  hideRevisions: PropTypes.func,
  hideSchedules: PropTypes.func,
  hideSidebar: PropTypes.func,
  setCurrentToolType: PropTypes.func,
  showPermissions: PropTypes.func,
  showProperties: PropTypes.func,
  showReportDialog: PropTypes.func,
  showRevisions: PropTypes.func,
  showSchedules: PropTypes.func,
  showSidebar: PropTypes.func,
  showViewer: PropTypes.func,
  toggleProperties: PropTypes.func,

  // Reducers
  caps: PropTypes.object,
  document: PropTypes.object,
  operations: PropTypes.object,
  parameters: PropTypes.object,
  permissions: PropTypes.object,
  schedule: PropTypes.object,
  tag: PropTypes.object,
  tags: PropTypes.object,
  ui: PropTypes.object,
  user: PropTypes.object,
  viewer: PropTypes.object,
};

const mapStateToProps = (state) => ({
  caps: state.user.caps,
  document: state.document,
  operations: state.document.operations,
  parameters: state.parameters,
  permissions: state.permissions,
  schedule: state.schedule,
  tag: state.tags.data,
  tags: state.tags,
  ui: state.ui,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(authActionCreators, dispatch),
  docsActions: bindActionCreators(documentsActionsCreators, dispatch),
  parametersActions: bindActionCreators(parametersActionCreators, dispatch),
  permissionActions: bindActionCreators(permissionActionsCreators, dispatch),
  scheduleActions: bindActionCreators(scheduleActionsCreators, dispatch),
  tagsActions: bindActionCreators(tagsActionsCreators, dispatch),
  uiActions: bindActionCreators(uiActionCreators, dispatch),
  userActions: bindActionCreators(userActionCreators, dispatch),
  portalActions: bindActionCreators(portalActionCreators, dispatch),
});

PortalActionProviders.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(PortalActionProviders);
