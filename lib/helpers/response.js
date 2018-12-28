var baseHelpers = require('./base')
var includes = baseHelpers.includes

function parseResponseData(rawData, contentType) {
  if (!contentType || typeof contentType !== 'string') {
    return rawData
  }
  if (includes(contentType, 'application/json')) {
    return baseHelpers.parseJSON(rawData)
  }
  if (includes(contentType, 'application/x-www-form-urlencoded')) {
    return baseHelpers.parseUrlEncodedForm(rawData)
  }
  return rawData
}
function createResponse(request, isError) {
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

module.exports = {
  createResponse: createResponse,
}
