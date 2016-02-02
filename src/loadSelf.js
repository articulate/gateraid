import { merge } from 'ramda'

import log from './utils/promiseChainLogger'
import promisify from './utils/promisify'
import readFile from './utils/promisedFileRead'
import renderTemplates from './utils/renderTemplates'
import fetchSchemas from './utils/fetchSchemas'

import createResource from './aws/resource/createResource'
import createMethod from './aws/method/createMethod'
import formatIntegrationRequest from './aws/integration/formatIntegrationRequest'

const utils = {
  log,
  promisify,
  readFile,
  renderTemplates,
  fetchSchemas,
}

const lib = {
  createResource,
  createMethod,
  formatIntegrationRequest,
}

export default function loadSelf(data={}) {
  return merge({ utils, lib }, data);
};
