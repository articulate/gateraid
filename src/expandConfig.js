import yaml from 'js-yaml'
import dotenv from 'dotenv'
import R from 'ramda'
import Mustache from 'mustache'

import readFile from './utils/promisedFileRead'

const {
  __: _,
  curry,
} = R;

function parse(yaml) {
  const { env, endpoints } = yaml;

  return readFile(env)
    .then(dotenv.parse)
    .then(context => curry(Mustache.render)(_, context, []))
    .then(contextRender => {
      return { renderTemplate: contextRender, endpoints };
    });
}

// returns an object form of { renderTemplate, endpoints }
export default function expandConfig(filepath) {
  return readFile(filepath)
    .then(yaml.safeLoad)
    .then(parse);
}
