import R from 'ramda'

import readFile from '../../utils/promisedFileRead'
import promisify from '../../utils/promisify'

const {
  cond,
  equals,
  map,
  T: True,
  always,
} = R;

const rootPath = 'arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/';

function renderTemplates(renderer, templates) {
  return map(templateFile => {
    readFile(templateFile)
      .then(renderer);
  }, templates);
}

function lambdaLookup(AWS, config) {
  const lambda = new AWS.Lambda();
  const iam = new AWS.IAM();
  const {
    'lambda-name': functionName,
    'iam-role': role,
  } = config;

  return Promise.all([
    promisify(lambda.getFunction, lambda)({FunctionName: functionName}),
    promisify(iam.getRole, iam)({RoleName: role}),
  ]).then(([func, role]) => {
    return {
      type: 'AWS',
      uri: `${rootPath}${func.Configuration.FunctionArn}`,
      credentials: role.Role.Arn,
    }
  });
}

function proxy(config) {
  const {
    'http-method': integrationHttpMethod,
    url: uri,
  } = config;

  return new Promise(resolve => resolve({
    type: 'HTTP',
    integrationHttpMethod,
    uri,
  }));
}

export default function integrationType(data, config) {
  const { AWS, awsConfig: { renderTemplate } } = data;
  const { type, requests } = config;

  // console.log(renderTemplates(renderTemplate, requests));

  return cond([
    [equals('lambda'), always(lambdaLookup(AWS, config))],
    [equals('http-proxy'), always(proxy(config))],
    [True, always(new Promise(resolve => resolve({ type: 'MOCK' })))],
  ])(type);
}
