import raml from 'raml-parser'

function readFile(filename, data) {
  return raml.loadFile(filename).then(definition => Object.assign({}, data, { definition }));
}

export default function parseRaml(filename) {
  return (data) => readFile(filename, data);
}
