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

eval("function merge() {\n  var obj3 = {};\n  for (var args = Array.prototype.slice.call(arguments), x = 0; x < args.length; x++) {\n    if (typeof args[x] === 'object') for (var attr in args[x]) obj3[attr] = args[x][attr];\n  }\n  return obj3;\n}\n\nfunction isObject(value) {\n  return value && typeof value === 'object';\n}\n\n// function pick(object, keys) {\n//   var obj = {}\n//   for (var x in keys) obj[keys[x]] = object[keys[x]]\n//   return obj\n// }\n\nmodule.exports = {\n  merge: merge,\n  isObject: isObject\n  // pick: pick,\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/base.js?");

/***/ }),

/***/ "./lib/helpers/request.js":
/*!********************************!*\
  !*** ./lib/helpers/request.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const isObject = __webpack_require__(/*! ./base */ \"./lib/helpers/base.js\").isObject;\n\nvar abortableRequests = {};\n\nfunction getAbortableRequest(key) {\n  if (abortableRequests[key]) {\n    abortableRequests[key].abort();\n    delete abortableRequests[key];\n  }\n  abortableRequests[key] = new XMLHttpRequest();\n  return abortableRequests[key];\n}\n\nfunction removeAbortableKey(key) {\n  abortableRequests[key] = null;\n  delete abortableRequests[key];\n}\n\nfunction requestIsSuccess(request, specificSuccessStatus) {\n  return specificSuccessStatus ? request.status === specificSuccessStatus : request.status >= 200 && request.status < 300;\n}\n\nfunction setHeaders(request, headers) {\n  const headerNames = Object.keys(headers);\n  for (var x = 0; x < headerNames.length; x++) request.setRequestHeader(headerNames[x], headers[headerNames[x]]);\n}\n\nfunction getUrlWithQuery(url, query) {\n  var parsed = url.split('?');\n  var rawUrl = parsed[0];\n  var queryString = parsed[1] ? [parsed[1]] : [];\n  var keys = Object.keys(query);\n  keys.forEach(function (key) {\n    queryString.push(key + '=' + query[key]);\n  });\n  return rawUrl + '?' + queryString.join('&');\n}\n\nfunction getUrl(path, baseURL, query) {\n  var url = path.substring(0, 4) === 'http' ? path : baseURL + path;\n  if (!query) return url;\n  return getUrlWithQuery(url, query);\n}\n\nfunction prepareBody(body) {\n  if (!isObject(body) || body instanceof FormData) return body;\n  return JSON.stringify(body);\n}\n\nmodule.exports = {\n  getAbortableRequest: getAbortableRequest,\n  requestIsSuccess: requestIsSuccess,\n  setHeaders: setHeaders,\n  getUrl: getUrl,\n  removeAbortableKey: removeAbortableKey,\n  prepareBody: prepareBody\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/request.js?");

/***/ }),

/***/ "./lib/helpers/response.js":
/*!*********************************!*\
  !*** ./lib/helpers/response.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function parseResponseData(stringifiedData) {\n  try {\n    const data = JSON.parse(stringifiedData);\n    return data;\n  } catch (e) {\n    return stringifiedData;\n  }\n}\n\nfunction createResponse(request, isError) {\n  return {\n    status: request.status,\n    data: request.responseText !== undefined && !isError ? parseResponseData(request.responseText) : undefined,\n    err: isError ? parseResponseData(request.responseText) : undefined,\n    isError: !!isError,\n    isSuccess: !isError,\n    type: request.responseType,\n    response: request.response,\n    headers: getHeaders(request)\n  };\n}\n\nfunction getHeaders(request) {\n  return request.getAllResponseHeaders().trim().split(/[\\r\\n]+/).reduce(function (headers, line) {\n    var parts = line.split(': ');\n    var header = parts.shift();\n    var value = parts.join(': ');\n    headers[header] = value;\n    return headers;\n  }, {});\n}\n\nmodule.exports = {\n  createResponse: createResponse\n};\n\n//# sourceURL=webpack://kinka/./lib/helpers/response.js?");

/***/ }),

/***/ "./lib/kinka.js":
/*!**********************!*\
  !*** ./lib/kinka.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\r\n * Copyright (c) acacode, Inc. and its affiliates.\r\n *\r\n * This source code is licensed under the MIT license found in the\r\n * LICENSE file in the root directory of this source tree.\r\n *\r\n * @flow\r\n */\nconst baseHelpers = __webpack_require__(/*! ./helpers/base */ \"./lib/helpers/base.js\");\nconst requestHelpers = __webpack_require__(/*! ./helpers/request */ \"./lib/helpers/request.js\");\nconst responseHelpers = __webpack_require__(/*! ./helpers/response */ \"./lib/helpers/response.js\");\n\nvar isObject = baseHelpers.isObject;\nvar merge = baseHelpers.merge;\n\nvar requestIsSuccess = requestHelpers.requestIsSuccess;\nvar getAbortableRequest = requestHelpers.getAbortableRequest;\nvar removeAbortableKey = requestHelpers.removeAbortableKey;\nvar setHeaders = requestHelpers.setHeaders;\nvar getUrl = requestHelpers.getUrl;\nvar prepareBody = requestHelpers.prepareBody;\n\nvar createResponse = responseHelpers.createResponse;\n\nconst defaultOptions = {\n  baseURL: location.origin,\n  omitCatches: true\n};\n\nfunction createRequest(method, path, options) {\n  var request = options.abortableKey ? getAbortableRequest(options.abortableKey) : new XMLHttpRequest();\n  return new Promise(function (resolve, reject) {\n    request.withCredentials = !!options.withAuth;\n    request.onreadystatechange = function () {\n      switch (request.readyState) {\n        case XMLHttpRequest.DONE:\n          {\n            var isError = !requestIsSuccess(request, options.successStatus);\n            var response = createResponse(request, isError);\n            if (!options.omitCatches && isError) reject(response);else resolve(response);\n            request = null;\n            if (options.abortableKey) removeAbortableKey(options.abortableKey);\n            break;\n          }\n        default:\n          break;\n      }\n    };\n    request.open(method.toUpperCase(), getUrl(path, options.baseURL, options.query), true);\n    if (isObject(options.headers)) setHeaders(request, options.headers);\n    request.send(prepareBody(options.body));\n  });\n}\n\nfunction Kinka(instanceOptions) {\n  this.options = merge(defaultOptions, instanceOptions);\n  var customMethods = this.options.customMethods;\n  if (customMethods) for (var i in customMethods) this[customMethods[i]] = createMethodHandler(customMethods[i]);\n}\n\nfunction createMethodHandler(methodName) {\n  return function (path, options) {\n    return createRequest(methodName, path, merge(this.options, options));\n  };\n}\nfunction createMethodBodyHandler(methodName) {\n  return function (path, body, options) {\n    var requestOptions = merge(this.options, options, { body: body });\n    return createRequest(methodName, path, requestOptions);\n  };\n}\n\nKinka.prototype.get = createMethodHandler('get');\nKinka.prototype.options = createMethodHandler('options');\nKinka.prototype.head = createMethodHandler('head');\nKinka.prototype.post = createMethodBodyHandler('post');\nKinka.prototype.put = createMethodBodyHandler('put');\nKinka.prototype.patсh = createMethodBodyHandler('patch');\nKinka.prototype.delete = createMethodHandler('delete');\nKinka.prototype.custom = function (method, path, options) {\n  return createRequest(method, path, merge(this.options, options));\n};\nKinka.prototype.create = function (options) {\n  return new Kinka(options);\n};\n\nmodule.exports = window.kinka = new Kinka();\n\n//# sourceURL=webpack://kinka/./lib/kinka.js?");

/***/ })

/******/ });
});