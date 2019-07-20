/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { abortRequest, createRequest } from './helpers/request'
import { isUndefined, typeCheck } from './helpers/base'

/**
 * Create new instance of Kinka
 * which will have own instance options
 *
 *
 * default kinka instance options:
 * {
 *  omitCatches: true,
 *  headers: {},
 *  timeout: 0,
 *  charset: 'utf-8',
 * }
 *
 * @class
 * @param {object?} config Configuration of your api (See documentation: https://github.com/acacode/kinka/blob/master/docs/documentation.md)
 * @param {boolean?} config.omitCatches Enable/Disable catching your request (See documentation)
 * @param {boolean?} config.credentials Sets the withCredentials flag for each requests
 * @param {function?} config.auth Attach the auth mixin (See documentation)
 * @param {number?} config.timeout Sets the timeout for each request
 * @param {object?} config.headers Sets the request headers for each request created via api.
 * @param {object?} config.inspectors Sets the inspectors (See documentation)
 * @param {function[]?} config.middlewares Sets the middlewares (See documentation)
 * @param {string?} config.baseURL Sets the base url address for api.
 * @param {string?} config.charset Sets the charset
 * @param {string[]?} config.customMethods Sets the custom methods for api.
 */
function createInstance(config) {
  typeCheck(config, 'object', 'instance options', true)
  if (!config) config = {}

  typeCheck(
    config.inspectors,
    'object',
    'inspectors for your kinka instance',
    true
  )
  typeCheck(config.baseURL, 'string', 'baseURL', true)

  const customMethods = config.customMethods

  const instance = {
    abort: abortRequest,
    all: Promise.all,
    create: createInstance,
    baseURL: config.baseURL || (location && location.origin) || '',
    config: {
      credentials: !!config.credentials,
      omitCatches: isUndefined(config.omitCatches, true),
      headers: isUndefined(config.headers, {}),
      timeout: isUndefined(config.timeout, 0),
      charset: isUndefined(config.charset, 'utf-8'),
    },
    inspectors: config.inspectors || {},
    middlewares: config.middlewares || [],
  }

  instance.clone = createInstance.bind(null, instance.config)
  instance.custom = createRequest.bind(instance)

  const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']

  if (customMethods) {
    typeCheck(
      customMethods,
      'array',
      'option "customMethods" in your kinka instance'
    )
    methods.push.apply(methods, customMethods)
  }

  for (const method of methods) {
    typeCheck(
      method,
      'string',
      'custom method with name "' +
        method +
        '" in your kinka instance option customMethods'
    )
    if (!instance[method])
      instance[method] = createRequest.bind(instance, method)
  }

  if (config.auth) {
    typeCheck(config.auth, 'function', 'auth mixin')
    instance.auth = config.auth.bind(instance)
  }

  typeCheck(instance.inspectors.request, 'function', 'request inspector', true)
  typeCheck(
    instance.inspectors.response,
    'function',
    'response inspector',
    true
  )
  typeCheck(
    instance.config.headers,
    'object',
    'headers in your kinka instance',
    true
  )
  typeCheck(instance.config.timeout, 'number', 'timeout in your kinka instance')
  typeCheck(instance.config.charset, 'string', 'charset in your kinka instance')

  for (const middleware of instance.middlewares) {
    typeCheck(middleware, 'function', 'middleware')
    middleware(instance)
  }

  return instance
}

export default createInstance()
