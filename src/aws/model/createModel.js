import promisify from '../../utils/promisify'

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

    console.log(`Creating model: ${name}`);

    return promisify(gateway.createModel, gateway)(args);
  }
}
