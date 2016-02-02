import R from 'ramda'

const {
  merge,
  concat,
} = R;

const rootPath = ['resourceConfig'];

export default function createResource(path) {
  const pathPart = path.replace(/\//g, '');

  return function (data) {
    const {
      gateway,
      apiId: restApiId,
      rootResourceId: parentId,
      resourcePath = rootPath,
    } = data;

    const subPath = concat(resourcePath, path);
    const args = { pathPart, parentId, restApiId };

    return new Promise((resolve, reject) => {
      gateway.createResource(args, (err, resp) => {
        if (err) { reject(err); }
        else {
          const { id } = resp;

          console.log(`Created resource /${pathPart} with id ${id}`);
          resolve(merge(data, { rootResourceId: id, resourcePath: subPath }));
        }
      });
    });
  }
}
