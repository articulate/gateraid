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

    const { type, requests, params } = path(resourcePath, data);
    if (!type) { return Promise.reject(`No configuration for ${httpMethod} on ${resourceId}`); }

    const args = {
      resourceId,
      restApiId,
      httpMethod,
      requestParameters: params,
      integrationHttpMethod: httpMethod,
    };

    const typeFormatter = requestTypeFormatter(type);

    return renderTemplates(requests, data)
      .then(curry(assoc)('requestTemplates', _, args))
      .then(typeFormatter(data))
  }
}
