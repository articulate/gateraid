import promisify from '../utils/promisify'

export default function removeDefaultModels(data) {
  const { gateway, apiId } = data;

  function deleteModel(model) {
    console.log(`Deleting default models ${model.name}`);
    
    promisify(gateway.deleteModel, gateway)({ restApiId: apiId, modelName: model.name });
  }

  return new Promise((resolve, reject) => {
    gateway.getModels({restApiId: apiId}, (err, resp) => {
      if(err) { reject(err); }
      else { resolve(resp.items); }
    });
  })
    .then(models => models.map(deleteModel))  // delete all models
    .then(promises => Promise.all(promises))  // syncronize
    .then(promise => data); // restore data chain
}
