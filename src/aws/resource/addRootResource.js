export default function addRootResource(data) {
  const { gateway, apiId } = data;

  return new Promise((resolve, reject) => {
    gateway.getResources({ restApiId: apiId }, (err, resp) => {
      if(err) { reject(err); }
      else {
        resolve(Object.assign({}, data, { rootResourceId: resp.items[0].id }));
      }
    });
  });
}
