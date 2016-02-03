import R from 'ramda'
import lambdaFormatter from './lambdaFormatter'
import proxyFormatter from './proxyFormatter'

const {
  cond,
  equals,
  always,
  } = R;

const requestTypeFormatter = cond([
                                    [ equals('lambda'), always(lambdaFormatter) ],
                                    [ equals('http-proxy'), always(proxyFormatter) ]
                                  ]);

export default requestTypeFormatter;
