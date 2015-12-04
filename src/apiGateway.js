import initAWS from './awsInit.js'
import gatewayConfig from './config.js'
export default function apiGateway(profile) {
  const AWS = initAWS(profile);
  const api = new AWS.APIGateway();

  return {
    destroyAPI(apiId) {
      api.deleteRestApi({restApiId: apiId}, (err, data) => {
        if(err) {
          if(err.name == "NotFoundException") { console.warn(`API with ID ${apiId} not found.`); }
          else { handleError(err); }
        }
        else {
          console.log(`Destroyed API Gateway ${apiId}`);
        }
      });
    },
