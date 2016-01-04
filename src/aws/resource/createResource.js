export default function createResource(pathPart) {
  return function(data) {
    const { gateway, apiId, rootResourceId } = data;

    const args = {
      pathPart,
      parentId: rootResourceId,
      restApiId: apiId,
    };

    console.log(`Creating resource /${pathPart}`);

    return new Promise((resolve, reject) => {
      gateway.createResource(args, (err, resp) => {
        if(err) { reject(err); }
        else {
          resolve(Object.assign({}, data, { rootResourceId: resp.id }));
        }
      });
    });
  }
}
