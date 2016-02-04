import { dissocPath } from 'ramda'
import sinon from 'sinon'
import loadSelf from '../../../src/loadSelf'
import addIntegrationResponse from '../../../src/aws/response/addIntegrationResponse'

import methodFixture from '../../fixtures/methodDefn.json'
import httpFixture from '../../fixtures/httpConfig.json'

describe("addIntegrationResponse", () => {
  const apiStub = sinon.stub();
  let promise;

  let data = loadSelf({
                          apiId: 'hello',
                          rootResourceId: 'world',
                          gateway: { putIntegrationResponse: apiStub },
                          resourceConfig: httpFixture,
                          resourcePath: [ 'resourceConfig' ],
                        });

  beforeEach(() => {
    promise = addIntegrationResponse(methodFixture, 'default')(data);
  });

  context('successfully', () => {
    beforeEach(() => {
      apiStub.yields(null, 'OH YEAH');
    });

    afterEach(() => {
      apiStub.reset();
    });

    it('creates an integration response via the SDK', () => {
      return promise.then(_ => {
        expect(apiStub).to.have.been.calledWith({
                                                  restApiId: 'hello',
                                                  resourceId: 'world',
                                                  httpMethod: 'GET',
                                                  statusCode: '200',
                                                  selectionPattern: 'default',
                                                  responseParameters: {},
                                                  responseTemplates: {
                                                    "application/json": "{\n  \"client_id\": \"{{clientId}}\",\n  \"client_secret\": \"{{clientSecret}}\",\n  \"raw_string\": \"$input.path('$')\"\n}\n"
                                                  },
                                                });
      });
    });

    it('returns the unmodified data chain', () => {
      return expect(promise).to.eventually.become(data);
    });

    context('with no config', () => {
      beforeEach(() => {
        data = dissocPath(['resourceConfig', 'responses'], data);
      });

      it('does nothing if no response config given', () => {
        expect(apiStub).not.to.have.been.called;
      });

      it('returns unmodified data chain', () => {
        return expect(promise).to.eventually.become(data);
      });
    });
  });

  context('failure', () => {
    beforeEach(() => {
      apiStub.yields('OH NO', null);
    });

    it('rejects', () => {
      expect(promise).to.be.rejected;
    });
  });
});
