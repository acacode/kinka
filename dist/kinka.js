(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["kinka"] = factory();
	else
		root["kinka"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/kinka.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/helpers.js":
/*!************************!*\
  !*** ./lib/helpers.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/**\n * Copyright (c) acacode, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n *\n * @flow\n */\n\n/**\n * ArrayBuffer.isView polyfill for IE11-\n */\nif (!ArrayBuffer.isView) {\n  ArrayBuffer.isView = function (data) {\n    return data !== null && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data.buffer instanceof ArrayBuffer;\n  };\n}\n\n/*\n\n\n\n\n\n\n\n*/\n/** **********************************************************************/\n/*                              base helpers                             */\n/** **********************************************************************/\n\n/**\n * Merge all objects into one object\n *\n *\n * @param {...object[]} objects - array of objects which needed for merge together\n * @returns {object} merged all argument objects into one object\n */\nfunction merge() {\n  var object = {};\n  for (var args = [].slice.call(arguments), x = 0; x < args.length; x++) {\n    if (isObject(args[x])) for (var attr in args[x]) {\n      var value = args[x][attr];\n      object[attr] = isObject(value) ? merge(object[attr], value) : value;\n    }\n  }\n  return object;\n}\n\n/**\n * Check type of value on object type\n *\n *\n * returns true if value have type object otherwise false\n *\n * @param {any} value\n * @returns {boolean}\n */\nfunction isObject(value) {\n  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';\n}\n\n/**\n * Try to parse string and returns parsed object\n * otherwise return first arguments\n *\n * @param {string|any} data\n * @returns {object|any}\n */\nfunction parseJSON(data) {\n  try {\n    return JSON.parse(data);\n  } catch (e) {\n    return data;\n  }\n}\n\n/**\n * Convert string into valid url encoded form\n *\n *\n * @param {string} form\n * @returns {object} parsed url encoded form\n */\nfunction parseUrlEncodedForm(form) {\n  var decoder = decodeURIComponent;\n  return form.split('&').reduce(function (data, pair) {\n    var pos = pair.indexOf('=');\n    if (pos === -1) {\n      data[decoder(pair)] = '';\n    } else {\n      data[decoder(pair.slice(0, pos))] = decoder(pair.slice(pos + 1));\n    }\n    return data;\n  }, {});\n}\n\n/**\n * Check value on undefined\n *\n *\n * if value is undefined returns default value (second argument)\n * otherwise return value\n *\n * @param {any} value\n * @param {any} defaultValue\n * @returns {any}\n */\nfunction isUndefined(value, defaultValue) {\n  return typeof value === 'undefined' ? defaultValue : value;\n}\n\n/**\n * Check value on type which contains in arrayOfTypeNames\n *\n *\n * Examples:\n * valueIs('example', ['String']) -> true\n * valueIs({}, ['String', 'Number']) -> false\n *\n * @param {any} value\n * @param {string[]} arrayOfTypeNames\n * @returns {boolean} true/false\n */\nfunction valueIs(value, arrayOfTypeNames) {\n  return includes(arrayOfTypeNames, {}.toString.call(value).replace(/object|[ [\\]]/g, ''));\n}\n\n/**\n * Check string or array on contains includedValue\n * It is polyfill for {string|array}.includes(value)\n * 'cause string.includes method is not supported in IE11-\n *\n *\n * Example:\n * includes('abc', 'a') -> true\n * includes([1,2,3,4], 3) -> true\n *\n * @param {string|array} value\n * @param {any} includedValue\n * @returns {boolean} true if includedValue contains in value otherwise false\n */\nfunction includes(value, includedValue) {\n  return value.indexOf(includedValue) > -1;\n}\n\n/*\n\n\n\n\n\n\n\n*/\n/** **********************************************************************/\n/*                            request helpers                            */\n/** **********************************************************************/\n\nvar abortableRequests = {};\nvar CONTENT_TYPE = 'Content-Type';\n\n/**\n * terminate XMLHttpRequest by cancelToken\n *\n *\n * @param {string} cancelToken\n */\nfunction abortRequest(cancelToken) {\n  if (abortableRequests[cancelToken]) {\n    abortableRequests[cancelToken].abort();\n    removeAbortableKey(cancelToken);\n  }\n}\n\n/**\n * Create XMLHttpRequest and register it as abortable request\n *\n *\n * @param {string} cancelToken\n * @returns {XMLHttpRequest}\n */\nfunction createAbortableRequest(cancelToken) {\n  abortRequest(cancelToken);\n  abortableRequests[cancelToken] = new XMLHttpRequest();\n  return abortableRequests[cancelToken];\n}\n\n/**\n * Delete reference from abortableRequests closure variable\n *\n *\n * @param {string} cancelToken\n */\nfunction removeAbortableKey(cancelToken) {\n  abortableRequests[cancelToken] = null;\n  delete abortableRequests[cancelToken];\n}\n\n/**\n * Check request status on success status (200 >= status < 300)\n *\n *\n * If request has success status then will returns true otherwise false\n * If second argument (successStatus) is presented then\n * request status will comparing with second argument\n *\n * @param {XMLHttpRequest} request\n * @param {number} successStatus\n * @returns {boolean} true/false\n */\nfunction requestIsSuccess(request, successStatus) {\n  var status = request.status;\n  return successStatus ? status === successStatus : status >= 200 && status < 300 || status === 101;\n}\n\n/**\n * Set request headers for XMLHttpRequest instance\n *\n *\n * @param {XMLHttpRequest} request\n * @param {object} headers\n */\nfunction setHeaders(request, headers) {\n  var headerNames = Object.keys(headers);\n  for (var x = 0; x < headerNames.length; x++) {\n    var header = headerNames[x];\n    if (header) request.setRequestHeader(header, headers[header]);\n  }\n}\n\n/**\n * Attach query params to url\n *\n *\n * Example:\n * getUrlWithQuery('domain.com', { param: 2 }) -> domain.com?param=2\n *\n * @param {string} url\n * @param {object} query\n * @returns {string} URL with query params\n */\nfunction getUrlWithQuery(url, query) {\n  var parsed = url.split('?');\n  return parsed[0] + '?' + Object.keys(query).reduce(function (paramsArray, param) {\n    paramsArray.push(param + '=' + encodeURIComponent(query[param]));\n    return paramsArray;\n  }, parsed[1] ? [parsed[1]] : []).join('&');\n}\n\n/**\n * Create request URL\n *\n *\n * @param {string} path - path (example: '/example')\n * @param {string} baseURL - baseURL (example: 'https://example.com')\n * @param {object} query - query (example { key: 'value' })\n * @returns {string}\n */\nfunction getUrl(path, baseURL, query) {\n  var protocol = path.slice(0, 4);\n  var url = protocol === 'http' || includes(protocol, 'ws') || includes(protocol, '//') ? path : baseURL + path;\n  return query ? getUrlWithQuery(url, query) : url;\n}\n\n/**\n * Update content type in headers if it is not exist\n *\n *\n * @param {object} headers\n * @param {string} contentType\n * @param {string} charset\n */\nfunction updateContentType(headers, contentType, charset) {\n  if (isObject(headers)) headers[CONTENT_TYPE] = isUndefined(headers[CONTENT_TYPE], contentType + ';charset=' + charset);\n}\n\n/**\n * Transform request data before sending it to the server\n * And also update content type if it needed for specific request data\n *\n *\n * @param {any} data\n * @param {object} headers\n * @param {string} charset\n * @returns {any}\n */\nfunction prepareRequestData(data, headers, charset) {\n  if (valueIs(data, ['FormData', 'ArrayBuffer', 'File', 'Blob'])) {\n    return data;\n  }\n  if (valueIs(data, ['URLSearchParams'])) {\n    updateContentType(headers, 'application/x-www-form-urlencoded', charset);\n    return data.toString();\n  }\n  if (ArrayBuffer.isView(data)) {\n    return data.buffer;\n  }\n  if (isObject(data)) {\n    updateContentType(headers, 'application/json', charset);\n    return JSON.stringify(data);\n  }\n  return isUndefined(data, null);\n}\n\n/**\n * Create request via XMLHttpRequest\n *\n *\n * @param {string} method\n * @param {string} path\n * @param {object?} requestOptions\n * @param {any?} requestData\n * @returns {Promise}\n */\nfunction createRequest(method, path, requestOptions, requestData) {\n  var requestInspector = this.inspectors.request;\n  var responseInspector = this.inspectors.response;\n  var upperCaseMethod = method.toUpperCase();\n  // merge instance options with request options\n  // if this.auth is exist then also merge result of this.auth call\n  var options = merge(this.instanceOptions, requestOptions, requestOptions && this.auth && requestOptions.auth && this.auth(requestOptions.auth));\n  var baseURL = this.baseURL;\n  if (requestInspector) {\n    options = requestInspector(getUrl(path, baseURL, options.query), upperCaseMethod, options) || options;\n  }\n  var cancelToken = options.cancelToken;\n  var url = getUrl(path, baseURL, options.query);\n  var onDownloadProgress = options.onDownloadProgress;\n  var onUploadProgress = options.onUploadProgress;\n  // create XMLHttpRequest instance\n  // if abortable key is exist then reference of instance will been attached to abortableRequests\n  var request = cancelToken ? createAbortableRequest(cancelToken) : new XMLHttpRequest();\n\n  return new Promise(function (resolve, reject) {\n    // Sets that the request should be made using credentials\n    // See more: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials\n    request.withCredentials = !!options.withAuth;\n    request.open(upperCaseMethod, url, true);\n\n    // Listen on download progress if onDownloadProgress callback is presented\n    if (onDownloadProgress) request.addEventListener('progress', onDownloadProgress);\n\n    // Listen on upload progress if onUploadProgress callback is presented\n    if (onUploadProgress && request.upload) request.upload.addEventListener('progress', onUploadProgress);\n\n    request.onreadystatechange = function () {\n      if (request.readyState === 4) {\n        var isError = !requestIsSuccess(request, options.successStatus);\n        var response = createResponse(request, isError, url);\n        if (responseInspector) {\n          response = responseInspector(url, upperCaseMethod, response) || response;\n        }\n        if (!options.omitCatches && isError) reject(response);else resolve(response);\n        request = null;\n        if (cancelToken) removeAbortableKey(cancelToken);\n      }\n    };\n    // after open and before send because IE will cause an error\n    // if timeout has been setted before open or after send\n    request.timeout = options.timeout;\n    var headers = options.headers;\n    var requestBody = prepareRequestData(requestData || options.data, headers, options.charset);\n    if (isObject(headers)) setHeaders(request, headers);\n    request.send(requestBody);\n  });\n}\n\n/*\n\n\n\n\n\n\n\n*/\n/** **********************************************************************/\n/*                           response helpers                            */\n/** **********************************************************************/\n\n/**\n * Prepare response data before send it to client.\n *\n *\n * Transforming data, if data can be parsed to JSON\n * then will be returned JSON parsed string, otherwise\n * raw data.\n *\n * @param {any} rawData\n * @param {*} contentType\n * @returns {object|string|any}\n */\nfunction parseResponseData(rawData, contentType) {\n  if (typeof contentType === 'string' && includes(contentType, 'application/x-www-form-urlencoded')) {\n    return parseUrlEncodedForm(rawData);\n  }\n  return parseJSON(rawData);\n}\n\n/**\n * Create structure which will returns as first argument\n * when promise with request has been completed.\n *\n *\n * Example:\n * kinka.get('/data').then(response => {\n *  // response it is result of this helper\n * })\n *\n * @param {XMLHttpRequest} request\n * @param {boolean} isError - usually it is result of !requestIsSuccess\n * @param {string} url\n * @returns {object}\n */\nfunction createResponse(request, isError, url) {\n  var status = request.status;\n  var type = request.responseType;\n  var text = !type || type === 'text' ? request.responseText : null;\n  var data = parseResponseData(text || request.response, request.getResponseHeader('content-type'));\n  return {\n    data: isError ? null : data,\n    // empty object it is noop for checking request on error\n    // example const { err } = kinka.get('/some')\n    // if (err) -> true, because empty object is truthy value\n    err: isError ? status === 0 ? 'canceled' : data || {} : null,\n    headers: getHeaders(request),\n    isError: !!isError,\n    isSuccess: !isError,\n    response: request.response,\n    status: status,\n    statusText: request.statusText,\n    type: type,\n    url: url\n  };\n}\n\n/**\n * Parse headers of the instance of XMLHttpRequest\n * because .getAllResponseHeaders returns string and it\n * needs to parse to object\n *\n *\n * @param {XMLHttpRequest} request\n * @returns {object} headers\n */\nfunction getHeaders(request) {\n  return request.getAllResponseHeaders().trim().split(/[\\r\\n]+/).reduce(function (headers, line) {\n    var splitChar = ': ';\n    var parts = line.split(splitChar);\n    var header = parts.shift();\n    if (header) headers[header] = parts.join(splitChar);\n    return headers;\n  }, {});\n}\n\n// exports most helpers which needed for unit tests\n// Exception of above rule is 'isUndefined' and 'createRequest'\n// because they actually using in kinka\n// differences between exports is the size of minified version\nmodule.exports =  false ? undefined : {\n  // base helpers\n  includes: includes,\n  isObject: isObject,\n  isUndefined: isUndefined,\n  merge: merge,\n  parseJSON: parseJSON,\n  parseUrlEncodedForm: parseUrlEncodedForm,\n  valueIs: valueIs,\n  // request helpers\n  abortableRequests: abortableRequests,\n  abortRequest: abortRequest,\n  createAbortableRequest: createAbortableRequest,\n  createRequest: createRequest,\n  getUrl: getUrl,\n  getUrlWithQuery: getUrlWithQuery,\n  prepareRequestData: prepareRequestData,\n  removeAbortableKey: removeAbortableKey,\n  requestIsSuccess: requestIsSuccess,\n  setHeaders: setHeaders,\n  updateContentType: updateContentType,\n  // response helpers\n  createResponse: createResponse,\n  parseResponseData: parseResponseData,\n  getHeaders: getHeaders\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers.js?");

/***/ }),

/***/ "./lib/kinka.js":
/*!**********************!*\
  !*** ./lib/kinka.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * Copyright (c) acacode, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n *\n * @flow\n */\n\nvar helpers = __webpack_require__(/*! ./helpers */ \"./lib/helpers.js\");\nvar isUndefined = helpers.isUndefined;\n\n/**\n * Create new instance of Kinka\n * which will have own instance options\n * @class\n * @param {object} instanceOptions\n * default kinka instance options:\n * {\n *  omitCatches: true,\n *  headers: {},\n *  timeout: 0,\n *  charset: 'utf-8',\n * }\n */\nfunction Kinka(instanceOptions) {\n  if (!instanceOptions) instanceOptions = {};\n  var customMethods = instanceOptions.customMethods;\n  this.baseURL = instanceOptions.baseURL || location && location.origin || '';\n  this.instanceOptions = {\n    omitCatches: isUndefined(instanceOptions.omitCatches, true),\n    headers: isUndefined(instanceOptions.headers, {}),\n    timeout: isUndefined(instanceOptions.timeout, 0),\n    charset: isUndefined(instanceOptions.charset, 'utf-8')\n  };\n  if (customMethods) for (var i in customMethods) {\n    this[customMethods[i]] = createMethodHandler(customMethods[i]);\n  }this.inspectors = instanceOptions.inspectors || {};\n  if (instanceOptions.auth) this.auth = instanceOptions.auth;\n}\n\nfunction createMethodHandler(methodName, hasBody) {\n  return function (path, optionsOrData, data) {\n    var config = hasBody ? [data, optionsOrData] : [optionsOrData];\n    return this.custom(methodName, path, config[0], config[1]);\n  };\n}\n\nKinka.prototype = {\n  abort: helpers.abortRequest,\n  all: Promise.all,\n  create: function create(instanceOptions) {\n    return new Kinka(instanceOptions);\n  },\n  custom: helpers.createRequest,\n  delete: createMethodHandler('delete'),\n  get: createMethodHandler('get'),\n  head: createMethodHandler('head'),\n  options: createMethodHandler('options'),\n  patch: createMethodHandler('patch', true),\n  post: createMethodHandler('post', true),\n  put: createMethodHandler('put', true)\n};\n\nvar kinka = new Kinka();\n\nif (window) {\n  window.kinka = kinka;\n}\n\nmodule.exports = kinka;\n\n//# sourceURL=webpack://kinka/./lib/kinka.js?");

/***/ })

/******/ });
});