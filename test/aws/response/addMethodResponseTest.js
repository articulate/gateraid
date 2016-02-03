import sinon from 'sinon'
import loadSelf from '../../../src/loadSelf'
import addMethodResponse from '../../../src/aws/response/addMethodResponse'

import methodFixture from '../../fixtures/methodDefn.json'
import httpFixture from '../../fixtures/httpConfig.json'

describe("addMethodResponse", () => {
  const apiStub = sinon.stub();
  let promise;

  const data = loadSelf({
                          gateway: { putMethodResponse: apiStub },
                          resourceConfig: httpFixture,
                          resourcePath: [ 'resourceConfig' ],
                          apiId: '123',
                          rootResourceId: '999',
                        });


  beforeEach(() => {
    promise = addMethodResponse(methodFixture, 200)(data);
  });

  context('successfully', () => {
    beforeEach(() => {
      apiStub.yields(null, 'winning!')
    });

    it('should create a method response via the SDK', () => {
      expect(apiStub).to.be.calledWith({
                                         restApiId: '123',
                                         resourceId: '999',
                                         httpMethod: 'GET',
                                         statusCode: 200,
                                         responseModels: {},
                                         responseParameters: {},
                                       });
    });

    it('should return original data chain', () => {
      return expect(promise).to.eventually.become(data);
    });
  });

  context('failure', () => {
    beforeEach(() => {
      apiStub.yields('nope', null);
    });

    it('should reject', () => {
      expect(promise).to.be.rejected;
    });
  });

});
