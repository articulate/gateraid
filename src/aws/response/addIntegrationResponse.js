export default function addIntegrationResponse(httpMethod, selectionPattern, config) {
  const {
    'status-code': intStatusCode,
    templates,
    } = config;

  const statusCode = intStatusCode.toString();

  return function(data) {
    const {
      gateway,
      rootResourceId: resourceId,
      apiId: restApiId,
      utils: { promisify, log, renderTemplates }
    } = data;

    return renderTemplates(templates, data)
      .then(rendered => {
        const args = {
          restApiId,
          resourceId,
          httpMethod,
          statusCode,
          selectionPattern,
          responseParameters: {},
          responseTemplates: rendered,
        };

        return promisify(gateway.putIntegrationResponse, gateway)(args)
          .then(log(`Created integration response for ${statusCode} to method ${httpMethod} on ${resourceId}`));
      });
  }
}
