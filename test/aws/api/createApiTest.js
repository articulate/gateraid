import { assoc } from 'ramda'
import sinon from 'sinon'
import createApi from '../../../src/aws/api/createApi'

describe("createApi", () => {
  let stub = sinon.stub();
  stub.yields(null, { id: '123' });

  const gateway = { createRestApi: stub };

  const data = {
    gateway,
    options: { name: 'Big API' },
    definition: { title: "New API Thing Here" },
  };

  const promise = createApi(data);

  it("creates the API via the SDK", () => {
    expect(stub).to.have.been.calledWith({ name: 'Big API', description: "New API Thing Here" });
  });

  it('restores the data chain with new api ID', () => {
    return promise.then(chain => {
      expect(chain).to.eql(assoc('apiId', '123', data));
    });
  })
});
