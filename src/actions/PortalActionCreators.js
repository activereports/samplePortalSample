/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { getTags } from '../actions/TagsActionsCreators';
import { getSiteSettings } from '../actions/UIActionCreators';
import { getUserInfo } from '../actions/UserActionCreators';

export function initPortal() {
  return (dispatch) =>
    dispatch(getSiteSettings()).then(() =>
      dispatch(getUserInfo()).then(() =>
        dispatch(getTags())
      )
    );
}
