import R from 'ramda'

const {
  path,
} = R;

export default function addMethodResponse(method, statusCode) {
  let { method: httpMethod } = method;
  httpMethod = httpMethod.toUpperCase();

  return function (data) {
    const {
      utils: { log, promisify, fetchSchemas },
      gateway,
      rootResourceId: resourceId,
      apiId: restApiId,
      resourcePath,
    } = data;

    const { body } = path(resourcePath, data);
    const responseModels = fetchSchemas(body);

    const args = {
      restApiId,
      resourceId,
      httpMethod,
      statusCode,
      responseModels,
      responseParameters: {},
    };

    return promisify(gateway.putMethodResponse, gateway)(args)
      .then(log(`Created method response for ${statusCode} to method ${httpMethod} on ${resourceId}`))
      .then(_ => data);
  }
}
