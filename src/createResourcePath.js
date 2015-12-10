import urlParser from 'url'
import createResource from './aws/createResource'

export default function createResourcePath(data) {
  const { definition: { baseUri }, rootResourceId } = data;
  const { pathname } = urlParser.parse(baseUri);

  const parts = pathname.split('/').replace(/^\/|\/$/g, '');
  let promise = new Promise(resolve => resolve(data));

  // surely there's a better way to chain these
  parts.forEach(part => {
    promise = promise.then(createResource(part));
  });

  return promise;
}
