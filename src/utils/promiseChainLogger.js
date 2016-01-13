export default function promiseChainLogger() {
  const logging = [].slice.call(arguments, 0);
  return function(data) {
    console.log(...logging);
    return data;
  }
}
