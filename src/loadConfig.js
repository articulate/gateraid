import config from './utils/config'

export default function loadConfig(options) {
  return new Promise(resolve => {
    resolve({ config: config(), options });
  });
}
