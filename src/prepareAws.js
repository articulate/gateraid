import AWS from 'aws-sdk'

const defaultRegion = 'us-east-1';

export default function prepareAws(data) {
  const { options: { parent: { profile } } } = data;

  const credentials = new AWS.SharedIniFileCredentials({ profile });
  AWS.config.update({ credentials, region: defaultRegion });

  return Object.assign({}, data, { AWS, gateway: new AWS.APIGateway() });
}
