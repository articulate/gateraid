import R from 'ramda'

import promisify from '../../utils/promisify'
import addIntegration from '../integration/addIntegration'

const {
  filter,
  map,
  mapObjIndexed,
  compose,
  keys,
  mergeAll,
  assoc,
  flatten,
  curry,
  always,
  values,
  isEmpty,
  all,
} = R;

const hasSchema = (mimeType) => !!mimeType.schema;
const getSchema = (mimeType) => mimeType.schema;

function formatParam(type, _index, name, details) {
  const { [name]: { required } } = details;

  return assoc(`method.request.${type}.${name}`, required, {});
}

function formatParams(uriParams={}, queryParams={}, headers={}) {
  const curriedFormat = curry(formatParam);

  if(all(isEmpty)([uriParams, queryParams, headers])) { return {}; }

  return compose(mergeAll, flatten, map(values), always([
    mapObjIndexed(curriedFormat('path'), uriParams),
    mapObjIndexed(curriedFormat('querystring'), queryParams),
    mapObjIndexed(curriedFormat('header'), headers),
  ]))();
}

export default function createMethod(method, config) {
  const {
    method: rawMethod,
    body,
    queryParameters,
    headers,
    uriParameters,
  } = method;

  const {
    params = {},
  } = config;

  const httpMethod = rawMethod.toUpperCase();

  return function(data) {
    const { gateway, apiId, rootResourceId, awsConfig: { templateRender } } = data;
    let requestTypes = {};

    // create responses for multiple mime-types
    if(body) {
      requestTypes = compose(R.map(getSchema), filter(hasSchema))(body);
    }

    const args = {
      httpMethod,
      restApiId: apiId,
      resourceId: rootResourceId,
      authorizationType: 'NONE',
      apiKeyRequired: false,
      requestParameters: formatParams(uriParameters, queryParameters, headers),
      requestModels: requestTypes,
    };

    console.log(`Creating method ${httpMethod}`);
    console.log(`METHOD ${httpMethod}`, args);

    return promisify(gateway.putMethod, gateway)(args)
      .then(addIntegration(httpMethod, config)(data))
      .catch(dat => console.log('ERROROROROR', dat))
      .then(_ => data); // restore data chain
      // .then(addIntegrationResponse)
      // .then(addMethodResponse);
  }
}
