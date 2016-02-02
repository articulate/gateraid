import createMethods from '../method/createMethods'
import createResource from './createResource'

export default function createResources(resources) {
  return function(data) {
    if (!resources) { return Promise.resolve(data); }

    const promises = resources.map(resource => {
      const { relativeUri, methods, resources } = resource;

      return createResource(relativeUri)(data)
        .then(createMethods(methods))
        .then(createResources(resources));
    });

    return Promise.all(promises)
      .then(_ => data);
  }
}
