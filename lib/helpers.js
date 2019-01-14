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
  return form.split('&').reduce(function(data, pair) {
    var pos = pair.indexOf('=')
    if (pos === -1) {
      data[decoder(pair)] = ''
    } else {
      data[decoder(pair.slice(0, pos))] = decoder(pair.slice(pos + 1))
    }
    return data
  }, {})
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
 * terminate XMLHttpRequest by cancelToken
 * @param {string} cancelToken
 */
function abortRequest(cancelToken) {
  if (abortableRequests[cancelToken]) {
    abortableRequests[cancelToken].abort()
    removeAbortableKey(cancelToken)
  }
}

/**
 * Create XMLHttpRequest and register it as abortable request
 * @param {string} cancelToken
 * @returns {XMLHttpRequest}
 */
function createAbortableRequest(cancelToken) {
  abortRequest(cancelToken)
  abortableRequests[cancelToken] = new XMLHttpRequest()
  return abortableRequests[cancelToken]
}

/**
 * Delete reference from abortableRequests closure variable
 * @param {string} cancelToken
 */
function removeAbortableKey(cancelToken) {
  abortableRequests[cancelToken] = null
  delete abortableRequests[cancelToken]
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
  for (var x = 0; x < headerNames.length; x++) {
    var header = headerNames[x]
    if (header) request.setRequestHeader(header, headers[header])
  }
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
  return (
    parsed[0] +
    '?' +
    Object.keys(query)
      .reduce(function(paramsArray, param) {
        paramsArray.push(param + '=' + encodeURIComponent(query[param]))
        return paramsArray
      }, parsed[1] ? [parsed[1]] : [])
      .join('&')
  )
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
  return isUndefined(data, null)
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
  var upperCaseMethod = method.toUpperCase()
  // merge instance options with request options
  // if this.auth is exist then also merge result of this.auth call
  var options = merge(
    this.instanceOptions,
    requestOptions,
    requestOptions &&
      this.auth &&
      requestOptions.auth &&
      this.auth(requestOptions.auth)
  )
  var data = options.data
  var baseURL = this.baseURL
  // special for requests which have body
  if (requestData) {
    data = requestData
  }
  if (requestInspector) {
    options =
      requestInspector(
        getUrl(path, baseURL, options.query),
        upperCaseMethod,
        options
      ) || options
  }
  if (options.abortableKey) {
    console.warn(
      'abortableKey property has been deprecated and will be removed in the next release. Please use "cancelToken" instead of.'
    )
    options.cancelToken = options.abortableKey
  }
  var cancelToken = options.cancelToken
  var url = getUrl(path, baseURL, options.query)
  // create XMLHttpRequest instance
  // if abortable key is exist then reference of instance will been attached to abortableRequests
  var request = cancelToken
    ? createAbortableRequest(cancelToken)
    : new XMLHttpRequest()
  return new Promise(function(resolve, reject) {
    // Sets that the request should be made using credentials
    // See more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    request.withCredentials = !!options.withAuth

    request.open(upperCaseMethod, url, true)

    // Listen on download progress if onDownloadProgress callback is presented
    if (options.onDownloadProgress) {
      request.addEventListener('progress', options.onDownloadProgress)
    }

    // Listen on upload progress if onUploadProgress callback is presented
    if (options.onUploadProgress && request.upload) {
      request.upload.addEventListener('progress', options.onUploadProgress)
    }

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        var isError = !requestIsSuccess(request, options.successStatus)
        var response = createResponse(request, isError, url)
        if (responseInspector) {
          response =
            responseInspector(url, upperCaseMethod, response) || response
        }
        if (!options.omitCatches && isError) reject(response)
        else resolve(response)
        request = null
        if (cancelToken) removeAbortableKey(cancelToken)
      }
    }
    // after open and before send because IE will cause an error
    // if timeout has been setted before open or after send
    request.timeout = options.timeout
    var headers = options.headers
    var requestData = prepareRequestData(data, headers, options.charset)
    if (isObject(headers)) setHeaders(request, headers)
    request.send(requestData)
  })
}

/*







*/
/** **********************************************************************/
/*                           response helpers                            */
/** **********************************************************************/

/**
 * Prepare response data before send it to client
 * Transforming data, for example parse json if
 * request have 'application/json' content type
 * @param {any} rawData
 * @param {*} contentType
 * @returns {object|string|any}
 */
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

/**
 * Create structure which will returns as first argument
 * when promise with request has been completed
 * Example:
 * kinka.get('/data').then(response => {
 *  // response it is result of this helper
 * })
 * @param {XMLHttpRequest} request
 * @param {boolean} isError - usually it is result of !requestIsSuccess
 * @param {string} url
 * @returns {object}
 */
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
    // empty object it is noop for checking request on error
    // example const { err } = kinka.get('/some')
    // if (err) -> true, because empty object is truthy value
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

/**
 * Parse headers of the instance of XMLHttpRequest
 * because .getAllResponseHeaders returns string and it
 * needs to parse to object
 * @param {XMLHttpRequest} request
 * @returns {object} headers
 */
function getHeaders(request) {
  return request
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/)
    .reduce(function(headers, line) {
      var splitChar = ': '
      var parts = line.split(splitChar)
      var header = parts.shift()
      if (header) headers[header] = parts.join(splitChar)
      return headers
    }, {})
}

// exports most helpers which needed for unit tests
// Exception of above rule is 'isUndefined' and 'createRequest'
// because they actually using in kinka
// differences between exports is the size of minified version
module.exports =
  process.env.NODE_ENV === 'production'
    ? { isUndefined: isUndefined, createRequest: createRequest }
    : {
        // base helpers
        includes: includes,
        isObject: isObject,
        isUndefined: isUndefined,
        merge: merge,
        parseJSON: parseJSON,
        parseUrlEncodedForm: parseUrlEncodedForm,
        valueIs: valueIs,
        // request helpers
        abortableRequests: abortableRequests,
        abortRequest: abortRequest,
        createAbortableRequest: createAbortableRequest,
        createRequest: createRequest,
        getUrl: getUrl,
        getUrlWithQuery: getUrlWithQuery,
        prepareRequestData: prepareRequestData,
        removeAbortableKey: removeAbortableKey,
        requestIsSuccess: requestIsSuccess,
        setHeaders: setHeaders,
        updateContentType: updateContentType,
        // response helpers
        createResponse: createResponse,
        parseResponseData: parseResponseData,
        getHeaders: getHeaders,
      }
