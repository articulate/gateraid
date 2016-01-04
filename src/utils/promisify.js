// Wraps a function that takes a callback with the signature `function (error, response)`
// in a Promise that rejects when `error` is present or resolves with the result of the callback
export default function promisify(fn, context=undefined) {
  const boundFn = fn.bind(context);

  return (data) => {
    return new Promise((resolve, reject) => {
      boundFn(data, (err, resp) => {
        if (err) { reject(err); }
        else { resolve(resp); }
      });
    });
  }
}
