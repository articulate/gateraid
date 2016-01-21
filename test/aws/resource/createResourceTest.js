import sinon from 'sinon'
import createResource from '../../../src/aws/resource/createResource'

describe('createResource', () => {
  let stub = sinon.stub();
  stub.yields(null, { id: '456' });

  const data = {
    gateway: { createResource: stub },
    apiId: '123',
    rootResourceId: '234',
  };

  const promise = createResource('hello')(data);

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
});
