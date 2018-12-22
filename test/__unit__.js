const MockXMLHttpRequest = require('mock-xmlhttprequest').newMockXhr()
const MockBrowser = require('mock-browser')

// Install in global context so "new XMLHttpRequest()" works in MyModuleUsingXhr
global.XMLHttpRequest = MockXMLHttpRequest

global.location = undefined

global.window = MockBrowser.mocks.MockBrowser.createWindow()
