import R from 'ramda'

const {
  path,
  curry,
  assoc,
  __: _,
  } = R;

export default function addIntegrationResponse(method, selectionPattern) {
  let { method: httpMethod } = method;
  httpMethod = httpMethod.toUpperCase();

  return function(data) {
    const {
      gateway,
      rootResourceId: resourceId,
      apiId: restApiId,
      utils: { promisify, log, renderTemplates },
      resourcePath,
      } = data;

    const { responses:
      { [selectionPattern]: response }
      } = path(resourcePath, data);

    if(!response) { return Promise.resolve(data); }

    const {
      'status-code': statusCode,
      templates,
      } = response;

    const args = {
      restApiId,
      resourceId,
      httpMethod,
      statusCode: statusCode.toString(),
      selectionPattern,
      responseParameters: {}
    };

    return renderTemplates(templates, data)
      .then(curry(assoc)('responseTemplates', _, args))
      .then(promisify(gateway.putIntegrationResponse, gateway))
      .then(log(`Created integration response for ${statusCode} to method ${httpMethod} on ${resourceId}`))
      .then(_ => data);
  }
}
