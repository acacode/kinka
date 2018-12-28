/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/**
 * ArrayBuffer.isView polyfill for IE11-
 */
if (!ArrayBuffer.isView) {
  ArrayBuffer.isView = function(data) {
    return (
      data !== null &&
      typeof data === 'object' &&
      data.buffer instanceof ArrayBuffer
    )
  }
}

/*







*/
/** **********************************************************************/
/*                              base helpers                             */
/** **********************************************************************/

/**
 * Merge all objects into one object
 * @param {...object[]} objects - array of objects which needed for merge together
 * @returns {object} merged all argument objects into one object
 */
function merge() {
  var object = {}
  for (var args = [].slice.call(arguments), x = 0; x < args.length; x++) {
    if (isObject(args[x]))
      for (var attr in args[x]) {
        var value = args[x][attr]
        object[attr] = isObject(value) ? merge(object[attr], value) : value
      }
  }
  return object
}

/**
 * Check value on type object
 * returns true if value have type object otherwise false
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value) {
  return value !== null && typeof value === 'object'
}

/**
 * try to parse string and returns parsed object
 * otherwise return first arguments
 * @param {string|any} data
 * @returns {object|any}
 */
function parseJSON(data) {
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

/**
 * Convert string into valid url encoded form
 * @param {string} form
 * @returns {object} parsed url encoded form
 */
function parseUrlEncodedForm(form) {
  var decoder = decodeURIComponent
  var data = {}
  var pairs = form.split('&')
  var pair
  var pos

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i]
    pos = pair.indexOf('=')
    if (pos === -1) {
      data[decoder(pair)] = ''
    } else {
      data[decoder(pair.slice(0, pos))] = decoder(pair.slice(pos + 1))
    }
  }
  return data
}

/**
 * Check value on defined
 * if value is undefined returns default value (second argument)
 * otherwise return value
 * @param {any} value
 * @param {any} defaultValue
 * @returns {any}
 */
function isUndefined(value, defaultValue) {
  return typeof value === 'undefined' ? defaultValue : value
}

/**
 * Check value on type which contains in arrayOfTypeNames
 * Examples:
 * valueIs('example', ['String']) -> true
 * valueIs({}, ['String', 'Number']) -> false
 * @param {any} value
 * @param {string[]} arrayOfTypeNames
 * @returns {boolean} true/false
 */
function valueIs(value, arrayOfTypeNames) {
  return includes(
    arrayOfTypeNames,
    {}.toString.call(value).replace(/object|[ [\]]/g, '')
  )
}

/**
 * Check string or array on contains includedValue
 * It is polyfill for {string|array}.includes(value)
 * 'cause string.includes method is not supported in IE11-
 * Example:
 * includes('abc', 'a') -> true
 * includes([1,2,3,4], 3) -> true
 * @param {string|array} value
 * @param {any} includedValue
 * @returns {boolean} true if includedValue contains in value otherwise false
 */
function includes(value, includedValue) {
  return value.indexOf(includedValue) > -1
}

/*







*/
/** **********************************************************************/
/*                            request helpers                            */
/** **********************************************************************/

var abortableRequests = {}
var CONTENT_TYPE = 'Content-Type'

/**
 * terminate XMLHttpRequest by abortableKey
 * @param {string} abortableKey
 */
function abortRequest(abortableKey) {
  if (abortableRequests[abortableKey]) {
    abortableRequests[abortableKey].abort()
    removeAbortableKey(abortableKey)
  }
}

/**
 * Create XMLHttpRequest and register it as abortable request
 * @param {string} abortableKey
 * @returns {XMLHttpRequest}
 */
function createAbortableRequest(abortableKey) {
  abortRequest(abortableKey)
  abortableRequests[abortableKey] = new XMLHttpRequest()
  return abortableRequests[abortableKey]
}

/**
 * Delete reference from abortableRequests closure variable
 * @param {string} abortableKey
 */
function removeAbortableKey(abortableKey) {
  abortableRequests[abortableKey] = null
  delete abortableRequests[abortableKey]
}

/**
 * Check request status on success status (200 >= status < 300)
 * If request has success status then will returns true otherwise false
 * If second argument (successStatus) is presented then
 * request status will comparing with second argument
 * @param {XMLHttpRequest} request
 * @param {number} successStatus
 * @returns {boolean} true/false
 */
function requestIsSuccess(request, successStatus) {
  var status = request.status
  return successStatus
    ? status === successStatus
    : (status >= 200 && status < 300) || status === 101
}

/**
 * Set request headers for XMLHttpRequest instance
 * @param {XMLHttpRequest} request
 * @param {object} headers
 */
function setHeaders(request, headers) {
  var headerNames = Object.keys(headers)
  for (var x = 0; x < headerNames.length; x++)
    request.setRequestHeader(headerNames[x], headers[headerNames[x]])
}

/**
 * Attach query params to url
 * Example:
 * getUrlWithQuery('domain.com', { param: 2 }) -> domain.com?param=2
 * @param {string} url
 * @param {object} query
 * @returns {string} URL with query params
 */
function getUrlWithQuery(url, query) {
  var parsed = url.split('?')
  var rawUrl = parsed[0]
  var queryString = parsed[1] ? [parsed[1]] : []
  Object.keys(query).forEach(function(key) {
    queryString.push(key + '=' + encodeURIComponent(query[key]))
  })
  return rawUrl + '?' + queryString.join('&')
}

/**
 * Create request URL via path (/example), baseURL (https://example.com), query ({key: value})
 * @param {string} path
 * @param {string} baseURL
 * @param {object} query
 * @returns {string}
 */
function getUrl(path, baseURL, query) {
  var protocol = path.slice(0, 4)
  var url =
    protocol === 'http' || includes(protocol, 'ws') || includes(protocol, '//')
      ? path
      : baseURL + path
  return query ? getUrlWithQuery(url, query) : url
}

/**
 * Update content type in headers if it is not exist
 * @param {object} headers
 * @param {string} contentType
 * @param {string} charset
 */
function updateContentType(headers, contentType, charset) {
  headers[CONTENT_TYPE] = isUndefined(
    headers[CONTENT_TYPE],
    contentType + ';charset=' + charset
  )
}

/**
 * Transform request data before sending it to the server
 * And also update content type if it needed for specific request data
 * @param {any} data
 * @param {object} headers
 * @param {string} charset
 * @returns {any}
 */
function prepareRequestData(data, headers, charset) {
  if (valueIs(data, ['FormData', 'ArrayBuffer', 'File', 'Blob'])) {
    return data
  }
  if (valueIs(data, ['isURLSearchParams'])) {
    updateContentType(headers, 'application/x-www-form-urlencoded', charset)
    return data.toString()
  }
  if (ArrayBuffer.isView(data)) {
    return data.buffer
  }
  if (isObject(data)) {
    updateContentType(headers, 'application/json', charset)
    return JSON.stringify(data)
  }
  return data
}

/**
 * Create request via XMLHttpRequest
 * @param {string} method
 * @param {string} path
 * @param {object?} requestOptions
 * @param {any?} requestData
 * @returns {Promise}
 */
function createRequest(method, path, requestOptions, requestData) {
  var requestInspector = this.inspectors.request
  var responseInspector = this.inspectors.response
  var options = merge(
    this.instanceOptions,
    requestOptions,
    requestOptions &&
      this.auth &&
      requestOptions.auth &&
      this.auth(requestOptions.auth)
  )
  if (options.body) {
    console.warn(
      'kinka warning: property "body" is deprecated and renamed to "data" in the 1.0.0 kinka release version. Please use "data" property.'
    )
    options.data = options.body
  }
  if (requestData) {
    options.data = requestData
  }
  if (requestInspector) {
    options =
      requestInspector(
        getUrl(path, this.baseURL, options.query),
        method,
        options
      ) || options
  }
  var abortableKey = options.abortableKey
  var url = getUrl(path, this.baseURL, options.query)
  var request = abortableKey
    ? createAbortableRequest(abortableKey)
    : new XMLHttpRequest()
  return new Promise(function(resolve, reject) {
    request.withCredentials = !!options.withAuth
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        var isError = !requestIsSuccess(request, options.successStatus)
        var response = createResponse(request, isError, url)
        if (responseInspector) {
          response = responseInspector(url, method, response) || response
        }
        if (!options.omitCatches && isError) reject(response)
        else resolve(response)
        request = null
        if (abortableKey) removeAbortableKey(abortableKey)
      }
    }
    request.open(method.toUpperCase(), url, true)
    request.timeout = options.timeout
    var requestData = prepareRequestData(
      options.data,
      options.headers,
      options.charset
    )
    if (isObject(options.headers)) setHeaders(request, options.headers)
    request.send(requestData)
  })
}

/*







*/
/** **********************************************************************/
/*                           response helpers                            */
/** **********************************************************************/

function parseResponseData(rawData, contentType) {
  if (!contentType || typeof contentType !== 'string') {
    return rawData
  }
  if (includes(contentType, 'application/json')) {
    return parseJSON(rawData)
  }
  if (includes(contentType, 'application/x-www-form-urlencoded')) {
    return parseUrlEncodedForm(rawData)
  }
  return rawData
}
function createResponse(request, isError, url) {
  var status = request.status
  var type = request.responseType
  var text = !type || type === 'text' ? request.responseText : null
  var data = parseResponseData(
    text || request.response,
    request.getResponseHeader('content-type')
  )
  return {
    data: isError ? null : data,
    err: isError ? (status === 0 ? 'canceled' : data || {}) : null,
    headers: getHeaders(request),
    isError: !!isError,
    isSuccess: !isError,
    response: request.response,
    status: status,
    statusText: request.statusText,
    type: type,
    url: url,
  }
}

function getHeaders(request) {
  return request
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/)
    .reduce(function(headers, line) {
      var splitChar = ': '
      var parts = line.split(splitChar)
      headers[parts.shift()] = parts.join(splitChar)
      return headers
    }, {})
}

// exports all helpers needed for unit tests
module.exports = {
  // base helpers
  includes: includes,
  isObject: isObject,
  isUndefined: isUndefined,
  merge: merge,
  parseJSON: parseJSON,
  parseUrlEncodedForm: parseUrlEncodedForm,
  valueIs: valueIs,
  // request helpers
  abortRequest: abortRequest,
  createRequest: createRequest,
  // response helpers
  createResponse: createResponse,
}
