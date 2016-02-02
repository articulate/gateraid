export default function addIntegration(method) {
  let { method: httpMethod } = method;
  httpMethod = httpMethod.toUpperCase();

  return function (data) {
    const {
      utils: { log, promisify },
      lib: { formatIntegrationRequest },
      rootResourceId: resourceId,
      gateway,
    } = data;

    // formatIntegrationRequest will reject if integration config is not present
    // need to catch this a level above
    return formatIntegrationRequest(method)(data)
      .then(promisify(gateway.putIntegration, gateway))
      .then(log(`Created integration request for ${httpMethod} on ${resourceId}`))
      .then(_ => data);
  }
}
