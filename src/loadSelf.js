import { merge } from 'ramda'

import log from './utils/promiseChainLogger'
import promisify from './utils/promisify'
import readFile from './utils/promisedFileRead'
import renderTemplates from './utils/renderTemplates'

import createResource from './aws/resource/createResource'

const utils = {
  log,
  promisify,
  readFile,
  renderTemplates,
}

const lib = {
  createResource,
}

export default function loadSelf(data) {
  return merge({ utils, lib }, data);
};
