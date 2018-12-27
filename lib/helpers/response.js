var baseHelpers = require('./base')
var includes = baseHelpers.includes

function parseResponseData(rawData, contentType) {
  if (includes(contentType, 'application/json')) {
    return baseHelpers.parseJSON(rawData)
  }
  if (includes(contentType, 'application/x-www-form-urlencoded')) {
    return baseHelpers.parseUrlEncodedForm(rawData)
  }
  return rawData
}
function createResponse(request, isError) {
  var type = request.responseType
  var text = !type || type === 'text' ? request.responseText : null
  var data = parseResponseData(
    text || request.response,
    request.getResponseHeader('content-type')
  )
  return {
    data: isError ? undefined : data,
    err: isError ? data || {} : undefined,
    headers: getHeaders(request),
    isError: !!isError,
    isSuccess: !isError,
    response: request.response,
    status: request.status,
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
