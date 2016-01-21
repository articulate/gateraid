import sinon from 'sinon'
import loadSelf from '../../../src/loadSelf'
import deleteModel from '../../../src/aws/model/deleteModel'

describe("deleteModel", () => {
  let stub = sinon.stub();
  stub.yields(null, 'balleted');

  const data = loadSelf({
    gateway: { deleteModel: stub },
    apiId: '123',
  });

  it('calls out to AWS SDK to delete models by name', () => {
    const result = deleteModel('FooBard')(data);

    return expect(result).to.eventually.eql('balleted');
  });
});
