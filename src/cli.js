import program from 'commander'
import path from 'path'

import config from './config.js'

const localConfig = config();

program
  .version('0.0.1')
  .usage('gater [options] NAME')
  .option('-p, --profile [profile]', 'Select AWS credential profile to use.')

program
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
