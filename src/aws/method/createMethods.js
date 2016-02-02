import R from 'ramda'
import buildAction from '../../buildAction'

const {
  assoc,
  concat,
} = R;

export default function createMethods(methods) {
  return function (data) {
    if (!methods) { return Promise.resolve(data); }

    const { resourcePath } = data;

    const promises = methods.map(method => {
      const { method: httpMethod } = method;
      const methodPath = concat(resourcePath, httpMethod);

      return buildAction(method)(assoc('resourcePath', methodPath, data));
    });

    return Promise.all(promises)
      .then(_ => data);
  }
}
