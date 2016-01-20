import promisify from '../../utils/promisify'
import log from '../../utils/promiseChainLogger'

const defaultContentType = 'application/json';

export default function createModel(name, schema) {
  return function(data) {
    const { gateway, apiId } = data;
    const parsed = JSON.parse(schema);
    const args = {
      name,
      schema: schema,
      restApiId: apiId,
      description: parsed.title,
      contentType: defaultContentType,
    };

    return promisify(gateway.createModel, gateway)(args)
      .then(log(`Created model ${name}`));
  }
}
