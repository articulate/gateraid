import AWS from 'aws-sdk'
import R from 'ramda'

const {
  merge,
} = R;

export default function prepareAws(data) {
  const { options: { parent: { profile, region } } } = data;
  const credentials = new AWS.SharedIniFileCredentials({ profile });

  AWS.config = new AWS.Config({ credentials, region });

  return merge({ AWS, gateway: new AWS.APIGateway() }, data);
}
