import urlParser from 'url'
import createResource from './createResource'

export default function createResourcePath(data) {
  const { definition: { baseUri } } = data;
  const { pathname } = urlParser.parse(baseUri);

  const parts = pathname.replace(/^\/|\/$/g, '').split('/');
  let promise = Promise.resolve(data);

  // surely there's a better way to chain these
  parts.forEach(part => {
    promise = promise.then(createResource(part));
  });

  return promise;
}
