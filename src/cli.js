import program from 'commander'
import path from 'path'

import apiGateway from './apiGateway.js'
import config from './config.js'

const localConfig = config();

program
  .version('0.0.1')
  .usage('gater [options] NAME')
  .option('-p, --profile [profile]', 'Select AWS credential profile to use.')

program

program
  .command('rm')
  .description('Destroy an API')
  .option('--id [ID]', "API ID")
  .action(function(options) {
    const {
      profile,
      id,
    } = options;

    const gateway = apiGateway(profile);
    const apiId = (id || localConfig.get('api.id'));

    if(!apiId) {
      console.error('API ID not given. Has it deployed yet?');
      process.exit(1);
    }

    gateway.destroyAPI(apiId);
    localConfig.remove('api.id');
  });
  .command('config [action] [args...]')
  .description('Manage config settings')
  .action(function(action, args, options) {
    if(action == 'set') {
      args.forEach(setting => {
        let [key, val] = setting.split('=');
        localConfig.set(key, val);
      });
    } else if (action == 'get') {
      if(args.length == 1) {
        console.log(localConfig.get(args[0]));
      } else {
        args.forEach(key => {
          const value = localConfig.get(key);
          console.log(`${key}=${value}`);
        });
      }
    } else if(action == 'rm') {
      args.forEach(key => {
        localConfig.remove(key);
      });
    } else {
      localConfig.print();
    }
  });

program.parse(process.argv);
