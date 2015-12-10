import promisify from '../utils/promisify'

const defaultContentType = 'application/json';

function buildResources(resources, data) {
  return resources.map(resource => createResource(resource, data));
}

export default function createResources(data) {
  const { definition: { resources, baseUri }} = data;

  return Promise.all(buildResources(resources, data))
    .then(resp => data);
}
