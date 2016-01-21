import { reduce } from 'ramda'
import urlParser from 'url'

export default function createResourcePath(data) {
  const {
    definition: { baseUri },
    lib: { createResource }
  } = data;

  const { pathname } = urlParser.parse(baseUri);
  const parts = pathname.replace(/^\/|\/$/g, '').split('/');

  return reduce(
    (promise, part) => promise.then(createResource(part)),
    Promise.resolve(data),
    parts);
}
