import R from 'ramda'

const {
  assoc,
  find,
  propEq,
} = R;

const isRoot = propEq('path', '/');

export default function addRootResource(data) {
  const { gateway, apiId } = data;

  return new Promise((resolve, reject) => {
    gateway.getResources({ restApiId: apiId }, (err, resp) => {
      if(err) { reject(err); }
      else {
        const root = find(isRoot, resp.items);
        resolve(assoc('rootResourceId', root.id, data));
      }
    });
  });
}
