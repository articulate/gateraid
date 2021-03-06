import R from 'ramda'
import urlParser from 'url'

const {
  pipeP,
  map,
  dissoc,
  } = R;

export default function createResourcePath(data) {
  const {
    definition: { baseUri },
    lib: { createResource },
    } = data;

  const { pathname } = urlParser.parse(baseUri);
  const parts = pathname.replace(/^\/|\/$/g, '').split('/');


  return pipeP(...map(createResource, parts))(data)
  // reset the resourceLens since all resources are
  // relative to the baseUri path
    .then(dissoc('resourcePath'));
}
