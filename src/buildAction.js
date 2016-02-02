import R from 'ramda'
import addIntegration from './aws/integration/addIntegration'
import addMethodResponses from './aws/response/addMethodResponses'
import addIntegrationResponses from './aws/response/addIntegrationResponses'

const {
  cond,
  is,
  } = R;

export default function buildAction(method) {
  return function (data) {
    const { lib: { createMethod } } = data;

    return createMethod(method)(data)
      .then(addIntegration(method))
      .then(addMethodResponses(method))
      .then(addIntegrationResponses(method))
      // handle case where method has no integration configuration
      .catch(cond([
                    [ is(Error), (e) => { throw e; } ],
                    [ is(String), (msg) => console.log(msg) ],
                  ]));

  }
}
