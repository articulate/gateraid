import addRootResource from './resource/addRootResource'
import createResourcePath from './resource/createResourcePath'
import createResources from './resource/createResources'
// import createMethods from './method/createMethods'

const defaultContentType = 'application/json';

export default function buildResources(data) {
  const { definition: { resources }} = data;

  return addRootResource(data)
    .then(createResourcePath)
    .then(createResources(resources)) // create root-level resources
    .then(() => data);  // restore data chain
}
