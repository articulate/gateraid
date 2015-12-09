import raml from 'raml-parser'

function parseRaml(filename, data) {
  return raml.loadFile(filename).then(definition => Object.assign({}, data, { definition }));
}

export default function generateRamlParser(filename) {
  return (data) => parseRaml(filename, data);
}
