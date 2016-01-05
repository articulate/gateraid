import promisify from '../../utils/promisify'
import integrationType from './integrationType'

export default function addIntegration(httpMethod, config) {
  const {
    type,
    requests,
    params: requestParameters = {},
  } = config;

  return function(data) {
    if(!type) { return new Promise(resolve => resolve(data)); }

    console.log(`Creating integration request for ${httpMethod} of type ${type}`);

    const {
      apiId,
      rootResourceId,
      gateway,
    } = data;

    integrationType(data, config)
      .then(config => {
        const {
          type,
          credentials,
          uri,
          integrationHttpMethod = httpMethod,
        } = config;

        const args = {
          httpMethod,
          credentials,
          resourceId: rootResourceId,
          restApiId: apiId,
          type,
          uri,
          requestParameters,
          integrationHttpMethod,
          requestTemplates: {},
        };

        console.log(`INTEGRATION ${httpMethod}`, args);

        return promisify(gateway.putIntegration, gateway)(args);
      })
      .then(_ => data);
  }
}
