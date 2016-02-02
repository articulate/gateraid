import R from 'ramda'

const {
  cond,
  merge,
  equals,
  path,
} = R;

const rootPath = 'arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/';

export default function formatIntegrationRequest(method) {
  let { method: httpMethod } = method;
  httpMethod = httpMethod.toUpperCase();

  return function (data) {
    const {
      utils: { lookupRole, lambdaLookup, renderTemplates },
      rootResourceId: resourceId,
      apiId: restApiId,
      resourcePath,
    } = data;

    const config = path(resourcePath, data);
    if(!config) { return Promise.reject(`No configuration for ${httpMethod} on ${resourceId}`); }

    const args = {
      resourceId,
      restApiId,
      httpMethod,
      requestParameters: config.params,
      integrationHttpMethod: httpMethod,
    };

    function lambdaFormatter() {
      const {
        'lambda-name': functionName,
        'iam-role': roleName,
        } = config;

      return Promise.all([ lambdaLookup(functionName), lookupRole(roleName) ])
        .then(([func, role]) => merge(args, {
          type: 'AWS',
          uri: `${rootPath}${func.Configuration.FunctionArn}`,
          credentials: role.Role.Arn,
        }));
    }

    function proxyFormatter() {
      const {
        'http-method': integrationHttpMethod,
        url: uri,
        } = config;

      return Promise.resolve(merge(args, {
        type: 'HTTP',
        integrationHttpMethod,
        uri,
      }, args));
    }

    return cond([
                  [ equals('lambda'), lambdaFormatter ],
                  [ equals('http-proxy'), proxyFormatter ]
                ])(config.type);
  }
}
