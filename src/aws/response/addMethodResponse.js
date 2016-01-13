import log from '../../utils/promiseChainLogger'
import promisify from '../../utils/promisify'
import formatSchemas from '../../utils/formatSchemas'

export default function addMethodResponse(httpMethod, statusCode, responseDefn) {
  const {
    body,
  } = responseDefn;

  return function (data) {
    const {
      gateway,
      rootResourceId,
      apiId,
    } = data;

    let responseModels = {};

    if (body) {
      responseModels = formatSchemas(body);
    }

    const args = {
      restApiId: apiId,
      resourceId: rootResourceId,
      httpMethod,
      statusCode,
      responseModels,
      responseParameters: {},
    };

    return promisify(gateway.putMethodResponse, gateway)(args)
      .then(log(`Created method response for ${statusCode} to method ${httpMethod} on ${rootResourceId}`));
  }
}
