export default function createResource(pathPart) {
  return function(data) {
    const { gateway, apiId, rootResourceId } = data;

    const args = {
      pathPart,
      parentId: rootResourceId,
      restApiId: apiId,
    };

    return new Promise((resolve, reject) => {
      gateway.createResource(args, (err, resp) => {
        if(err) { reject(err); }
        else {
          const { id } = resp;

          console.log(`Created resource /${pathPart} with id ${id}`);
          resolve(Object.assign({}, data, { rootResourceId: id }));
        }
      });
    });
  }
}
