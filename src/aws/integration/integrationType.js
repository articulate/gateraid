import R from 'ramda'

import promisify from '../../utils/promisify'

const {
  cond,
  equals,
  map,
  T: True,
  always,
  merge,
} = R;

const rootPath = 'arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/';
const mockRequest = always(new Promise(resolve => resolve({ type: 'MOCK' })))

function lambda(AWS, config) {
  const lambda = new AWS.Lambda();
  const iam = new AWS.IAM();
  const {
    'lambda-name': functionName,
    'iam-role': role,
    requestTemplates,
  } = config;

  return Promise.all([
    promisify(lambda.getFunction, lambda)({FunctionName: functionName}),
    promisify(iam.getRole, iam)({RoleName: role}),
  ]).then(([func, role]) => {
    return merge(config, {
      type: 'AWS',
      uri: `${rootPath}${func.Configuration.FunctionArn}`,
      credentials: role.Role.Arn,
    });
  });
}

function proxy(config) {
  const {
    'http-method': integrationHttpMethod,
    url: uri,
    requestTemplates,
  } = config;

  return new Promise(resolve => resolve(merge(config, {
    type: 'HTTP',
    integrationHttpMethod,
    requestTemplates,
    uri,
  })));
}

export default function integrationType(data, config) {
  const { AWS, awsConfig: { renderTemplate } } = data;
  const { type } = config;

  return cond([
    [equals('lambda'), always(lambda(AWS, config))],
    [equals('http-proxy'), always(proxy(config))],
    [True, mockRequest],
  ])(type);
}
