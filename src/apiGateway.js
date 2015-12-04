import promisify from './utils/promisify.js'
import initAWS from './awsInit.js'
import gatewayConfig from './config.js'
export default function apiGateway(profile) {
  const AWS = initAWS(profile);
  const api = new AWS.APIGateway();

  return {
    destroyAPI(apiId) {
      return promisify(api.deleteRestApi, api)({restApiId: apiId})
        .then(resp => console.log(`Destroyed API Gateway ${apiId}`))
        .catch(err => {
          if(err.name == "NotFoundException") { console.warn(`API with ID ${apiId} not found. Ignored.`); }
          else { handleError(err); }
        });
    },
  };
}
