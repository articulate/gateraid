import { merge } from 'ramda'
import sinon from 'sinon'
import loadSelf from '../../../src/loadSelf'
import addIntegration from '../../../src/aws/integration/addIntegration'

import methodFixture from '../../fixtures/methodDefn.json'
import configFixture from '../../fixtures/httpConfig.json'


describe('addIntegration', () => {
  const apiStub = sinon.stub();
  const requestStub = sinon.stub();
  let data, promise;

  beforeEach(() => {
    requestStub.returns(Promise.resolve('whatever I want'));

    data = loadSelf({
                      gateway: { putIntegration: apiStub },
                      rootResourceId: 'awn',
                    });
    data.lib = merge(data.lib, { formatIntegrationRequest: () => requestStub });
  });

  context('successfully', () => {
    beforeEach(() => {
      apiStub.yields(null, 'success!')
      promise = addIntegration(methodFixture)(data);
    });

    it('gets arguments from argument formatter helper', () => {
      expect(requestStub).to.have.been.calledWith(data);
    });

    it('creates an integration via the SDK', () => {
      expect(apiStub).to.have.been.calledWith('whatever I want');
    });

    it('returns the unmodified data chain', () => {
      return expect(promise).to.eventually.become(data);
    });
  });


  context('when SDK call errors', () => {
    beforeEach(() => {
      apiStub.yields('error', null);
      promise = addIntegration(methodFixture)(data);
    });

    it('rejects', () => {
      return expect(promise).to.eventually.be.rejected;
    });
  })
});
