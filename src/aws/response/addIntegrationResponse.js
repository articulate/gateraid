import promisify from '../../utils/promisify'
import log from '../../utils/promiseChainLogger'
import renderTemplates from '../../renderTemplates'

export default function addIntegrationResponse(httpMethod, selectionPattern, config, data) {
  const {
    'status-code': intStatusCode,
    templates,
  } = config;

  const statusCode = intStatusCode.toString();

  const {
    gateway,
    rootResourceId: resourceId,
    apiId: restApiId,
    awsConfig: { renderTemplate },
  } = data;

  return renderTemplates(renderTemplate, templates)
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
