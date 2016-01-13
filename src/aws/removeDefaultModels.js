import R from 'ramda'
import log from '../utils/promiseChainLogger'
import promisify from '../utils/promisify'

const {
  map,
  bind,
} = R;

export default function removeDefaultModels(data) {
  const { gateway, apiId } = data;

  function deleteModel(model) {
    const { name } = model;
    const args = { restApiId: apiId, modelName: name };

    return promisify(gateway.deleteModel, gateway)(args)
      .then(log(`Deleted default models ${name}`));
  }

  return new Promise((resolve, reject) => {
    gateway.getModels({restApiId: apiId}, (err, resp) => {
      if(err) { reject(err); }
      else { resolve(resp.items); }
    });
  })
    .then(map(deleteModel))  // delete all models
    .then(Promise.all.bind(Promise))  // synchronize
    .then(_ => data); // restore data chain
}
