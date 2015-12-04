export default function promisify(fn, context=undefined) {
  const boundFn = fn.bind(context);

  return (...args) => {
    return new Promise((resolve, reject) => {
      boundFn(...args, (err, data) => {
        if (err) { reject(err); }
        else { resolve(data); }
      });
    });
  }
}
