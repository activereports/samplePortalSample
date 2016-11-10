import { endpoints } from '../config';

/**
 * @function createSearchRegex
 * @access private
 * @param {object} searchOptions
 * @returns {RegExp}
 */
function createSearchRegex(searchOptions) {
  const escapeChars = '\\|[]()+*.{}$^?';
  let pattern = '';

  for (let i = 0; i < searchOptions.text.length; i++) {
    const ch = searchOptions.text[i];
    if (escapeChars.indexOf(ch) >= 0) pattern += '\\';
    pattern += ch;
  }

  if (searchOptions.wholePhrase) {
    pattern = `\\b${pattern}`;
    pattern += '\\b';
  }

  let flags = 'm';
  if (!searchOptions.matchCase) flags += 'i';

  return new RegExp(pattern, flags);
}

/**
 * Checks whether a URI is absolute
 * @function isAbsoluteUri
 * @access public
 * @param {string} uri - URI to analyse
 * @returns {boolean} - True if UriReference is absolute.
 */
export function isAbsoluteUri(uri) {
  return (/^https?:\/\//i).test(uri);
}

/**
 * Checks whether a URI is Base64
 * @function isBase64
 * @access public
 * @param {string} uri - URI to analyse
 * @returns {boolean} - True if UriReference is Base64.
 */
export function isBase64(uri) {
  const r = new RegExp('^data:\\w+/\\w+;base64,', 'i');
  return r.test(uri);
}

/**
 * @function splitEscaped
 * @access public
 * @param {string} str
 * @param {string} delimiter
 * @returns {array}
 */
export function splitEscaped(str, delimiter) {
  if (str === null || str === undefined) return [];
  if (!delimiter) return [str];
  if (delimiter === '\\') throw new Error('\\ delimiter is not supported');
  if (delimiter.length > 1) throw new Error('delimiter should be single character');

  const res = [];
  let part = '';
  let escaped = false;
  let i = 0;
  while (i < str.length) {
    const current = str.charAt(i);
    if (escaped) {
      part += current;
      escaped = false;
    } else if (current === '\\') {
      escaped = true;
    } else if (current === delimiter) {
      res.push(part);
      part = '';
    } else {
      part += current;
    }
    i++;
  }
  res.push(part);
  return res;
}

/**
 * @function parseDrillthroughLink
 * @access public
 * @param {string} link
 * @returns {array|object}
 */
export function parseDrillthroughLink(link) {
  const queryStart = link.indexOf('?');
  if (queryStart === -1) return { reportName: '', params: [] };

  function parseParameters(str) {
    const result = [];
    const parameters = splitEscaped(str, ';');
    parameters.forEach(parameter => {
      const keyValue = splitEscaped(parameter, '=');
      if (keyValue.length > 1) {
        const key = keyValue[0];
        const value = keyValue[1];
        if (key) {
          const values = splitEscaped(value, ',');
          if (values.length > 1) {
            result.push({
              name: key,
              values: values.map(item => ({ value: item })),
              multivalue: true,
            });
          } else {
            result.push({
              name: key,
              values: [values[0]],
            });
          }
        }
      }
    });
    return result;
  }

  let reportName = '';
  let params = [];
  const query = link.slice(queryStart + 1);
  query.split('&').forEach(queryItem => {
    const parts = queryItem.split(/=(.*)/); // prevent split on second '=' occurrence
    if (parts.length < 2) return;

    if (parts[0] === 'ReportId') {
      reportName = decodeURIComponent(parts[1]);
    } else if (parts[0] === 'Parameters') {
      params = parseParameters(decodeURIComponent(parts[1]));
    }
  });

  return { reportName, params };
}

/**
 * Performs search with given options.
 * @function getSearchMatches
 * @access public
 * @param {HTMLElement} documentContent
 * @param {object} searchOptions
 * @param {string} searchOptions.text
 * @param {boolean} [searchOptions.matchCase]
 * @param {boolean} [searchOptions.wholePhrase]
 * @param {number} [searchOptions.maxSearchResults]
 * @returns {array|object}
 */
export function getSearchMatches(documentContent, searchOptions) {
  const markup = document.createElement('html');
  markup.innerHTML = documentContent;

  const textElements = 'div, p, a, td, li, span';
  const pages = markup.querySelectorAll('div.page') || [];
  const regex = createSearchRegex(searchOptions);
  const result = [];

  for (let key = 0; key < pages.length; key++) {
    const page = pages[key];
    const elements = page.querySelectorAll(textElements);
    for (let idx = 0; idx < elements.length; idx++) {
      const element = elements[idx];
      const text = element.childNodes.length ? element.lastChild.textContent : '';
      element.removeAttribute('data-match-id');
      if (text.match(regex) && searchOptions.text) {
        element.setAttribute('data-match-id', idx);
        result.push({ idx, text, page: parseInt(key, 10) + 1 });
      }
    }
  }

  return ({ result, document: markup.outerHTML });
}

/**
 * Gets page count
 * @function getPageCount
 * @param {markup} markup
 */
export function getPageCount(markup) {
  const pages = markup.querySelectorAll('div.page');
  return pages && pages.length ? pages.length : 1;
}

export function getTocUrl(markup) {
  const meta = markup.querySelector('meta[name="tocUrl"]');
  return meta ? meta.getAttribute('content') : null;
}

export function getDocumentId(markup) {
  const meta = markup.querySelector('meta[name=DocumentId]');
  return meta ? meta.getAttribute('content') : null;
}

export function setParams(markup, pageNumber, matchId) {
  const documentContent = document.createElement('html');
  documentContent.innerHTML = markup;
  const pages = documentContent.querySelectorAll('div.page') || [];

  for (let key = 0; key < pages.length; key++) {
    const page = pages[key];
    if ((pageNumber - 1) === parseInt(key, 10)) {
      if (matchId) {
        const match = page.querySelectorAll(`[data-match-id="${matchId}"]`);
        if (match.length) match[0].setAttribute('data-match-element', '');
      }
      page.style.display = 'block';
    } else {
      page.style.display = 'none';
    }
  }

  return documentContent.outerHTML;
}

/**
 * Create HTML markup
 * @function createMarkup
 * @access public
 * @param {*|string} rawData
 * @param {string} resourceHandlerEndpoint
 * @param {number} [pageNumber]
 * @returns {*|string}
 */
export function createMarkup(rawData, resourceHandlerEndpoint, pageNumber = 1) {
  if (rawData === null) return null;

  const documentContent = document.createElement('html');

  documentContent.innerHTML = rawData;

  // Fix image urls in style
  const style = documentContent.getElementsByTagName('style')[0];
  if (style && style.length) {
    let text = style.textContent;
    text = text.replace(/background-image\s*:\s*url\((.*)\)/g, (match, url) => {
      const newUrl = isAbsoluteUri(url.replace(/&amp;/g, '&')) ? url : resourceHandlerEndpoint + url;
      return 'background-image:url({0})'.format(newUrl);
    });
    style.text(text);
  }

  // Update absolute position to relative
  const pages = documentContent.querySelectorAll('div.page') || [];
  for (let key = 0; key < pages.length; key++) {
    const page = pages[key];
    page.id = `page_${key}`;
    page.style.display = (pageNumber - 1) === parseInt(key, 10) ? 'block' : 'none';
    page.style.border = 'solid 50px white';
    page.style.boxSizing = 'content-box';

    // Get all direct child elements
    for (const child in page.childNodes) {
      if (page.childNodes.hasOwnProperty(child)) {
        const childNode = page.childNodes[child];
        if (childNode.nodeType === 1) {
          childNode.style.position = 'relative';
          childNode.style.top = '';
        }
      }
    }
  }

  // Fix relative image urls
  // if they are not base64 or absolute url path
  const images = documentContent.getElementsByTagName('img') || [];
  for (let key = 0; key < images.length; key++) {
    const image = images[key];
    const src = image.getAttribute('src');
    if (!isBase64(src) && !isAbsoluteUri(src)) image.src = `${resourceHandlerEndpoint}/${src}`;
  }

  return documentContent;
}

/**
 * Print a PDF document
 * @function printDocument
 * @access public
 * @param {string} url
 * @param {string} [title='']
 * @param {boolean} [useBlank=true]
 */
export function printDocument(url, title = '', useBlank = true) {
  const exportUrl = isAbsoluteUri(url) ? url : `${endpoints.arsResourceHandler}/${url}`;
  if (useBlank) {
    const html = [];
    const alt = 'This browser does not support PDFs. Please download the PDF to print it:';
    const printWindow = window.open('about:blank', 'printElementWindow');

    html.push('<html>');
    html.push(`<head><title>${title}</title></head>`);
    html.push('<body style="height:100%; width:100%; overflow:hidden; margin:0">');
    html.push(`<object data="${exportUrl}" type="application/pdf" width="100%" height="100%">`);
    html.push(`<p>${alt} <a href="${url}">Download PDF</a>.</p>`);
    html.push('</object>');
    html.push('</body>');
    html.push('</html>');

    if (printWindow) {
      const markup = printWindow.document;
      markup.open();
      markup.write(html.join(''));
      markup.close();
    } else {
      window.location.assign(exportUrl, '_blank');
    }
  } else {
    window.location.replace(exportUrl);
  }
}

/**
 * Export a document
 * @function downloadDocument
 * @access public
 * @param {string} documentUrl
 * @param {boolean} [useBlank=true]
 */
export function downloadDocument(documentUrl, useBlank = true) {
  const exportUrl = isAbsoluteUri(documentUrl) ? documentUrl : `${endpoints.arsResourceHandler}/${documentUrl}`;
  if (useBlank) {
    const target = window.open(exportUrl);
    if (!target) window.location.assign(exportUrl, '_blank');
  } else {
    window.location.replace(exportUrl);
  }
}
