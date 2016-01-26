import sinon from 'sinon'
import lambdaLookup from '../../src/utils/lambdaLookup'
import loadSelf from '../../src/loadSelf'

describe("lambdaLookup", () => {
  const stub = sinon.stub();
  let promise;

  const data = loadSelf({
    AWS: { Lambda: () => ({ getFunction: stub }) },
  });

  beforeEach(() => {
    promise = lambdaLookup(data)('my-lambda');
  });

  context('success', () => {
    beforeEach(() => {
      stub.yields(null, 'lambda details')
    });

    it('calls the SDK with the function name', () => {
      expect(stub).to.have.been.calledWith({FunctionName: 'my-lambda'});
    });

    it('finds lambda details via the SDK', () => {
      return expect(promise).to.eventually.become('lambda details');
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
