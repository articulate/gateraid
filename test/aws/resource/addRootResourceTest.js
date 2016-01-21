import sinon from 'sinon'
import addRootResource from '../../../src/aws/resource/addRootResource'

describe('addRootResource', () => {
  let stub = sinon.stub();
  stub.yields(null, { items: [
    { id: 'not-right', path: '/other' },
    { id: 'hello-kitty', path: '/' },
  ]});

  const data = {
    gateway: { getResources: stub },
    apiId: '123',
  };

  let promise = addRootResource(data);

  it('gets the root resource from AWS by path', () => {
    expect(stub).to.have.been.calledWith({restApiId: '123'});
  });

  it('adds the root resource ID to the data chain', () => {
    return expect(promise).to.eventually.have.property('rootResourceId', 'hello-kitty');
  });
});
