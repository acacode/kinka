var globalObject = typeof global !== 'undefined' ? global : window

function PromisePolyfill(asyncCallback) {
  if (!asyncCallback) return
  var timer
  var response
  var fired = false
  var rejected = false
  var thenCallbacks = []
  var catchCallbacks = []
  const timerCall = () => {
    if (fired) {
      if (rejected) {
        catchCallbacks.forEach(call => call(response))
      } else {
        thenCallbacks.forEach(call => call(response))
      }
    } else {
      clearTimeout(timer)
      timer = setTimeout(timerCall)
    }
  }
  function resolve(data) {
    fired = true
    response = data
    promise.fulfilled = true
    promise.data = response
  }
  function reject(data) {
    fired = true
    rejected = true
    response = data
    promise.rejected = true
    promise.fulfilled = true
    promise.data = response
  }
  var promise = {
    rejected: false,
    fulfilled: false,
    then: function(thenCallback) {
      thenCallbacks.push(thenCallback)
      return promise
    },
    catch: function(catchCallback) {
      catchCallbacks.push(catchCallback)
      return promise
    },
  }
  asyncCallback(resolve, reject)
  timer = setTimeout(timerCall)
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
