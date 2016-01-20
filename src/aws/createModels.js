import createModel from './model/createModel'

export default function createModels(data) {
  const { definition: { schemas }} = data;

  const promises = schemas.map(schemaDef => {
    const name = Object.keys(schemaDef)[0],
          schema = schemaDef[name];

    return createModel(name, schema)(data);
  });

  return Promise.all(promises)  // synchronize
    .then(_ => data);  // restore data chain
}
