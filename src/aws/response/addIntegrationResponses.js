import R from 'ramda'

const {
  pipeP,
  map,
  keys,
  curry,
path,
} = R;

export default function addIntegrationResponses(method) {
  return function(data) {
    const {
      lib: { addIntegrationResponse },
      resourcePath,
    } = data;

    const { responses } = path(resourcePath, data);
    if(!responses) { return Promise.resolve(data); }

    const curriedFn = curry(addIntegrationResponse)(method);

    return pipeP(...map(curriedFn, keys(responses)))(data);
  }
}
