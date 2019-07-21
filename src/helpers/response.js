import { includes, parseJSON, parseUrlEncodedForm } from './base'

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
/*                           response helpers                            */
/** **********************************************************************/

/**
 * Prepare response data before send it to client.
 *
 *
 * Transforming data, if data can be parsed to JSON
 * then will be returned JSON parsed string, otherwise
 * raw data.
 *
 * @param {any} rawData
 * @param {*} contentType
 * @returns {object|string|any}
 */
export function parseResponseData(rawData, contentType) {
  if (
    typeof contentType === 'string' &&
    includes(contentType, 'application/x-www-form-urlencoded')
  ) {
    return parseUrlEncodedForm(rawData)
  }
  return parseJSON(rawData)
}

/**
 * Create structure which will returns as first argument
 * when promise with request has been completed.
 *
 *
 * Example:
 * kinka.get('/data').then(response => {
 *  // response it is result of this helper
 * })
 *
 * @param {XMLHttpRequest} request
 * @param {boolean} isError - usually it is result of !requestIsSuccess
 * @param {string} url
 * @param {string} cancelToken - needed for default error message
 * @returns {object}
 */
export function createResponse(request, isError, url, cancelToken) {
  const status = request.status
  const type = request.responseType
  const text = !type || type === 'text' ? request.responseText : null
  const data = parseResponseData(
    text || request.response,
    request.getResponseHeader('content-type')
  )
  return {
    data: isError ? null : data,
    // empty object it is noop for checking request on error
    // example const { err } = kinka.get('/some')
    // if (err) -> true, because empty object is truthy value
    err: isError
      ? !status ? (cancelToken ? 'canceled' : 'network error') : data || {}
      : null,
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
 *
 *
 * @param {XMLHttpRequest} request
 * @returns {object} headers
 */
export function getHeaders(request) {
  return request
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/)
    .reduce(function(headers, line) {
      const splitChar = ': '
      const parts = line.split(splitChar)
      const header = parts.shift()
      if (header) headers[header] = parts.join(splitChar)
      return headers
    }, {})
}
