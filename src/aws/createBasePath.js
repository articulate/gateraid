import urlParser from 'url'

export default function createBasePath(data) {
  const { gateway, apiId, definition: { baseUri }} = data;
  const { path, host } = urlParser.parse(baseUri);

  return new Promise((resolve, reject) => {
    const args = {
      domainName: host,
      restApiId: apiId,
      basePath: path,
    };

    gateway.createBasePathMapping(args, (err, resp) => {
      if(err) { reject(err); }
      else { resolve(data); }
    });
  });
}
