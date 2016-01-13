import R from 'ramda'
import addIntegrationResponse from './addIntegrationResponse'

const {
  mapObjIndexed,
} = R;

export default function addIntegrationResponses(httpMethod, responses) {
  return function(data) {
    let promise = Promise.resolve(data);

    mapObjIndexed((defn, pattern) =>
      promise = promise.then(addIntegrationResponse(httpMethod, pattern, defn, data))
      , responses);

    return promise.then(_ => data);
  }
}
