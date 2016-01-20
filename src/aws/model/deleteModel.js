import promisify from '../../utils/promisify'
import log from '../../utils/promiseChainLogger'

export default function deleteModel(modelName) {
  return function (data) {
    const { gateway, apiId: restApiId } = data;
    const args = {restApiId, modelName};

    return promisify(gateway.deleteModel, gateway)(args)
    .then(log(`Deleted model ${modelName}`));
  }
}
