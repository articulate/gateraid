import R from 'ramda'

const {
  path,
  merge,
} = R;

export default function proxyFormatter(data) {
  const { resourcePath } = data;
  const {
    'http-method': integrationHttpMethod,
    url: uri,
    } = path(resourcePath, data);

  return function (args) {
    return Promise.resolve(merge(args, {
      type: 'HTTP',
      integrationHttpMethod,
      uri,
    }));
  }
}
