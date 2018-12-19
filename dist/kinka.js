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
/***/ (function(module, exports) {

eval("function merge() {\n  var object = {};\n  for (var args = Array.prototype.slice.call(arguments), x = 0; x < args.length; x++) {\n    if (isObject(args[x])) for (var attr in args[x]) {\n      var value = args[x][attr];\n      object[attr] = isObject(value) ? merge(object[attr], value) : value;\n    }\n  }\n  return object;\n}\n\nfunction isObject(value) {\n  return value && typeof value === 'object';\n}\n\n// function pick(object, keys) {\n//   var newObject = {}\n//   for (var x in keys) newObject[keys[x]] = object[keys[x]]\n//   return newObject\n// }\n\nfunction parseJSON(stringifiedData) {\n  try {\n    return JSON.parse(stringifiedData);\n  } catch (e) {\n    return stringifiedData;\n  }\n}\n\nfunction isUndefined(value, defaultValue) {\n  return value === undefined ? defaultValue : value;\n}\n\nmodule.exports = {\n  merge: merge,\n  isObject: isObject,\n  // pick: pick,\n  parseJSON: parseJSON,\n  isUndefined: isUndefined\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/base.js?");

/***/ }),

/***/ "./lib/helpers/request.js":
/*!********************************!*\
  !*** ./lib/helpers/request.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var baseHelpers = __webpack_require__(/*! ./base */ \"./lib/helpers/base.js\");\nvar createResponse = __webpack_require__(/*! ./response */ \"./lib/helpers/response.js\").createResponse;\n\nvar isObject = baseHelpers.isObject;\nvar merge = baseHelpers.merge;\n\nvar abortableRequests = {};\n\nfunction abortRequest(key) {\n  if (abortableRequests[key]) {\n    abortableRequests[key].abort();\n    removeAbortableKey(key);\n  }\n}\n\nfunction getAbortableRequest(key) {\n  abortRequest(key);\n  abortableRequests[key] = new XMLHttpRequest();\n  return abortableRequests[key];\n}\n\nfunction removeAbortableKey(key) {\n  abortableRequests[key] = null;\n  delete abortableRequests[key];\n}\n\nfunction requestIsSuccess(request, specificSuccessStatus) {\n  var status = request.status;\n  return specificSuccessStatus ? status === specificSuccessStatus : status >= 200 && status < 300 || status === 101;\n}\n\nfunction setHeaders(request, headers) {\n  var headerNames = Object.keys(headers);\n  for (var x = 0; x < headerNames.length; x++) request.setRequestHeader(headerNames[x], headers[headerNames[x]]);\n}\n\nfunction getUrlWithQuery(url, query) {\n  var parsed = url.split('?');\n  var rawUrl = parsed[0];\n  var queryString = parsed[1] ? [parsed[1]] : [];\n  Object.keys(query).forEach(function (key) {\n    queryString.push(key + '=' + query[key]);\n  });\n  return rawUrl + '?' + queryString.join('&');\n}\n\nfunction getUrl(path, baseURL, query) {\n  var protocol = path.substring(0, 4);\n  var url = protocol === 'http' || protocol.indexOf('ws') !== -1 || protocol.indexOf('//') !== -1 ? path : baseURL + path;\n  if (!query) return url;\n  return getUrlWithQuery(url, query);\n}\n\nfunction createRequest(method, path, requestOptions, requestBody) {\n  var requestInspector = this.inspectors.request;\n  var responseInspector = this.inspectors.response;\n  var options = merge(this.options, requestOptions, requestOptions && this.auth && requestOptions.auth && this.auth(requestOptions.auth));\n  if (options.body) {\n    console.warn('kinka warning: property \"body\" will be renamed to \"data\" in the 1.0.0 kinka release version');\n  }\n  if (options.data) {\n    options.body = options.data;\n  }\n  if (requestBody) {\n    options.body = requestBody;\n  }\n  if (requestInspector) {\n    options = requestInspector(getUrl(path, this.baseURL, options.query), method, options) || options;\n  }\n  var abortableKey = options.abortableKey;\n  var rawBody = options.body;\n  var body = !isObject(rawBody) || rawBody instanceof FormData ? rawBody : JSON.stringify(rawBody);\n  var url = getUrl(path, this.baseURL, options.query);\n  var request = abortableKey ? getAbortableRequest(abortableKey) : new XMLHttpRequest();\n  return new Promise(function (resolve, reject) {\n    request.withCredentials = !!options.withAuth;\n    request.onreadystatechange = function () {\n      if (request.readyState === XMLHttpRequest.DONE) {\n        var isError = !requestIsSuccess(request, options.successStatus);\n        var response = createResponse(request, isError);\n        if (responseInspector) {\n          response = responseInspector(url, method, response) || response;\n        }\n        if (!options.omitCatches && isError) reject(response);else resolve(response);\n        request = null;\n        if (abortableKey) removeAbortableKey(abortableKey);\n      }\n    };\n    request.open(method.toUpperCase(), url, true);\n    request.timeout = options.timeout;\n    if (isObject(options.headers)) setHeaders(request, options.headers);\n    request.send(body);\n  });\n}\n\nmodule.exports = {\n  createRequest: createRequest,\n  abortRequest: abortRequest\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/request.js?");

/***/ }),

/***/ "./lib/helpers/response.js":
/*!*********************************!*\
  !*** ./lib/helpers/response.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var parseJSON = __webpack_require__(/*! ./base */ \"./lib/helpers/base.js\").parseJSON;\n\nfunction createResponse(request, isError) {\n  var data = request.responseText;\n  var parsedData = parseJSON(data);\n  return {\n    data: isError ? undefined : parsedData,\n    err: isError ? parsedData : undefined,\n    headers: getHeaders(request),\n    isError: !!isError,\n    isSuccess: !isError,\n    response: request.response,\n    status: request.status,\n    statusText: request.statusText,\n    type: request.responseType\n  };\n}\n\nfunction getHeaders(request) {\n  return request.getAllResponseHeaders().trim().split(/[\\r\\n]+/).reduce(function (headers, line) {\n    var splitChar = ': ';\n    var parts = line.split(splitChar);\n    headers[parts.shift()] = parts.join(splitChar);\n    return headers;\n  }, {});\n}\n\nmodule.exports = {\n  createResponse: createResponse\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/response.js?");

/***/ }),

/***/ "./lib/kinka.js":
/*!**********************!*\
  !*** ./lib/kinka.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Copyright (c) acacode, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n *\n * @flow\n */\nvar baseHelpers = __webpack_require__(/*! ./helpers/base */ \"./lib/helpers/base.js\");\nvar requestHelpers = __webpack_require__(/*! ./helpers/request */ \"./lib/helpers/request.js\");\nvar isUndefined = baseHelpers.isUndefined;\n\nfunction Kinka(instanceOptions) {\n  if (!(this instanceof Kinka)) {\n    return new Kinka(instanceOptions);\n  }\n  if (!instanceOptions) instanceOptions = {};\n  var customMethods = instanceOptions.customMethods;\n  this.baseURL = isUndefined(instanceOptions.baseURL, location ? location.origin : '');\n  this.options = {\n    omitCatches: isUndefined(instanceOptions.omitCatches, true),\n    headers: isUndefined(instanceOptions.headers, {}),\n    timeout: isUndefined(instanceOptions.timeout, 0)\n  };\n  if (customMethods) for (var i in customMethods) this[customMethods[i]] = createMethodHandler(customMethods[i]);\n  this.inspectors = instanceOptions.inspectors || {};\n  if (instanceOptions.auth) this.auth = instanceOptions.auth;\n  return this;\n}\n\nfunction createMethodHandler(methodName, hasBody) {\n  return function (path, arg1, arg2) {\n    var config = hasBody ? [arg2, arg1] : [arg1];\n    return this.custom(methodName, path, config[0], config[1]);\n  };\n}\n\nKinka.prototype = {\n  abort: requestHelpers.abortRequest,\n  all: Promise.all,\n  create: Kinka,\n  custom: requestHelpers.createRequest,\n  delete: createMethodHandler('delete'),\n  get: createMethodHandler('get'),\n  head: createMethodHandler('head'),\n  options: createMethodHandler('options'),\n  patch: createMethodHandler('patch', true),\n  post: createMethodHandler('post', true),\n  put: createMethodHandler('put', true)\n};\n\nmodule.exports = window.kinka = new Kinka();\n\n//# sourceURL=webpack://kinka/./lib/kinka.js?");

/***/ })

/******/ });
});