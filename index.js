/**
 * Copyright (c) acacode, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/kinka.min.js')
} else {
  module.exports = require('./dist/kinka.js')
}
