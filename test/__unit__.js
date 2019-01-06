// const MockXMLHttpRequest = require('mock-xmlhttprequest').newMockXhr()
// require('jasmine')
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
global.window = require('mock-browser').mocks.MockBrowser.createWindow()
global.jasmine = require('jasmine')
console.log(global.jasmine)
var JasmineCore = require('jasmine-core')
global.getJasmineRequireObj = function() {
  return JasmineCore
}
require('jasmine-ajax')

// Install in global context so "new XMLHttpRequest()" works in MyModuleUsingXhr
// global.XMLHttpRequest = MockXMLHttpRequest
global.location = undefined
