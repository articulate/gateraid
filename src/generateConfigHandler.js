const configActions = {
  set(args, config) {
    args.forEach(setting => {
      let [key, val] = setting.split('=');
      config.set(key, val);
    });
  },

  get(args, config) {
    if(args.length == 1) {
      console.log(config.get(args[0]));
    } else {
      args.forEach(key => {
        const value = config.get(key);
        console.log(`${key}=${value}`);
      });
    }
  },

  rm(args, config) {
    args.forEach(key => {
      config.remove(key);
    });
  },

  print(args, config) {
    config.print();
  },
};

function withConfig(fn, args) {
  return (data) => {
    const { config } = data;
    return fn(args, config);
  }
}

export default function generateConfigHandler(action="print", args) {
  return withConfig(configActions[action], args);
}
