var parseJSON = require('./base').parseJSON

function createResponse(request, isError) {
  var data = request.responseText
  var parsedData = parseJSON(data)
  return {
    data: isError ? undefined : parsedData,
    err: isError ? parsedData || {} : undefined,
    headers: getHeaders(request),
    isError: !!isError,
    isSuccess: !isError,
    response: request.response,
    status: request.status,
    statusText: request.statusText,
    type: request.responseType,
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
