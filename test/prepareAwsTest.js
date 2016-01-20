import AWS from 'aws-sdk'
import prepareAws from '../src/prepareAws'

describe("prepareAws", () => {
  const data = {
    options: {
      parent: { profile: 'default', region: 'us-west-1' },
    }
  };

  const client = prepareAws(data);

  it("adds the base AWS client to the data chain", () => {
    expect(client.AWS).to.exist;
  });

  it("configures the AWS client", () => {
    const aws = client.AWS;
    const creds = aws.config.credentials;

    expect(aws.config.region).to.eql('us-west-1');
    expect(creds).to.be.an.instanceOf(AWS.SharedIniFileCredentials);
    expect(creds.profile).to.eql('default');
  });

  it("adds the gateway client to the data chain", () => {
    expect(client.gateway).to.exist;
    expect(client.gateway).to.be.an.instanceOf(AWS.APIGateway);
  });
});
