import R from 'ramda'
import 'babel-polyfill'
import readFile from './utils/promisedFileRead'

const {
  mapObjIndexed,
  values,
  mergeAll,
  assoc,
  is,
  both,
} = R;

const isFile = both(
    (pathOrObject) => is(String, pathOrObject),
    (pathOrObject) => pathOrObject.endsWith('.mustache'));

const mimeMap = {
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
}

export default function renderTemplates(renderer, templates) {
  const promises = values(mapObjIndexed((pathOrTemplate, mime) => {
    if(!isFile(pathOrTemplate)) { return Promise.resolve(assoc(mimeMap[mime], JSON.stringify(pathOrTemplate), {})); }

    return readFile(pathOrTemplate)
      .then(buf => buf.toString()) // reader returns a Buffer, renderer expects a String
      .then(renderer)
      .then(rendered => assoc(mimeMap[mime], rendered, {}));
  }, templates));

  return Promise.all(promises)
    .then(mergeAll);
}
