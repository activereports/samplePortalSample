## How to turn off features


#### Reports Portal 

1. Navigate to **src > views > Portal**
2. Open **Portal.js**


#### Reports Viewer 

1. Navigate to **src > views > Viewer**
2. Open **Viewer.js**


##### Types of Features

Type                    | Description
----------------------- | -------------------------------------------------- 
ADD_TO_FAVORITES        | Add selected report to Favorites.
ASSIGN_DOC              | Assign categories to selected report.
BACK_TO_PARENT          | Back to parent report.
CREATE_DOC              | Open "Crete Report" dialog. 
CREATE_TAG              | Open "Create Category" dialog. 
CREATE_TAG_ROOT         | Open "Create Category" dialog. 
DELETE_DOC              | After confirmation, delete selected report and remove item from listbox.
DELETE_TAG              | After confirmation, delete selected category and remove item from listbox.
EXPORT_AS_DOC           | Export selected report as Word document.
EXPORT_AS_IMG           | Export selected report as Image file.
EXPORT_AS_PDF           | Export selected report as PDF file.
EXPORT_AS_WEB           | Export selected report as HTML file.
EXPORT_AS_XLS           | Export selected report as Excel Workbook.
FAST_BACKWARD           | Fast backward (Reports viewer).
FAST_FORWARD            | Fast forward (Reports viewer).
MOVE_TAG                | Move category to new location.
PRINT                   | Print selected report.
REMOVE_FROM_FAVORITES   | Remove selected report from Favorites.
RENAME_DOC              | Rename selected report.
RENAME_TAG              | Rename selected category.
SCHEDULE_DOC            | Open Schedule Constructor.
SHARE_DOC               | Open the Change permissions dialog.
SORT_BY_DOCUMENT_NAME   | Sort reports list by document name.
SORT_BY_LAST_MODIFIED   | Sort reports list by modified date.
SORT_BY_MODIFIED_BY     | Sort reports list by modified name.
STEP_BACKWARD           | Step backward (Reports viewer).
STEP_FORWARD            | Step forward (Reports viewer).
TOGGLE_PARAMETERS_PANE  | Toggle parameters panel (Reports viewer).
TOGGLE_PROPERTIES_PANE  | Toggle properties panel.
TOGGLE_SEARCH_PANE      | Toggle search panel (Reports viewer).
TOGGLE_SIDEBAR          | Toggle sidebar visibility.
TOGGLE_TOC_PANE         | Toggle table of content (Reports viewer).
LOG_OUT                 | Log out user.


You can just delete or comment out the features you don't want to use.
For example, update the original line from this:
```
<Menu id={Type.CREATE_DOC} />
```
to this:
```
{ /* <Menu id={Type.CREATE_DOC} /> */ }
```
