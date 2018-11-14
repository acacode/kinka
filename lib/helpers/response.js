const pick = require('./base').pick

function parseResponseData(stringifiedData) {
  try {
    const data = JSON.parse(stringifiedData)
    return data
  } catch (e) {
    return stringifiedData
  }
}

function createResponse(request, isError) {
  return {
    status: request.status,
    data:
      request.responseText !== undefined && !isError
        ? parseResponseData(request.responseText)
        : undefined,
    err: isError ? parseResponseData(request.responseText) : undefined,
    isError: !!isError,
    isSuccess: !isError,
    type: request.responseType,
    original: pick(request, ['response', 'responseText', 'statusText']),
  }
}

module.exports = {
  createResponse: createResponse,
}
