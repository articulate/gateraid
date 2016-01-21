import fs from 'fs'
import sinon from 'sinon'
import createModel from '../../../src/aws/model/createModel'
import fixture from '../../fixtures/schemas/requests/session.json';

describe("createModel", () => {
  const stub = sinon.stub();
  let rawSchema;
  let data;

  beforeEach(() => {
    rawSchema = JSON.stringify(fixture);

    data = {
      gateway: {createModel: stub},
      apiId: '123',
    };
  });

  context("success", () => {
    beforeEach(() => {
      stub.yields(null, 'success');
    });

    it('calls out to AWS SDK createModel with schema definition', () => {
      createModel('Session', rawSchema)(data);

      expect(stub).to.have.been.calledWith({
        name: 'Session',
        schema: rawSchema,
        restApiId: '123',
        description: fixture.title,
        contentType: 'application/json',
      });
    });
  });

  context("failures", () => {
    beforeEach(() => {
      stub.yields('error', null);
    });

    it('rejects if error is returned', () => {
      expect(createModel('Session', rawSchema)(data)).to.be.rejected;
    });
  });
});
