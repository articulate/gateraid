import sinon from 'sinon'
import createResource from '../../../src/aws/resource/createResource'

describe('createResource', () => {
  const stub = sinon.stub();
  let promise;

  const data = {
    gateway: { createResource: stub },
    apiId: '123',
    rootResourceId: '234',
    resourceConfig: { endpoints: { hello: 'whatup' } },
  };

  context('successfully', () => {
    beforeEach(() => {
      stub.yields(null, { id: '456' });

      promise = createResource('hello')(data);
    });

    it('drops extraneous slashes if present', () => {
      createResource('/nope/')(data);

      expect(stub).to.have.been.calledWith({
                                             pathPart: 'nope',
                                             parentId: '234',
                                             restApiId: '123',
                                           });
    })

    it('creates the resource via the SDK', () => {
      expect(stub).to.have.been.calledWith({
                                             pathPart: 'hello',
                                             parentId: '234',
                                             restApiId: '123',
                                           });
    });

    it('updates the root resource ID', () => {
      return expect(promise).to.eventually.have.property('rootResourceId', '456');
    });

    it('adds current resource config to data chain', () => {
      return expect(promise).to.eventually.have.deep.property('resourcePath[1]', 'hello');
    });

    it('does not error if no config is present', () => {
      promise = createResource('no-failure')(data);
      return expect(promise).to.eventually.have.deep.property('resourcePath[1]', 'no-failure');
    });
  });

  context('on SDK errors', () => {
    beforeEach(() => {
      stub.yields('help', null);

      promise = createResource('can-t-get-no-satisfaction')(data);
    });

    it('rejects', () => {
      return expect(promise).to.eventually.be.rejected;
    });
  });
});
