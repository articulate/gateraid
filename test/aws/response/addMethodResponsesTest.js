import sinon from 'sinon'
import R from 'ramda'
import loadSelf from '../../../src/loadSelf'
import addMethodResponses from '../../../src/aws/response/addMethodResponses'

import methodFixture from '../../fixtures/methodDefn.json'

const {
  keys,
  merge,
} = R;

describe('addMethodResponses', () => {
  let chain;
  const data = loadSelf();

  beforeEach(() => {
    data.spy = sinon.stub();

    data.lib = merge(data.lib, {
      addMethodResponse: (method, code) => {
        return (data) => {
          data.spy(method, code);
          return Promise.resolve(data);
        }
      }
    });

    chain = addMethodResponses(methodFixture)(data);
  });

  it("creates response for each code", () => {
    return chain.then(({ spy }) => expect(spy.callCount).to.equal(2));
  });

  it('returns the unmodified data chain', () => {
    return expect(chain).to.eventually.become(data);
  });

  context('sequentially', () => {
    const codes = keys(methodFixture.responses);

    codes.forEach((code, index) => {
      it(`adds a response method for ${code} code`, () => {
        expect(data.spy.getCall(index).args).to.eql([ methodFixture, code ]);
      });
    });
  });
});
