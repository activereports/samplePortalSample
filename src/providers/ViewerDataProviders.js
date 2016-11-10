/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { PropTypes, Component } from 'react';
import ToolTypes from '../constants/ToolTypes';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import createDataProviders from '../utils/createDataProviders';

// Import Action Creators
import * as viewerActionCreators from '../actions/ViewerActionCreators';
import * as uiActionCreators from '../actions/UIActionCreators';
import * as parametersActionCreators from '../actions/ParametersActionCreators';

// Common Components
import Input from '../components/common/Input';
import Menu from '../components/common/DropdownItem';
import Omni from '../components/common/Dropdown';
import Tool from '../components/common/Button';

// Viewer Components
import Content from '../components/viewer/ViewerContent';
import Sidebar from '../components/viewer/ViewerSidebar';
import Topbar from '../components/viewer/ViewerTopbar';


class ViewerDataProviders extends Component {

  componentDidMount() {
    this.assembleDocument();
  }

  queryReportId = () => this.props.location.query.id || null;
  queryReportName = () => this.props.location.query.name || '';
  queryAction = () => this.props.location.query.action || null;
  queryActionType = () => this.props.location.query.type || null;

  assembleDocument = (reportParams = null) => {
    const action = this.queryAction();
    const fileType = this.queryActionType();
    const reportId = this.queryReportId();
    const exportParams = {
      documentId: null,
      documentName: this.queryReportName(),
    };

    if (action === 'export' && !!fileType) {
      Object.assign(exportParams, {
        extensionName: fileType,
        extensionSettings: { saveAsDialog: true },
      });
    } else if (action === 'print') {
      Object.assign(exportParams, {
        extensionName: 'Pdf',
        extensionSettings: { printOnOpen: true },
      });
    }
    this.props.viewerActions.assembleReport(reportId, reportParams, exportParams);
  };

  components = {
    [Content]: () => {
      const { viewer, viewerActions } = this.props;
      return {
        // Data
        caption: this.queryReportName(),
        errorMessage: viewer.errorMessage,
        hasError: viewer.hasError,
        hasRenderedDocument: viewer.hasRenderedDocument,
        markup: viewer.markup,
        pageCount: viewer.pageCount,
        pageNumber: viewer.pageNumber,
        reportId: this.queryReportId(),
        searchElementId: viewer.searchElementId,
        // Actions
        onClickOnDrillLink: viewerActions.assembleReport,
        onClickOnDrillToggle: viewerActions.getDrilldownGroup,
      };
    },

    [Sidebar]: () => {
      const { viewer, viewerActions, parameters, parametersActions } = this.props;
      return {
        // Data
        action: viewer.sidebarAction,
        hasParameters: parameters.hasData,
        hasToc: !!viewer.toc.kids.length,
        hasVisibleParameters: parameters.hasVisibleParameters,
        isVisible: viewer.sidebar,
        params: parameters.data,
        searchMatches: viewer.searchMatches,
        toc: viewer.toc,
        // Actions
        onChangeCurrentPage: viewerActions.changePageNumber,
        onChangeDocumentParams: (params) => parametersActions.validateReportParameters(this.queryReportId(), params),
        onChangeSearchParams: viewerActions.getSearchMatches,
        onChangeTab: viewerActions.changeSidebarAction,
        onDismiss: viewerActions.dismissSidebar,
        onSubmitDocumentParams: this.assembleDocument,
        onSubmitSearchParams: viewerActions.showSearchResult,
      };
    },

    [Topbar]: () => ({
      caption: this.queryReportName(),
      onDismiss: () => window.close(),
    }),

    [Tool]: (instance) => {
      const { viewer, viewerActions, parameters, style } = this.props;
      const tools = {
        [ToolTypes.TOGGLE_TOC_PANE]: {
          active: viewer.sidebarAction === 'TOC',
          hidden: !viewer.toc.kids.length,
          icon: 'columns',
          label: 'TOC',
          title: 'TOC',
          onClick: () => viewerActions.changeSidebarAction('TOC'),
        },
        [ToolTypes.TOGGLE_PARAMETERS_PANE]: {
          active: viewer.sidebarAction === 'PARAMETERS',
          hidden: !parameters.hasData,
          icon: 'filter',
          label: 'Parameters',
          title: 'Parameters',
          onClick: () => viewerActions.changeSidebarAction('PARAMETERS'),
        },
        [ToolTypes.TOGGLE_SEARCH_PANE]: {
          active: viewer.sidebarAction === 'SEARCH',
          disabled: !viewer.hasRenderedDocument,
          icon: 'search',
          label: 'Search',
          title: 'Search',
          onClick: () => viewerActions.changeSidebarAction('SEARCH'),
        },
        [ToolTypes.BACK_TO_PARENT]: {
          disabled: !viewer.parentId || viewer.isProcessing,
          hidden: !viewer.parentId,
          icon: 'arrow-left',
          label: 'Back to Parent',
          title: 'Back to Parent',
          onClick: () => viewerActions.assembleReport(viewer.parentId),
        },
        [ToolTypes.FAST_BACKWARD]: {
          disabled: viewer.pageNumber === 1 || viewer.isProcessing,
          hidden: !viewer.hasRenderedDocument,
          icon: 'fast-backward',
          title: 'First',
          onClick: () => viewerActions.changePageNumber(1),
        },
        [ToolTypes.STEP_BACKWARD]: {
          disabled: viewer.pageNumber === 1 || viewer.isProcessing,
          hidden: !viewer.hasRenderedDocument,
          icon: 'step-backward',
          title: 'Previous',
          onClick: () => viewerActions.changePageNumber(viewer.pageNumber - 1),
        },
        [ToolTypes.STEP_FORWARD]: {
          disabled: viewer.pageNumber === viewer.pageCount || viewer.isProcessing,
          hidden: !viewer.hasRenderedDocument,
          icon: 'step-forward',
          title: 'Next',
          onClick: () => viewerActions.changePageNumber(viewer.pageNumber + 1),
        },
        [ToolTypes.FAST_FORWARD]: {
          disabled: viewer.pageNumber === viewer.pageCount || viewer.isProcessing,
          hidden: !viewer.hasRenderedDocument,
          icon: 'fast-forward',
          title: 'Last',
          onClick: () => viewerActions.changePageNumber(viewer.pageCount),
        },
        [ToolTypes.PRINT]: {
          disabled: viewer.pageNumber === viewer.pageCount || viewer.isProcessing,
          icon: 'print',
          title: 'Print',
          label: 'Print',
          onClick: () => viewerActions.exportDocument({
            documentId: viewer.documentId,
            extensionName: 'Pdf',
            extensionSettings: { printOnOpen: true },
            toggleHistory: viewer.toggleHistory,
          }),
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, { style });
    },

    [Input]: (instance) => {
      const { viewer, viewerActions, style } = this.props;
      const tools = {
        [ToolTypes.PAGE_NUMBER]: {
          hidden: !viewer.hasRenderedDocument,
          placeholder: `${viewer.pageNumber} of ${viewer.pageCount}`,
          onChange: (val) => val > 0 && val <= viewer.pageCount ? viewerActions.changePageNumber(val) : 1,
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, { style });
    },

    [Omni]: (instance) => {
      const { viewer, style } = this.props;
      const isDisabled = !viewer.hasRenderedDocument || viewer.isProcessing;
      const tools = {
        [ToolTypes.TOGGLE_EXPORT_MENU]: {
          caret: isDisabled ? '' : 'sort',
          disabled: isDisabled,
          icon: 'download',
          label: 'Save As...',
          menuRight: true,
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, { style });
    },

    [Menu]: (instance) => {
      const { viewer, viewerActions, style } = this.props;
      const tools = {
        [ToolTypes.EXPORT_AS_PDF]: {
          label: 'Export as PDF Document',
          icon: 'file-pdf-o',
          onClick: () => viewerActions.exportDocument({
            documentId: viewer.documentId,
            extensionName: 'PDF',
            extensionSettings: { saveAsDialog: true },
            toggleHistory: viewer.toggleHistory,
          }),
        },
        [ToolTypes.EXPORT_AS_DOC]: {
          label: 'Export as Word Document',
          icon: 'file-word-o',
          onClick: () => viewerActions.exportDocument({
            documentId: viewer.documentId,
            extensionName: 'Word',
            extensionSettings: { saveAsDialog: true },
            toggleHistory: viewer.toggleHistory,
          }),
        },
        [ToolTypes.EXPORT_AS_IMG]: {
          label: 'Export as Image File',
          icon: 'file-image-o',
          onClick: () => viewerActions.exportDocument({
            documentId: viewer.documentId,
            extensionName: 'Image',
            extensionSettings: { saveAsDialog: true },
            toggleHistory: viewer.toggleHistory,
          }),
        },
        [ToolTypes.EXPORT_AS_WEB]: {
          label: 'Export as MHTML Web Archives',
          icon: 'file-zip-o',
          onClick: () => viewerActions.exportDocument({
            documentId: viewer.documentId,
            extensionName: 'Html',
            extensionSettings: { saveAsDialog: true },
            toggleHistory: viewer.toggleHistory,
          }),
        },
        [ToolTypes.EXPORT_AS_XLS]: {
          label: 'Export as Excel Workbook',
          icon: 'file-excel-o',
          onClick: () => viewerActions.exportDocument({
            documentId: viewer.documentId,
            extensionName: 'Excel',
            extensionSettings: { saveAsDialog: true },
            toggleHistory: viewer.toggleHistory,
          }),
        },
      };

      return Object.assign({}, tools[instance.props.id] || instance.props, { style });
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

ViewerDataProviders.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  location: PropTypes.object,
  style: PropTypes.object,

  // Action Creators
  parametersActions: PropTypes.object,
  uiActions: PropTypes.object,
  viewerActions: PropTypes.object,

  // Viewer Methods (viewerActions)
  assembleReport: PropTypes.func,
  changePageNumber: PropTypes.func,
  changeSidebarAction: PropTypes.func,
  dismissSidebar: PropTypes.func,
  exportDocument: PropTypes.func,
  getDrilldownGroup: PropTypes.func,
  getSearchMatches: PropTypes.func,
  renderReport: PropTypes.func,
  showSearchResult: PropTypes.func,

  // Parameters Methods (parametersActions)
  validateReportParameters: PropTypes.func,

  // UI Methods (uiActions)
  hideViewer: PropTypes.func,

  // Reducers
  document: PropTypes.object,
  parameters: PropTypes.object,
  viewer: PropTypes.object,
};

const mapStateToProps = (state) => ({
  document: state.document,
  documentData: state.document.data,
  parameters: state.parameters,
  viewer: state.viewer,
});

const mapDispatchToProps = (dispatch) => ({
  parametersActions: bindActionCreators(parametersActionCreators, dispatch),
  viewerActions: bindActionCreators(viewerActionCreators, dispatch),
  uiActions: bindActionCreators(uiActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewerDataProviders);
