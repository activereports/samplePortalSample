/*
 * This file is part of the Sample Customized ActiveReports Portal project.
 *
 * @author Yuri Kuschinsky <asatelit@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


/**
 * Check if given data is not an empty object
 * @access public
 * @param data
 * @returns {boolean|*} true if data is not an empty object, false otherwise
 */
export function isNotEmptyObject(data) {
  if (data === null || typeof data !== 'object') return false;
  return !!Object.keys(data).length;
}

/**
 * Creating an object with values equal to its keys
 * @function keyMirror
 * @access public
 * @param {Object} obj
 * @returns {Object}
 */
export function keyMirror(obj) {
  Object.keys(obj).forEach(key => Object.assign(obj, { [key]: key }));
  return obj;
}

/**
 * Convert declarative reducer to standard reducer
 * @function createReducer
 * @access public
 * @param {Object} initialState
 * @param {Object} reducerMap
 * @returns {Object}
 */
export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer ? reducer(state, action.payload, action.meta) : state;
  };
}

/**
 * Returns the decoded query part of the URI string parameters
 *
 * @function setQueryParams
 * @access public
 * @param {Object} query - Queries set
 * @returns {string}
 */
export function setQueryParams(query) {
  const params = Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
    .replace(/%20/g, '+');
  return `?${params}`;
}

/**
 * Formats the specified date using the rules of this date format
 *
 * @function formatDateString
 * @access public
 * @param {string} dateString - Date String
 * @param {string} [locale=en-US] - Locale String
 * @returns {string}
 */
export function formatDateString(dateString, locale = 'en-US') {
  const date = new Date(Date.parse(dateString));
  return date.toLocaleString(locale);
}

/**
 * Gets a user locale language
 *
 * @function formatDateString
 * @access public
 * @param {Object} [options={}]
 * @param {Array} options.supportedLocales An array of supported locales
 * @returns {string|boolean}
 */
export function getCurrentLocale(options = {}) {
  const defaultLocale = 'en-US';
  if (typeof navigator === 'undefined') return defaultLocale;
  const browserLanguage = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
  if (typeof options.supportedLocales === 'undefined') return browserLanguage;
  if (options.supportedLocales.indexOf(browserLanguage) > -1) return browserLanguage;
  return defaultLocale;
}

/**
 * Open a window
 * @function openWindow
 * @access public
 * @param {string} url
 * @param {boolean} [useBlank=true]
 */
export function openWindow(url, useBlank = true) {
  if (useBlank) {
    const target = window.open(url);
    if (!target) window.location.assign(url, '_blank');
  } else {
    window.location.replace(url);
  }
}
