import promisify from './promisify'

// Wraps a function that takes a callback with the signature `function (error, response)`
// in a Promise that rejects when `error` is present or resolves with the original data
// the function was called with (thereby discarding the response of the promised function)
export default function promisifyPassthru(fn, context=undefined) {
  return function(data) {
    return promisify(fn, context)(data).then(_ => data);
  }
}
