export default function destroyApi(data) {
  const { options, config, gateway } = data;
  const apiId = options.id || config.get('api.id');

  return new Promise((resolve, reject) => {
    if(!apiId) { reject(new Error('API ID not given. Has it deployed yet?')); }

    gateway.deleteRestApi({ restApiId: apiId }, (err, resp) => {
      if(err) { reject(err); }
      else {
        console.log(`Destroyed API Gateway ${apiId}`);
        resolve(Object.assign({}, data, { apiId }));
      }
    });
  });
}
