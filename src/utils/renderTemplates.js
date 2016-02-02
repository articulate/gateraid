import R from 'ramda'
import 'babel-polyfill'

const {
  assoc,
  both,
  cond,
  is,
  mapObjIndexed,
  mergeAll,
  values,
  T: True,
} = R;

const isFile = both(
    (pathOrObject) => is(String, pathOrObject),
    (pathOrObject) => pathOrObject.endsWith('.mustache'));

const mimeMap = {
  form: 'application/x-www-form-urlencoded',
  json: 'application/json',
}

const contentResolver = cond([
  [is(Object), JSON.stringify],
  [True, val => val],
]);

export default function renderTemplates(templates, data) {
  const {
    utils: { readFile },
    renderTemplate,
  } = data;

  const promises = values(mapObjIndexed((pathOrTemplate, mime) => {
    if(!isFile(pathOrTemplate)) {
      return Promise.resolve(assoc(mimeMap[mime], contentResolver(pathOrTemplate), {}));
    }

    return readFile(pathOrTemplate)
      .then(buf => buf.toString()) // reader returns a Buffer, renderer expects a String
      .then(renderTemplate)
      .then(rendered => assoc(mimeMap[mime], rendered, {}));
  }, templates));

  return Promise.all(promises)
    .then(mergeAll);
}
