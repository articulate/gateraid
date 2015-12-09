import promisify from '../utils/promisify'

const defaultContentType = 'application/json';

function createModel(schemaDef, apiId, gateway) {
  const name = Object.keys(schemaDef)[0],
        schema = schemaDef[name];

  console.log(`Creating model: ${name}`);

  const args = {
    name,
    schema,
    restApiId: apiId,
    description: schema.title,
    contentType: defaultContentType,
  };

  return promisify(gateway.createModel, gateway)(args);
}

export default function createModels(data) {
  const { gateway, apiId, definition: { schemas }} = data;

  const promises = schemas.map(schema => createModel(schema, apiId, gateway));

  return Promise.all(promises)
    .then(resp => data);
}
