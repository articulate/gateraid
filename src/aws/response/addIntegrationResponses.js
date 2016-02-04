import R from 'ramda'

const {
  pipeP,
  map,
  keys,
  curry,
} = R;

export default function addIntegrationResponses(method) {
  const { responses } = method;

  return function(data) {
    if(!responses) { return Promise.resolve(data); }

    const { lib: { addIntegrationResponse } } = data;
    const curriedFn = curry(addIntegrationResponse)(method);

    return pipeP(...map(curriedFn, keys(responses)))(data);
  }
}
