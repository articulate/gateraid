import createMethod from './createMethod'

export default function createMethods(methods, methodsConfig={}) {
  return function(data) {
    if(methods == undefined) { return new Promise(resolve => resolve(data)); }

    const promises = methods.map(method => {
      const { method: rawMethod } = method;
      const config = methodsConfig[rawMethod] || {};

      createMethod(method, config)(data);
    });

    return Promise.all(promises)
      .then(_ => data);
  }
}
