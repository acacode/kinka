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

/***/ "./lib/helpers/base.js":
/*!*****************************!*\
  !*** ./lib/helpers/base.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nif (!ArrayBuffer.isView) {\n  ArrayBuffer.isView = function (data) {\n    return data !== null && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data.buffer instanceof ArrayBuffer;\n  };\n}\n\nfunction merge() {\n  var object = {};\n  for (var args = [].slice.call(arguments), x = 0; x < args.length; x++) {\n    if (isObject(args[x])) for (var attr in args[x]) {\n      var value = args[x][attr];\n      object[attr] = isObject(value) ? merge(object[attr], value) : value;\n    }\n  }\n  return object;\n}\n\nfunction isObject(value) {\n  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';\n}\n\nfunction parseJSON(data) {\n  try {\n    return JSON.parse(data);\n  } catch (e) {\n    return data;\n  }\n}\n\nfunction parseUrlEncodedForm(form) {\n  var decoder = decodeURIComponent;\n  var data = {};\n  var pairs = form.split('&');\n  var pair;\n  var pos;\n\n  for (var i = 0, len = pairs.length; i < len; ++i) {\n    pair = pairs[i];\n    pos = pair.indexOf('=');\n    if (pos === -1) {\n      data[decoder(pair)] = '';\n    } else {\n      data[decoder(pair.slice(0, pos))] = decoder(pair.slice(pos + 1));\n    }\n  }\n\n  return data;\n}\n\nfunction isUndefined(value, defaultValue) {\n  return typeof value === 'undefined' ? defaultValue : value;\n}\n\nfunction valueIs(value, arrayOfTypeNames) {\n  // eslint-disable-next-line prettier/prettier\n  var stringifiedValue = {}.toString.call(value).replace(/object|[ [\\]]/g, '');\n  return includes(arrayOfTypeNames, stringifiedValue);\n}\n\nfunction includes(value, includedValue) {\n  return value.indexOf(includedValue) > -1;\n}\n\nmodule.exports = {\n  merge: merge,\n  isObject: isObject,\n  parseJSON: parseJSON,\n  isUndefined: isUndefined,\n  valueIs: valueIs,\n  parseUrlEncodedForm: parseUrlEncodedForm,\n  includes: includes\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/base.js?");

/***/ }),

/***/ "./lib/helpers/request.js":
/*!********************************!*\
  !*** ./lib/helpers/request.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar baseHelpers = __webpack_require__(/*! ./base */ \"./lib/helpers/base.js\");\nvar createResponse = __webpack_require__(/*! ./response */ \"./lib/helpers/response.js\").createResponse;\n\nvar isObject = baseHelpers.isObject;\nvar merge = baseHelpers.merge;\nvar valueIs = baseHelpers.valueIs;\nvar includes = baseHelpers.includes;\nvar isUndefined = baseHelpers.isUndefined;\n\nvar abortableRequests = {};\nvar CONTENT_TYPE = 'Content-Type';\n\nfunction abortRequest(key) {\n  if (abortableRequests[key]) {\n    abortableRequests[key].abort();\n    removeAbortableKey(key);\n  }\n}\n\nfunction getAbortableRequest(key) {\n  abortRequest(key);\n  abortableRequests[key] = new XMLHttpRequest();\n  return abortableRequests[key];\n}\n\nfunction removeAbortableKey(key) {\n  abortableRequests[key] = null;\n  delete abortableRequests[key];\n}\n\nfunction requestIsSuccess(request, specificSuccessStatus) {\n  var status = request.status;\n  return specificSuccessStatus ? status === specificSuccessStatus : status >= 200 && status < 300 || status === 101;\n}\n\nfunction setHeaders(request, headers) {\n  var headerNames = Object.keys(headers);\n  for (var x = 0; x < headerNames.length; x++) {\n    request.setRequestHeader(headerNames[x], headers[headerNames[x]]);\n  }\n}\n\nfunction getUrlWithQuery(url, query) {\n  var parsed = url.split('?');\n  var rawUrl = parsed[0];\n  var queryString = parsed[1] ? [parsed[1]] : [];\n  Object.keys(query).forEach(function (key) {\n    queryString.push(key + '=' + encodeURIComponent(query[key]));\n  });\n  return rawUrl + '?' + queryString.join('&');\n}\n\nfunction getUrl(path, baseURL, query) {\n  var protocol = path.slice(0, 4);\n  var url = protocol === 'http' || includes(protocol, 'ws') || includes(protocol, '//') ? path : baseURL + path;\n  return query ? getUrlWithQuery(url, query) : url;\n}\n\nfunction updateContentType(headers, contentType, charset) {\n  headers[CONTENT_TYPE] = isUndefined(headers[CONTENT_TYPE], contentType + ';charset=' + charset);\n}\n\nfunction prepareRequestData(data, headers, charset) {\n  if (valueIs(data, ['FormData', 'ArrayBuffer', 'File', 'Blob'])) {\n    return data;\n  }\n  if (valueIs(data, ['isURLSearchParams'])) {\n    updateContentType(headers, 'application/x-www-form-urlencoded', charset);\n    return data.toString();\n  }\n  if (ArrayBuffer.isView(data)) {\n    return data.buffer;\n  }\n  if (isObject(data)) {\n    updateContentType(headers, 'application/json', charset);\n    return JSON.stringify(data);\n  }\n  return data;\n}\n\nfunction createRequest(method, path, requestOptions, requestData) {\n  var requestInspector = this.inspectors.request;\n  var responseInspector = this.inspectors.response;\n  var options = merge(this.instanceOptions, requestOptions, requestOptions && this.auth && requestOptions.auth && this.auth(requestOptions.auth));\n  if (options.body) {\n    console.warn('Property \"body\" has been removed in the next release kinka. Please use \"data\" property instead of.');\n    options.data = options.body;\n  }\n  if (requestData) {\n    options.data = requestData;\n  }\n  if (requestInspector) {\n    options = requestInspector(getUrl(path, this.baseURL, options.query), method, options) || options;\n  }\n  if (options.abortableKey) {\n    console.warn('Property \"abortableKey\" has been removed in the next release kinka. Please use \"cancelToken\" property instead of.');\n    options.cancelToken = options.abortableKey;\n  }\n  var cancelToken = options.cancelToken;\n  var url = getUrl(path, this.baseURL, options.query);\n  var request = cancelToken ? getAbortableRequest(cancelToken) : new XMLHttpRequest();\n  return new Promise(function (resolve, reject) {\n    request.withCredentials = !!options.withAuth;\n    request.onreadystatechange = function () {\n      if (request.readyState === XMLHttpRequest.DONE) {\n        var isError = !requestIsSuccess(request, options.successStatus);\n        var response = createResponse(request, isError);\n        if (responseInspector) {\n          response = responseInspector(url, method, response) || response;\n        }\n        if (!options.omitCatches && isError) reject(response);else resolve(response);\n        request = null;\n        if (cancelToken) removeAbortableKey(cancelToken);\n      }\n    };\n    request.open(method.toUpperCase(), url, true);\n    request.timeout = options.timeout;\n    var requestData = prepareRequestData(options.data, options.headers, options.charset);\n    if (isObject(options.headers)) setHeaders(request, options.headers);\n    request.send(requestData);\n  });\n}\n\nmodule.exports = {\n  createRequest: createRequest,\n  abortRequest: abortRequest\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/request.js?");

/***/ }),

/***/ "./lib/helpers/response.js":
/*!*********************************!*\
  !*** ./lib/helpers/response.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar baseHelpers = __webpack_require__(/*! ./base */ \"./lib/helpers/base.js\");\nvar includes = baseHelpers.includes;\n\nfunction parseResponseData(rawData, contentType) {\n  if (!contentType || typeof contentType !== 'string') {\n    return rawData;\n  }\n  if (includes(contentType, 'application/json')) {\n    return baseHelpers.parseJSON(rawData);\n  }\n  if (includes(contentType, 'application/x-www-form-urlencoded')) {\n    return baseHelpers.parseUrlEncodedForm(rawData);\n  }\n  return rawData;\n}\nfunction createResponse(request, isError) {\n  var status = request.status;\n  var type = request.responseType;\n  var text = !type || type === 'text' ? request.responseText : null;\n  var data = parseResponseData(text || request.response, request.getResponseHeader('content-type'));\n  return {\n    data: isError ? null : data,\n    err: isError ? status === 0 ? 'canceled' : data || {} : null,\n    headers: getHeaders(request),\n    isError: !!isError,\n    isSuccess: !isError,\n    response: request.response,\n    status: status,\n    statusText: request.statusText,\n    type: type\n  };\n}\n\nfunction getHeaders(request) {\n  return request.getAllResponseHeaders().trim().split(/[\\r\\n]+/).reduce(function (headers, line) {\n    var splitChar = ': ';\n    var parts = line.split(splitChar);\n    headers[parts.shift()] = parts.join(splitChar);\n    return headers;\n  }, {});\n}\n\nmodule.exports = {\n  createResponse: createResponse\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/response.js?");

/***/ }),

/***/ "./lib/kinka.js":
/*!**********************!*\
  !*** ./lib/kinka.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * Copyright (c) acacode, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n *\n * @flow\n */\nvar baseHelpers = __webpack_require__(/*! ./helpers/base */ \"./lib/helpers/base.js\");\nvar requestHelpers = __webpack_require__(/*! ./helpers/request */ \"./lib/helpers/request.js\");\nvar isUndefined = baseHelpers.isUndefined;\n\nvar DEFAULT_CHARSET = 'utf-8';\n\nfunction Kinka(instanceOptions) {\n  if (!instanceOptions) instanceOptions = {};\n  var customMethods = instanceOptions.customMethods;\n  this.baseURL = instanceOptions.baseURL || location && location.origin || '';\n  this.instanceOptions = {\n    omitCatches: isUndefined(instanceOptions.omitCatches, true),\n    headers: isUndefined(instanceOptions.headers, {}),\n    timeout: isUndefined(instanceOptions.timeout, 0),\n    charset: isUndefined(instanceOptions.charset, DEFAULT_CHARSET)\n  };\n  if (customMethods) for (var i in customMethods) {\n    this[customMethods[i]] = createMethodHandler(customMethods[i]);\n  }this.inspectors = instanceOptions.inspectors || {};\n  if (instanceOptions.auth) this.auth = instanceOptions.auth;\n}\n\nfunction createMethodHandler(methodName, hasBody) {\n  return function (path, optionsOrData, data) {\n    var config = hasBody ? [data, optionsOrData] : [optionsOrData];\n    return this.custom(methodName, path, config[0], config[1]);\n  };\n}\n\nvar kinkaPrototype = {\n  abort: requestHelpers.abortRequest,\n  all: Promise.all,\n  create: function create(instanceOptions) {\n    return new Kinka(instanceOptions);\n  },\n  custom: requestHelpers.createRequest,\n  delete: createMethodHandler('delete'),\n  get: createMethodHandler('get'),\n  head: createMethodHandler('head'),\n  options: createMethodHandler('options'),\n  patch: createMethodHandler('patch', true),\n  post: createMethodHandler('post', true),\n  put: createMethodHandler('put', true)\n};\n\nKinka.prototype = kinkaPrototype;\n\nvar kinka = new Kinka();\n\nif (window) {\n  window.kinka = kinka;\n}\n\nmodule.exports = kinka;\n\n//# sourceURL=webpack://kinka/./lib/kinka.js?");

/***/ })

/******/ });
});