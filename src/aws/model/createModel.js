import promisify from '../../utils/promisify'
import log from '../../utils/promiseChainLogger'

const defaultContentType = 'application/json';

export default function createModel(name, schema) {
  return function(data) {
    const { gateway, apiId } = data;
    const args = {
      name,
      schema,
      restApiId: apiId,
      description: schema.title,
      contentType: defaultContentType,
    };

    return promisify(gateway.createModel, gateway)(args)
      .then(log(`Created model ${name}`));
  }
}
