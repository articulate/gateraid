import sinon from 'sinon'
import listModels from '../../../src/aws/model/listModels'

describe('listModels', () => {
  const models = [1,2,3];

  let stub = sinon.stub();
  stub.withArgs({ restApiId: '123' })
    .yields(null, { items: [1,2,3] });

  const data = {
    gateway: { getModels: stub },
    apiId: '123',
  };

  it('calls out to AWS getModels method and returns models', () => {
    return expect(listModels(data)).to.eventually.eql(models);
  });
});
