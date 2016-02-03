import R from 'ramda'
import sinon from 'sinon'
import loadSelf from '../../../src/loadSelf'
import formatIntegrationRequest from '../../../src/aws/integration/formatIntegrationRequest'

import lambdaFixture from '../../fixtures/lambdaConfig.json'
import httpFixture from '../../fixtures/httpConfig.json'

const {
  merge,
  lensProp,
  compose,
  } = R;

describe("formatIntegrationRequest", () => {
  let promise;
  let config;
  let data = loadSelf({
                        resourcePath: [ 'resourceConfig' ],
                        apiId: 'awk',
                        rootResourceId: 'ward',
                      });

  context('for lambda', () => {
    let lambdaStub = sinon.stub();
    let iamStub = sinon.stub();

    beforeEach(() => {
      lambdaStub.returns(Promise.resolve({ Configuration: { FunctionArn: 'fnarn' } }));
      iamStub.returns(Promise.resolve({ Role: { Arn: 'longstringofcharacters' } }));

      data = merge(data, { resourceConfig: lambdaFixture });
      data.utils = merge(data.utils,
                         {
                           lambdaLookup: lambdaStub,
                           lookupRole: iamStub
                         });

      promise = formatIntegrationRequest({ method: 'post' })(data);
    });

    it('adds params for a lambda integration', () => {
      return expect(promise).to.eventually.become({
                                                    httpMethod: 'POST',
                                                    credentials: 'longstringofcharacters',
                                                    resourceId: 'ward',
                                                    restApiId: 'awk',
                                                    type: 'AWS',
                                                    uri: 'arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/fnarn',
                                                    requestParameters: lambdaFixture.params,
                                                    integrationHttpMethod: 'POST',
                                                    requestTemplates: {},
                                                  });
    });

    it('requests role from IAM SDK', () => {
      expect(iamStub).to.have.been.calledWith('ExecLambdaRole');
    });

    it('requests lambda from lambda SDK', () => {
      expect(lambdaStub).to.have.been.calledWith('my-lambda');
    });
  });

  context('for http proxy', () => {
    beforeEach(() => {
      data = merge(data, { resourceConfig: httpFixture });
      promise = formatIntegrationRequest({ method: "get" })(data);
    });

    it('adds params for an http proxy integration', () => {
      return expect(promise).to.eventually.become({
                                                    httpMethod: httpFixture[ 'http-method' ],
                                                    resourceId: 'ward',
                                                    restApiId: 'awk',
                                                    type: 'HTTP',
                                                    requestParameters: httpFixture.params,
                                                    uri: httpFixture.url,
                                                    integrationHttpMethod: httpFixture[ 'http-method' ],
                                                    requestTemplates: {
                                                      "application/json": "{\n  \"client_id\": \"{{clientId}}\",\n  \"client_secret\": \"{{clientSecret}}\",\n  \"raw_string\": \"$input.path('$')\"\n}\n",
                                                      "application/x-www-form-urlencoded": "{\n  \"client_id\": \"{{clientId}}\",\n  \"client_secret\": \"{{clientSecret}}\",\n  \"raw_string\": \"$input.path('$')\"\n}\n",
                                                    },
                                                  });
    });
  });

  context('without config', () => {
    beforeEach(() => {
      data = merge(data, { resourceLens: compose(data.resourceLens, lensProp('nope')) });
      promise = formatIntegrationRequest({ method: "put" })(data);
    });

    it('rejects to short integration chain', () => {
      expect(promise).to.be.rejectedWith('No configuration for PUT on ward');
    });
  });
});
