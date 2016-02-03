import R from 'ramda'

const {
  merge,
  path,
} = R;

export default function lambdaFormatter(data) {
  const rootPath = 'arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/';
  const {
    utils: { lookupRole, lambdaLookup },
    resourcePath,
    } = data;
  const {
    'lambda-name': functionName,
    'iam-role': roleName,
    } = path(resourcePath, data);

  return function (args) {
    return Promise.all([ lambdaLookup(functionName), lookupRole(roleName) ])
      .then(([func, role]) => merge(args, {
        type: 'AWS',
        uri: `${rootPath}${func.Configuration.FunctionArn}`,
        credentials: role.Role.Arn,
      }));
  }
}
