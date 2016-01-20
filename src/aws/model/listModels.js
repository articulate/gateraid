export default function listModels(data) {
  const { gateway, apiId: restApiId } = data;

  return new Promise((resolve, reject) => {
    gateway.getModels({ restApiId }, (err, resp) => {
      if(err) { reject(err); }
      else { resolve(resp.items); }
    });
  });
}
