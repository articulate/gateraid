import sinon from 'sinon'
import R from 'ramda'
import loadSelf from '../../../src/loadSelf'
import addIntegrationResponses from '../../../src/aws/response/addIntegrationResponses'

import methodFixture from '../../fixtures/methodDefn.json'

const {
  keys,
  merge,
  } = R;

describe('addIntegrationResponses', () => {
  let chain;
  const data = loadSelf();

  beforeEach(() => {
    data.spy = sinon.stub();

    data.lib = merge(data.lib, {
      addIntegrationResponse: (method, code) => {
        return (data) => {
          data.spy(method, code);
          return Promise.resolve(data);
        }
      }
    });

    chain = addIntegrationResponses(methodFixture)(data);
  });

  it("creates response for each code", () => {
    return chain.then(({ spy }) => expect(spy.callCount).to.equal(2));
  });

  it('returns the unmodified data chain', () => {
    return expect(chain).to.eventually.become(data);
  });

  context('sequentially', () => {
    const patterns = keys(methodFixture.responses);

    patterns.forEach((pattern, index) => {
      it(`adds a response method for ${pattern} code`, () => {
        expect(data.spy.getCall(index).args).to.eql([ methodFixture, pattern ]);
      });
    });
  });
});
