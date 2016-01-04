import program from 'commander'
import path from 'path'

import loadConfig from './loadConfig'
import prepareAws from './prepareAws'
import parseRaml from './parseRaml'
import generateConfigHandler from './generateConfigHandler'

import createApi from './aws/api/createApi'
import removeDefaultModels from './aws/removeDefaultModels'
import createModels from './aws/createModels'
import buildResources from './aws/buildResources'
import destroyApi from './aws/api/destroyApi'

function handleError(err) {
  console.error(err.stack);
  process.exit(1);
}

program
  .version('0.0.1')
  .alias('gater')
  .usage('[options] <NAME>')
  .option('-p, --profile [profile]', 'Select AWS credential profile to use [default].', 'default')

program
  .command('create <filename>')
  .description('Create new API Gateway from a RAML file definition.')
  .option('-n, --name [name]', 'Name for the API (defaults to project directory name).', path.basename(process.cwd()))
  .option('-c, --config <path>', 'AWS-specific config YAML config file.')
  .option('-t, --test', 'Test operations. Remove after creating.', false)
  .action(function(filename, options) {
    loadConfig(options)
      .then(prepareAws)
      .then(parseRaml(filename))
      .then(createApi)
      .then(removeDefaultModels)
      .then(createModels)
      .then(buildResources)
      .then(data => {
        const { apiId, config } = data;

        config.set('api.id', apiId);
        console.log(`Created API Gateway ${apiId}`);
        return data;
      })
      .then(data => {
        const { options: { test } } = data;
        if(test) { destroyApi(data); }

        return data;
      })
      .catch(err => {
        // destroyApi(data);
        handleError(err);
      });
  });

program
  .command('rm')
  .description('Destroy an API')
  .option('--id [id]', "API ID")
  .action(function(options) {
    loadConfig(options)
      .then(prepareAws)
      .then(destroyApi)
      .then(data => {
        const { apiId, config } = data;

        config.remove('api.id');
      })
      .catch(handleError);
  });

program
  .command('config [action] [args...]')
  .description('Manage config settings')
  .action(function(action, args, options) {
    loadConfig(options)
      .then(generateConfigHandler(action, args))
      .catch(handleError);
  });

program.parse(process.argv);
