import R from 'ramda'

const {
  assoc,
  mapObjIndexed,
  compose,
  values,
  curry,
  mergeAll,
  flatten,
} = R;

const keylessMap = curry(compose(values, mapObjIndexed));
const formatParam = (type, name, { required }) => assoc(`method.request.${type}.${name}`, required, {});
const mapInput = (params, type) => keylessMap((defn, name) => formatParam(type, name, defn), params);

const formatParams = compose(mergeAll, flatten, keylessMap(mapInput));

export default function createMethod(method) {
  const {
    method: httpMethod,
    body,
    queryParameters: querystring = {},
    headers: header = {},
    uriParameters: path = {},
  } = method;

  return function(data) {
    const {
      utils: { log, promisify, fetchSchemas },
      gateway,
      rootResourceId: resourceId,
      apiId: restApiId,
    } = data;

    const args = {
      restApiId,
      resourceId,
      authorizationType: 'NONE',
      httpMethod: httpMethod.toUpperCase(),
      requestParameters: formatParams({ querystring, header, path }),
      requestModels: fetchSchemas(body),
    };

    return promisify(gateway.putMethod, gateway)(args)
      .then(log(`Created method ${httpMethod} on ${resourceId}`))
      .then(_ => data);
  }
}
