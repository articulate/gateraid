import buildAction from '../../buildAction'

export default function createMethods(methods, methodsConfig={}) {
  return function(data) {
    if(methods == undefined) { return Promise.resolve(data); }

    const promises = methods.map(method => {
      const { method: rawMethod } = method;
      const config = methodsConfig[rawMethod] || {};

      return buildAction(method, config)(data);
    });

    return Promise.all(promises)
      .then(_ => data);
  }
}
