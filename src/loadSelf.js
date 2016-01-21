import { merge } from 'ramda'

import log from './utils/promiseChainLogger'
import promisify from './utils/promisify'
import readFile from './utils/promisedFileRead'
import renderTemplates from './utils/renderTemplates'

const utils = {
  log,
  promisify,
  readFile,
  renderTemplates,
}

export default function loadSelf(data) {
  return merge({ utils }, data);
};
