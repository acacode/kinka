/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict'

if (process) {
  var isProd = process.env.NODE_ENV === 'production'
  var excludePromises = !!process.env.EXCLUDE_PROMISES
  /**
   *  variations:
   *
   *  kinka.js
   *  kinka.min.js
   *  kinka.non-promise.js
   *  kinka.non-promise.min.js
   */
  module.exports = require('./dist/kinka' +
    (excludePromises ? '.non-promise' : '') +
    (isProd ? '.min' : '') +
    '.js')
} else {
  module.exports = require('./dist/kinka.js')
}
