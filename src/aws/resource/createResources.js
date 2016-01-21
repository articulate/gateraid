import createMethods from '../method/createMethods'
import createResource from './createResource'

export default function createResources(resources) {
  return function(data) {
    if(resources == undefined) { return Promise.resolve(data); }

    const promises = resources.map(resource => {
      const { relativeUri, methods, resources } = resource;
      const { awsConfig: {
        endpoints: {
          [relativeUri]: resourceConfig,
        }}} = data;

      return createResource(relativeUri)(data)
        .then(createMethods(methods, resourceConfig))
        .then(createResources(resources));
    });

    return Promise.all(promises)
      .then(_ => data);
  }
}
