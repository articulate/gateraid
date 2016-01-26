import addIntegration from './aws/integration/addIntegration'
import addMethodResponses from './aws/response/addMethodResponses'
import addIntegrationResponses from './aws/response/addIntegrationResponses'

export default function buildAction(method, config) {
  const {
    method: rawMethod,
    responses,
    } = method;

  const {
    responses: responsesConfig = {},
  } = config;

  const httpMethod = rawMethod.toUpperCase();

  return function(data) {
    const { lib: { createMethod } } = data;

    return createMethod(method)(data)
      .then(_ => data)
      .then(addIntegration(httpMethod, config))
      .then(addMethodResponses(httpMethod, responses))
      .then(addIntegrationResponses(httpMethod, responsesConfig));
  }
}
