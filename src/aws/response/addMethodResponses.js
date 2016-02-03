import R from 'ramda'

const {
  pipeP,
  keys,
  map,
  curry,
} = R;

export default function addMethodResponses(method) {
  const { responses } = method;

  return function(data) {
    const { lib: { addMethodResponse } } = data;

    if(!responses) { return Promise.resolve(data); }

    const codes = keys(responses);
    const curriedApi = curry(addMethodResponse)(method);

    // addMethodResponse calls must be sequential since AWS does not allow
    // concurrent modification of a method response:
    // BadRequestException: Unable to complete operation due to concurrent modification. Please try again later.
    return pipeP(...map(curriedApi, codes))(data);
  }
}
