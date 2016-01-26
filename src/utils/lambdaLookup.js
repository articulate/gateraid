export default function lambdaLookup(data) {
  const {
    AWS: { Lambda },
    utils: { promisify },
  } = data;
  const lambda = new Lambda();
  const promise = promisify(lambda.getFunction, lambda);

  return function(lambdaName) {
    return promise({FunctionName: lambdaName});
  }
}
