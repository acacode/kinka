var globalObject = typeof global !== 'undefined' ? global : window

function PromisePolyfill(asyncCallback) {
  if (!asyncCallback) return
  var promise = {
    rejected: false,
    fulfilled: false,
    then: createOnFulfillListener(),
    catch: createOnFulfillListener(true),
  }
  var fulfilledTimer
  var result
  var fulfilled = false
  var rejected = false
  var resolvers = []
  var catchers = []
  function createOnFulfillListener(forReject) {
    return function(callback) {
      var callbacksArray = forReject ? catchers : resolvers
      callbacksArray.push(callback)
      return promise
    }
  }
  function onFulfillWatcher() {
    if (fulfilled) {
      var callbacksArray = rejected ? catchers : resolvers
      callbacksArray.forEach(callback => callback(result))
    } else {
      clearTimeout(fulfilledTimer)
      fulfilledTimer = setTimeout(onFulfillWatcher)
    }
  }
  function fulfillPromise(isRejected, data) {
    promise.fulfilled = fulfilled = true
    promise.rejected = rejected = isRejected
    promise.data = result = data
  }
  asyncCallback(
    fulfillPromise.bind(null, false),
    fulfillPromise.bind(null, true)
  )
  fulfilledTimer = setTimeout(onFulfillWatcher)
  return promise
}

if (!globalObject.Promise) {
  PromisePolyfill.all = function(promises) {
    if (!promises || !promises.length) return
    var responses = new Array(promises.legth)
    var timer
    return new PromisePolyfill(function(resolve, reject) {
      function fulfillCallback() {
        var allFulfilled = true
        var isAnyRejected = false
        for (var x = 0; x < promises.length; x++) {
          if (promises[x].fulfilled) {
            responses[x] = promises[x].data
            if (promises[x].rejected) {
              isAnyRejected = true
            }
          } else {
            allFulfilled = false
          }
        }
        if (allFulfilled) {
          if (isAnyRejected) {
            reject(responses)
          } else {
            resolve(responses)
          }
        } else {
          clearTimeout(timer)
          timer = setTimeout(fulfillCallback)
        }
      }
      timer = setTimeout(fulfillCallback)
    })
  }
  globalObject.Promise = PromisePolyfill
}
