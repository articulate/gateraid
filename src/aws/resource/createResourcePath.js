import { pipeP, map } from 'ramda'
import urlParser from 'url'

export default function createResourcePath(data) {
  const {
    definition: { baseUri },
    lib: { createResource },
  } = data;

  const { pathname } = urlParser.parse(baseUri);
  const parts = pathname.replace(/^\/|\/$/g, '').split('/');

  return pipeP(map(createResource, parts));
}
