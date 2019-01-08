const XMLHttpRequest = require('xmlhttprequest')
const MockBrowser = require('mock-browser')

global.XMLHttpRequest = XMLHttpRequest.XMLHttpRequest
global.window = MockBrowser.mocks.MockBrowser.createWindow()

global.location = 'http://127.0.0.1:8988'
