import R from 'ramda'
import addMethodResponse from './addMethodResponse'

const {
  mapObjIndexed,
} = R;

export default function addMethodResponses(httpMethod, responses) {
  return function(data) {
    let promise = Promise.resolve(data);

    if(!responses) { return promise; }

    // addMethodResponse calls must be sequential since AWS does not allow
    // concurrent modification of a method response:
    // BadRequestException: Unable to complete operation due to concurrent modification. Please try again later.
    mapObjIndexed((responseDefn, statusCode) => {
      promise = promise
        .then(addMethodResponse(httpMethod, statusCode, responseDefn))
        .then(_ => data);
    }, responses);

    return promise;
  }
}
