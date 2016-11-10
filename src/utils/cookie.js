/*
# Cookie Utils

Basic HTTP cookie parser and serializer for HTTP servers.

## References

- [RFC 6266: HTTP State Management Mechanism][rfc-6266]
- [Same-site Cookies][draft-west-first-party-cookies-07]

[draft-west-first-party-cookies-07]: https://tools.ietf.org/html/draft-west-first-party-cookies-07
[rfc-6266]: https://tools.ietf.org/html/rfc6266
[rfc-6266-5.1.4]: https://tools.ietf.org/html/rfc6266#section-5.1.4
[rfc-6266-5.2.1]: https://tools.ietf.org/html/rfc6266#section-5.2.1
[rfc-6266-5.2.2]: https://tools.ietf.org/html/rfc6266#section-5.2.2
[rfc-6266-5.2.3]: https://tools.ietf.org/html/rfc6266#section-5.2.3
[rfc-6266-5.2.4]: https://tools.ietf.org/html/rfc6266#section-5.2.4
[rfc-6266-5.3]: https://tools.ietf.org/html/rfc6266#section-5.3
*/

/**
 * Encode a value into a string suited for a cookie's value
 * @private
 * @param {string} value
 * return {string}
 */
function encode(value) {
  try {
    return encodeURIComponent(value);
  } catch (e) {
    return value;
  }
}

/**
 * Decode a previously-encoded cookie value into a JavaScript string or other object
 * @private
 * @param {string} value
 * return {string}
 */
function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
}

/**
 * Parse an HTTP Cookie header string and returning an object of all cookie name-value pairs
 * @private
 * @param {string} str
 * @return {Object}
 */
function parse(str) {
  if (typeof str !== 'string') throw new TypeError('argument str must be a string');

  const obj = {};
  const pairs = str.split(/ *; */);

  if (!pairs[0]) return obj;

  for (let pair of pairs) {
    pair = pair.split('=');
    obj[decode(pair[0])] = decode(pair[1]);
  }

  return obj;
}

/**
 * Create cookie
 * @public
 * @param {string} name The name for the cookie.
 * @param {string} value The value to set the cookie
 * @param {Object} [options] An optional object containing additional serialization options.
 * @param {string} [options.domain] Define the domain where the cookie is valid.
 * @param {Date} [options.expires] Specifies the Date object to be the value for the Expires Set-Cookie attribute.
 * @param {number} [options.maxAge] Specifies the number (in seconds) to be the value for the Max-Age Set-Cookie attribute.
 * @param {string} [options.path] Define the path where the cookie is valid.
 * @param {boolean} [options.secure] If true, the cookie transmission requires a secure protocol (https).
 */
export function setCookie(name, value, options = {}) {
  const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/; // RegExp to match field-content in RFC 7230 sec 3.2

  if (!fieldContentRegExp.test(name)) throw new TypeError('argument name is invalid');

  if (value && !fieldContentRegExp.test(value)) throw new TypeError('argument value is invalid');

  let str = `${encode(name)}=${encode(value)}`;

  if (value === null) Object.assign(options, { maxAge: -1 });

  if (options.maxAge) {
    if (isNaN(options.maxAge)) throw new Error('maxAge should be a Number');
    str += `; Max-Age=${Math.floor(options.maxAge)}`;
  }

  if (options.path) {
    if (!fieldContentRegExp.test(options.path)) throw new TypeError('option path is invalid');
    str += `; Path=${options.path}`;
  }

  if (options.domain) {
    if (!fieldContentRegExp.test(options.domain)) throw new TypeError('option domain is invalid');
    str += `; Domain=${options.domain}`;
  }

  if (options.expires) {
    if (typeof options.expires.toUTCString !== 'function') throw new TypeError('option expires is invalid');
    str += `; Expires=${options.expires.toUTCString()}`;
  }

  if (options.secure) {
    str += '; Secure';
  }

  document.cookie = str;
}

/**
 * Read cookie
 * @public
 * @param {string} name The name for the cookie.
 * @return {string}
 */
export function getCookie(name) {
  if (typeof name !== 'string') throw new TypeError('argument str must be a string');
  const cookies = parse(document.cookie);
  return !name ? cookies : cookies[name];
}
