import R from 'ramda'

import readFile from './utils/promisedFileRead'

const {
  mapObjIndexed,
  values,
  mergeAll,
  assoc,
} = R;

const mimeMap = {
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
}

export default function renderTemplates(renderer, templates) {
  const promises = values(mapObjIndexed((filepath, mime, object) => readFile(filepath)
      .then(buf => buf.toString()) // reader returns a Buffer, renderer expects a String
      .then(renderer)
      .then(rendered => assoc(mimeMap[mime], rendered, {}))
    , templates));

  return Promise.all(promises)
    .then(mergeAll);
}
