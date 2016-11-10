/*!
 * Adapted from jQuery UI core
 *
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */

function hidden(el) {
  return (el.offsetWidth <= 0 && el.offsetHeight <= 0) ||
    el.style.display === 'none';
}

function visible(element) {
  while (element) {
    if (element === document.body) break;
    if (hidden(element)) return false;
    element = element.parentNode; // eslint-disable-line no-param-reassign
  }
  return true;
}

function testElement(element, nodeName, isTabIndexNotNaN) {
  if (/input|select|textarea|button|object/.test(nodeName)) return !element.disabled;
  if (nodeName === 'a') return element.href || isTabIndexNotNaN;
  return isTabIndexNotNaN;
}

function focusable(element, isTabIndexNotNaN) {
  const nodeName = element.nodeName.toLowerCase();
  return testElement(element, nodeName, isTabIndexNotNaN) && visible(element);
}

function tabbable(element) {
  let tabIndex = element.getAttribute('tabindex');
  if (tabIndex === null) tabIndex = undefined;
  const isTabIndexNaN = isNaN(tabIndex);
  return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
}

function findTabbableDescendants(element) {
  return [].slice.call(element.querySelectorAll('*'), 0).filter(el => tabbable(el));
}

export default findTabbableDescendants;
