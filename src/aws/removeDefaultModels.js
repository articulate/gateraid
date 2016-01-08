import R from 'ramda'
import promisify from '../utils/promisify'

const {
  map,
} = R;

export default function removeDefaultModels(data) {
  const { gateway, apiId } = data;

  function deleteModel(model) {
    const { name } = model;
    const args = { restApiId: apiId, modelName: name };

    return promisify(gateway.deleteModel, gateway)(args)
      .then(resp => console.log(`Deleted default models ${name}`));
  }

  return new Promise((resolve, reject) => {
    gateway.getModels({restApiId: apiId}, (err, resp) => {
      if(err) { reject(err); }
      else { resolve(resp.items); }
    });
  })
    .then(promises => Promise.all(promises))  // synchronize
    .then(promise => data); // restore data chain
    .then(map(deleteModel))  // delete all models
    .then(_ => data); // restore data chain
}
