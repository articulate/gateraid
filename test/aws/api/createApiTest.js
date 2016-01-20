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

  const api = createApi(data);

  it("creates the API via the SDK", () => {
    expect(stub).to.have.been.calledWith({ name: 'Big API', description: "New API Thing Here" });
    return expect(api).to.eventually.have.property('apiId', '123');
  });
});
