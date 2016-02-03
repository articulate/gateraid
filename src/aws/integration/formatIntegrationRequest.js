import R from 'ramda'

const {
  path,
  curry,
  assoc,
  __: _,
} = R;

export default function formatIntegrationRequest(method) {
  let { method: httpMethod } = method;
  httpMethod = httpMethod.toUpperCase();

  return function (data) {
    const {
      utils: { renderTemplates },
      lib: { requestTypeFormatter },
      rootResourceId: resourceId,
      apiId: restApiId,
      resourcePath,
    } = data;

    const config = path(resourcePath, data);
    if (!config) { return Promise.reject(`No configuration for ${httpMethod} on ${resourceId}`); }

    const args = {
      resourceId,
      restApiId,
      httpMethod,
      requestParameters: config.params,
      integrationHttpMethod: httpMethod,
    };

    const typeFormatter = requestTypeFormatter(config.type);

    return renderTemplates(config.requests, data)
      .then(curry(assoc)('requestTemplates', _, args))
      .then(typeFormatter(data))
  }
}
