import program from 'commander'
import path from 'path'

import loadConfig from './loadConfig'
import loadSelf from './loadSelf'
import prepareAws from './prepareAws'
import configureUtils from './configureUtils'
import parseRaml from './parseRaml'
import generateConfigHandler from './generateConfigHandler'
import openAWSConsole from './openAWSConsole'

import createApi from './aws/api/createApi'
import removeDefaultModels from './aws/model/removeDefaultModels'
import createModels from './aws/createModels'
import buildResources from './aws/buildResources'
import destroyApi from './aws/api/destroyApi'

function handleError(err) {
  console.error(err.stack);
  process.exit(1);
}

program
  .version('0.0.1')
  .usage('[options] <NAME>')
  .option('-p, --profile [profile]', 'Select AWS credential profile to use.', 'default')
  .option('-r, --region [us-east-1]', 'Select AWS region to use.', 'us-east-1')

program
  .command('create <filename>')
  .description('Create new API Gateway from a RAML file definition.')
  .option('-n, --name [name]', 'Name for the API (defaults to project directory name).', path.basename(process.cwd()))
  .option('-c, --config <path>', 'AWS-specific config YAML config file.')
  .option('-t, --test', 'Test operations. Remove after creating.', false)
  .action(function(filename, options) {
    loadConfig(options)
      .then(prepareAws)
      .then(loadSelf)
      .then(configureUtils)
      .then(parseRaml(filename))
      .then(createApi)
      .then(removeDefaultModels)
      .then(createModels)
      .then(buildResources)
      .then(data => {
        const { apiId, config } = data;

        config.set('api.id', apiId);
        console.log(`Finished building API ${apiId}`);
        return data;
      })
      .then(data => {
        const { options: { test } } = data;
        if(test) { destroyApi(data); }

        return data;
      })
      .catch(handleError);
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
        const { config } = data;

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

program
  .command('open')
  .description('Open gateway in the AWS console')
  .option('--id [id]', "API ID")
  .action(function(options) {
    loadConfig(options)
      .then(openAWSConsole);
  });

program.parse(process.argv);
