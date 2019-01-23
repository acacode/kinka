var globalObject = typeof global !== 'undefined' ? global : window

function PromisePolyfill(asyncCallback) {
  console.log('aaaaaaaaaaaaaaaaaaaaaaa')
  var thenCallbacks = []
  var catchCallbacks = []
  var prom = {
    then: function(thenCallback) {
      thenCallbacks.push(thenCallback)
      return resolved
    },
    catch: function(catchCallback) {
      catchCallbacks.push(catchCallback)
      return resolved
    },
  }
}

if (!globalObject.Promise) {
  PromisePolyfill.all = null
  globalObject.Promise = PromisePolyfill
}
