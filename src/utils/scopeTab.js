/*!
 * Adapted from React Modal
 *
 * https://github.com/reactjs/react-modal
 *
 * Released under the MIT license.
 * https://github.com/reactjs/react-modal/blob/master/LICENSE
 *
 * https://github.com/reactjs/react-modal/blob/master/lib/helpers/scopeTab.js
 */

import findTabbable from './tabbable';

export default function (node, event) {
  const tabbable = findTabbable(node);
  if (!tabbable.length) {
    event.preventDefault();
    return;
  }
  const finalTabbable = tabbable[event.shiftKey ? 0 : tabbable.length - 1];
  const leavingFinalTabbable = (
    finalTabbable === document.activeElement ||
      // handle immediate shift+tab after opening with mouse
    node === document.activeElement
  );
  if (!leavingFinalTabbable) return;
  event.preventDefault();
  const target = tabbable[event.shiftKey ? tabbable.length - 1 : 0];
  target.focus();
}
