import fs from 'fs'

const defaultFile = "./.gateraid.json"

function _read(configFile) {
  try {
    let raw = fs.readFileSync(configFile);
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function _finalize(data, configFile=defaultFile) {
  const encoded = JSON.stringify(data);

  fs.writeFile(configFile, encoded);
  return data;
}

export default function config(path=defaultFile) {
  let config = _read(path);

  return {
    set(key, value) {
      config[key] = value;

      return _finalize(config);
    },

    get(key) {
      return config[key];
    },

    remove(key) {
      delete config[key];
      return _finalize(config);
    },

    print() {
      for(let key in config) {
        console.log(`${key}=${config[key]}`);
      };
    }
  }
}
