import { assoc } from 'ramda'
import config from './utils/config'
import expandConfig from './expandConfig'

export default function loadConfig(options) {
  const base = { config: config(), options };

  if(!options.config) { return new Promise(resolve => resolve(base)); }
  else {
    return expandConfig(options.config)
      .then(config => assoc('awsConfig', config, base));
  }
}
