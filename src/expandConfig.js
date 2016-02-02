import yaml from 'js-yaml'
import dotenv from 'dotenv'
import R from 'ramda'
import Mustache from 'mustache'

import readFile from './utils/promisedFileRead'

const {
  __: _,
  curry,
  merge,
} = R;

function parse(yaml) {
  const { env, endpoints: resourceConfig } = yaml;

  return readFile(env)
    .then(dotenv.parse)
    .then(context => curry(Mustache.render)(_, context, []))
    .then(renderTemplate => ({ renderTemplate, resourceConfig }));
}

export default function expandConfig(filepath) {
  return function(data) {
    return readFile(filepath)
      .then(yaml.safeLoad)
      .then(parse)
      .then(curry(merge)(_, data));
  }
}
