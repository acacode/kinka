import {
  typeCheck,
  includes,
  isUndefined,
  isObject,
  valueIs,
  merge,
  emptyCheck,
} from './base'
import { createResponse } from './response'

/** **********************************************************************/
/*                            request helpers                            */
/** **********************************************************************/

const abortableRequests = {}
const CONTENT_TYPE = 'Content-Type'

/**
 * terminate XMLHttpRequest by cancelToken
 *
 *
 * @param {string} cancelToken
 */
export function abortRequest(cancelToken) {
  if (abortableRequests[cancelToken]) {
    abortableRequests[cancelToken].abort()
    removeAbortableKey(cancelToken)
  }
}

/**
 * Create XMLHttpRequest and register it as abortable request
 *
 *
 * @param {string} cancelToken
 * @returns {XMLHttpRequest}
 */
export function createAbortableRequest(cancelToken) {
  abortRequest(cancelToken)
  abortableRequests[cancelToken] = new XMLHttpRequest()
  return abortableRequests[cancelToken]
}

/**
 * Delete reference from abortableRequests closure variable
 *
 *
 * @param {string} cancelToken
 */
export function removeAbortableKey(cancelToken) {
  abortableRequests[cancelToken] = null
  delete abortableRequests[cancelToken]
}

/**
 * Check request status on success status (200 >= status < 300)
 *
 *
 * If request has success status then will returns true otherwise false
 * If second argument (successStatus) is presented then
 * request status will comparing with second argument
 *
 * @param {XMLHttpRequest} request
 * @param {number} successStatus
 * @returns {boolean} true/false
 */
export function requestIsSuccess(request, successStatus) {
  const status = request.status
  return successStatus
    ? status === successStatus
    : (status >= 200 && status < 300) || status === 101
}

/**
 * Set request headers for XMLHttpRequest instance
 *
 *
 * @param {XMLHttpRequest} request
 * @param {object} headers
 */
export function setHeaders(request, headers) {
  const headerNames = Object.keys(headers)
  for (let x = 0; x < headerNames.length; x++) {
    const header = headerNames[x]
    if (header) request.setRequestHeader(header, headers[header])
  }
}

/**
 * Attach query params to url
 *
 *
 * Example:
 * getUrlWithQuery('domain.com', { param: 2 }) -> domain.com?param=2
 *
 * @param {string} url
 * @param {object} query
 * @returns {string} URL with query params
 */
export function getUrlWithQuery(url, query) {
  typeCheck(query, 'object', 'query in your request options')
  const parsed = url.split('?')
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
 * Create request URL
 *
 *
 * @param {string} path - path (example: '/example')
 * @param {string} baseURL - baseURL (example: 'https://example.com')
 * @param {object} query - query (example { key: 'value' })
 * @returns {string}
 */
export function getUrl(path, baseURL, query) {
  const protocol = path.slice(0, 4)
  const url =
    protocol === 'http' || includes(protocol, 'ws') || includes(protocol, '//')
      ? path
      : baseURL + path
  return query ? getUrlWithQuery(url, query) : url
}

/**
 * Update content type in headers if it is not exist
 *
 *
 * @param {object} headers
 * @param {string} contentType
 * @param {string} charset
 */
export function updateContentType(headers, contentType, charset) {
  if (isObject(headers))
    headers[CONTENT_TYPE] = isUndefined(
      headers[CONTENT_TYPE],
      contentType + ';charset=' + charset
    )
}

/**
 * Transform request data before sending it to the server
 * And also update content type if it needed for specific request data
 *
 *
 * @param {any} data
 * @param {object} headers
 * @param {string} charset
 * @returns {any}
 */
export function prepareRequestData(data, headers, charset) {
  if (valueIs(data, ['FormData', 'ArrayBuffer', 'File', 'Blob'])) {
    return data
  }
  if (valueIs(data, ['URLSearchParams'])) {
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
 *
 *
 * @param {string} method
 * @param {string} path
 * @param {object?} reqOptions
 * @param {any?} requestData
 * @returns {Promise}
 */
export function createRequest(method, path, reqOptions, reqData) {
  if (['post', 'put', 'patch'].indexOf(method) > -1) {
    // swap variables because post put and patch methods have ability
    // to send request data as first argument
    reqData = [reqOptions, (reqOptions = reqData)][0]
  }
  typeCheck(path, 'string', 'path in your request')
  typeCheck(method, 'string', 'name of method in your request')
  typeCheck(reqOptions, 'object', 'request options "reqOptions"', true)
  const requestInspector = this.inspectors.request
  const responseInspector = this.inspectors.response

  const upperCaseMethod = method.toUpperCase()
  // merge instance options with request options
  // if this.auth is exist then also merge result of this.auth call
  let options = merge(
    this.config,
    reqOptions,
    reqOptions && this.auth && reqOptions.auth && this.auth(reqOptions.auth),
    {
      data: reqData || reqOptions.data,
    }
  )
  const baseURL = this.baseURL
  if (requestInspector) {
    options =
      requestInspector(
        getUrl(path, baseURL, options.query),
        upperCaseMethod,
        options
      ) || options
  }
  const cancelToken = options.cancelToken
  const url = getUrl(path, baseURL, options.query)
  typeCheck(
    cancelToken,
    'string',
    'cancelToken in your request [' + url + ']',
    true
  )
  emptyCheck(cancelToken, 'cancelToken')
  const onDownloadProgress = options.onDownloadProgress
  const onUploadProgress = options.onUploadProgress
  typeCheck(onDownloadProgress, 'function', 'onDownloadProgress', true)
  typeCheck(onUploadProgress, 'function', 'onUploadProgress', true)
  // create XMLHttpRequest instance
  // if abortable key is exist then reference of instance will been attached to abortableRequests
  let request = cancelToken
    ? createAbortableRequest(cancelToken)
    : new XMLHttpRequest()

  return new Promise(function(resolve, reject) {
    // Sets that the request should be made using credentials
    // See more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    request.withCredentials = !!options.credentials
    request.open(upperCaseMethod, url, true)

    // Listen on download progress if onDownloadProgress callback is presented
    if (onDownloadProgress)
      request.addEventListener('progress', onDownloadProgress)

    // Listen on upload progress if onUploadProgress callback is presented
    if (onUploadProgress && request.upload)
      request.upload.addEventListener('progress', onUploadProgress)

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        typeCheck(options.successStatus, 'number', 'successStatus', true)
        // completeRequest
        const isError = !requestIsSuccess(request, options.successStatus)
        let response = createResponse(request, isError, url, cancelToken)
        if (responseInspector) {
          response =
            responseInspector(url, upperCaseMethod, response, options) ||
            response
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
    const headers = options.headers
    typeCheck(headers, 'object', 'headers in your request [' + url + ']', true)
    const requestBody = prepareRequestData(
      options.data,
      headers,
      options.charset
    )
    if (isObject(headers)) setHeaders(request, headers)
    request.send(requestBody)
    // TODO: AT NOW OMIT CATCHES IS NOT WORKING
  })
}
