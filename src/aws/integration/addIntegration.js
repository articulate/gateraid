import R from 'ramda'

import integrationType from './integrationType'

const {
  assoc,
  curry,
} = R;


export default function addIntegration(httpMethod, config) {
  const {
    type,
    params: requestParameters = {},
    requests = {},
  } = config;

  return function(data) {
    if(!type) { return new Promise(resolve => resolve(data)); }

    const {
      apiId,
      rootResourceId,
      gateway,
      utils: { log, promisify, renderTemplates }
    } = data;

    return renderTemplates(requests, data)
      .then(rendered => assoc('requestTemplates', rendered, config))
      .then(curry(integrationType)(data))
      .then(config => {
        const {
          type,
          credentials,
          uri,
          integrationHttpMethod = httpMethod,
          requestTemplates,
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
          requestTemplates,
        };

        return promisify(gateway.putIntegration, gateway)(args)
          .then(log(`Created integration request for ${httpMethod} on ${rootResourceId}`));
      }).then(_ => data);
  }
}
