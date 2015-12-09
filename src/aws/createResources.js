import promisify from '../utils/promisify'

const defaultContentType = 'application/json';

function createResource(resource, data) {
  const { apiId, gateway, rootResourceId } = data;
  const {
    resources,
    relativeUri,
    relativeUriPathSegments,
    methods,
  } = resource;

  console.log(`Creating resource for: ${relativeUri}`);

  const args = {
    parentId: rootResourceId,
    pathPart: relativeUri.replace('/', ''),
    restApiId: apiId,
  };

  return new Promise((resolve, reject) => {
    gateway.createResource(args, (err, resp) => {
      if(err) { reject(err); }
      else {
        if(resources) {
          const newData = Object.assign({}, data, { rootResourceId: resp.id });
          buildResources(resources, newData);
        }
        resolve(data);
      }
    });
  });
}

function buildResources(resources, data) {
  return resources.map(resource => createResource(resource, data));
}

export default function createResources(data) {
  const { definition: { resources }} = data;
  return Promise.all(buildResources(resources, data))
    .then(resp => data);
}
