import R from 'ramda'

const {
  assoc,
} = R;

export default function createResource(path) {
  const pathPart = path.replace(/\//g, '');

  return function(data) {
    const {
      gateway,
      apiId: restApiId,
      rootResourceId: parentId,
    } = data;

    const args = { pathPart, parentId, restApiId };

    return new Promise((resolve, reject) => {
      gateway.createResource(args, (err, resp) => {
        if(err) { reject(err); }
        else {
          const { id } = resp;

          console.log(`Created resource /${pathPart} with id ${id}`);
          resolve(assoc('rootResourceId', id, data));
        }
      });
    });
  }
}
