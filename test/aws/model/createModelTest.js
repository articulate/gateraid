import fs from 'fs'
import sinon from 'sinon'
import createModel from '../../../src/aws/model/createModel'

describe("createModel", () => {
  let stub = sinon.stub();
  stub.yields(null, 'success');

  const rawSchema = fs.readFileSync('./test/fixtures/schemas/requests/session.json').toString();
  const schema = JSON.parse(rawSchema);

  const data = {
    gateway: {createModel: stub},
    apiId: '123',
  };

  it('calls out to AWS SDK createModel with schema definition', () => {
    const promise = createModel('Session', rawSchema)(data);

    return expect(promise).to.eventually.be.fulfilled
      .then(() => {
        expect(stub).to.have.been.calledWith({
          name: 'Session',
          schema: rawSchema,
          restApiId: '123',
          description: schema.title,
          contentType: 'application/json',
        });
      });
  });
});
