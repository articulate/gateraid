import R from 'ramda'

import promisify from '../../utils/promisify'
import integrationType from './integrationType'
import renderTemplates from '../../renderTemplates'

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

    console.log(`Creating integration request for ${httpMethod} of type ${type}`);

    const {
      apiId,
      rootResourceId,
      gateway,
      awsConfig: { renderTemplate }
    } = data;

    renderTemplates(renderTemplate, requests)
      .then(rendered => assoc('requestTemplates', rendered, config))
      .then(res => integrationType(data, res)
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

          console.log(`INTEGRATION ${httpMethod}`, args);

          return promisify(gateway.putIntegration, gateway)(args);
        }))
    .catch(err => console.error(err.stack))
    .then(_ => data);
  }
}
