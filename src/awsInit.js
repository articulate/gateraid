import AWS from 'aws-sdk'

// TODO: use ~/.aws/config prefs
function defaultRegion() {
  return 'us-east-1';
}

export default function awsInit(profile) {
  const credentials = new AWS.SharedIniFileCredentials({profile});
  AWS.config.update({ credentials, region: defaultRegion() });

  return AWS;
}
