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
    errorMessage: isError ? parseResponseData(request.responseText) : undefined,
    isError: !!isError,
    isSuccess: !isError,
  }
}

module.exports = {
  createResponse: createResponse,
}
