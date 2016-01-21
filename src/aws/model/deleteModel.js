export default function deleteModel(modelName) {
  return function (data) {
    const { gateway, apiId: restApiId, utils: { log, promisify } } = data;
    const args = {restApiId, modelName};

    return promisify(gateway.deleteModel, gateway)(args)
      .then(log(`Deleted model ${modelName}`));
  }
}
