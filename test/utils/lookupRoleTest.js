import sinon from 'sinon'
import lookupRole from '../../src/utils/lookupRole'
import promisify from '../../src/utils/promisify'

describe("lookupRole", () => {
  const stub = sinon.stub();
  let promise;

  const data = {
    utils: { promisify },
    AWS: { IAM: () => ({getRole: stub}) },
  };

  beforeEach(() => {
    promise = lookupRole(data)('my-rolly-o');
  });

  context('success', () => {
    beforeEach(() => {
      stub.yields(null, 'role details')
    });

    it('calls the SDK with the role name', () => {
      expect(stub).to.have.been.calledWith({RoleName: 'my-rolly-o'});
    });

    it('finds lambda details via the SDK', () => {
      return expect(promise).to.eventually.become('role details');
    });
  });

  context('failure', () => {
    beforeEach(() => {
      stub.yields('error', null);
    });

    it('rejects promise', () => {
      expect(promise).to.be.rejected;
    });
  });

});
