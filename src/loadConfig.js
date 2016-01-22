import { merge } from 'ramda'
import config from './utils/config'
import expandConfig from './expandConfig'

export default function loadConfig(options) {
  const base = { config: config(), options };
  const promise = Promise.resolve(base);

  if(options.config) { return promise.then(expandConfig(options.config)); }

  return promise;
}
