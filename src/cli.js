import program from 'commander'
import path from 'path'

import loadConfig from './loadConfig'
import prepareAws from './prepareAws'
import parseRaml from './parseRaml'
import generateConfigHandler from './generateConfigHandler'

import createApi from './aws/createApi'
import removeDefaultModels from './aws/removeDefaultModels'
import createBasePath from './aws/createBasePath'
import createModels from './aws/createModels'
import addRootResource from './aws/addRootResource'
import createResourcePath from './createResourcePath'
import createResources from './aws/createResources'
import destroyApi from './aws/destroyApi'

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
  .option('-c, --config [path]', 'AWS-specific config JSON file.')
  .action(function(filename, options) {
    loadConfig(options)
      .then(prepareAws)
      .then(parseRaml(filename))
      .then(createApi)
      .then(removeDefaultModels)
      .then(createModels)
      .then(addRootResource)
      .then(createResourcePath)
      .then(createResources)
      .then(data => {
        const { apiId, config } = data;

        config.set('api.id', apiId);
        console.log(`Created API Gateway ${apiId}`);
      }).catch(handleError);
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
        console.log(`Destroyed API Gateway ${apiId}`);
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
