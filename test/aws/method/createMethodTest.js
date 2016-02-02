import sinon from 'sinon'
import loadSelf from '../../../src/loadSelf'
import createMethod from '../../../src/aws/method/createMethod'
import methodFixture from '../../fixtures/methodDefn.json'

describe('createMethod', () => {
  let promise, data;
  const stub = sinon.stub();

  beforeEach(() => {
    data = loadSelf({
      gateway: { putMethod: stub },
      apiId: "123",
      rootResourceId: '456',
    });
  });

  context("successful calls", () => {
    beforeEach(() => {
      stub.yields(null, 'success');

      promise = createMethod(methodFixture)(data);
    });

    it('creates a method via the SDK', () => {
      expect(stub).to.have.been.calledWith({
        restApiId: '123',
        resourceId: '456',
        httpMethod: 'GET',
        authorizationType: "NONE",
        requestParameters: {
          'method.request.header.Accept-Language': true,
          'method.request.querystring._heyo_session_id': true,
        },
        requestModels: {},
      });
    });

    it('returns the unmodified data chain', () => {
      return expect(promise).to.eventually.equal(data);
    });
  });

  context('sdk failure', () => {
    beforeEach(() => {
      stub.yields('error', null);

      promise = createMethod(methodFixture)(data);
    });

    it('rejects if a failure occurs', () => {
      return expect(promise).to.eventually.be.rejected;
    });
  })

});
