import R from 'ramda'
import raml from 'raml-parser'

const {
  merge,
} = R;

function readFile(filename, data) {
  return raml.loadFile(filename, {applySchemas: false})
    .then(definition => merge({ definition }, data));
}

export default function parseRaml(filename) {
  return (data) => readFile(filename, data);
}
