import R from 'ramda'

import addIntegration from '../integration/addIntegration'
import addMethodResponses from '../response/addMethodResponses'
import addIntegrationResponses from '../response/addIntegrationResponses'

const {
  map,
  mapObjIndexed,
  compose,
  mergeAll,
  assoc,
  flatten,
  curry,
  always,
  values,
  isEmpty,
  all,
} = R;

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
    responses,
  } = method;

  const {
    responses: responsesConfig = {},
  } = config;

  const httpMethod = rawMethod.toUpperCase();

  return function(data) {
    const {
      utils: { log, promisify, formatSchemas },
      gateway,
      apiId: restApiId,
      rootResourceId: resourceId
    } = data;
    let requestTypes = {};

    // create responses for multiple mime-types
    if(body) { requestTypes = formatSchemas(body); }

    const args = {
      httpMethod,
      restApiId,
      resourceId,
      authorizationType: 'NONE',
      apiKeyRequired: false,
      requestParameters: formatParams(uriParameters, queryParameters, headers),
      requestModels: requestTypes,
    };

    return promisify(gateway.putMethod, gateway)(args)
      .then(_ => data)
      .then(log(`Created method ${httpMethod} on ${resourceId}`))
      .then(addIntegration(httpMethod, config))
      .then(addMethodResponses(httpMethod, responses))
      .then(addIntegrationResponses(httpMethod, responsesConfig));
  }
}
