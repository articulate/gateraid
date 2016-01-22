import sinon from 'sinon'
import { assoc } from 'ramda'
import loadSelf from '../../../src/loadSelf'
import createResourcePath from '../../../src/aws/resource/createResourcePath'

describe('createResourcePath', () => {
  let spy, chain;
  let data = loadSelf({ definition: { baseUri: '/test/path/one/two/three' } });

  beforeEach(() => {
    spy = sinon.spy();

    data.spy = spy;
    data.lib = { createResource: (part) => {
      return (data) => {
        data.spy(part);
        return Promise.resolve(assoc('rootResourceId', part, data));
    }}};

    chain = createResourcePath(data);
  });

  it("creates resources for each path segment", () => {
    return chain.then(data => expect(spy.callCount).to.equal(5));
  });

  it('updates the root resource id at the given level', () => {
    return chain.then(data => expect(data.rootResourceId).to.equal('three'));
  });

  context('ordering', () => {
    // split on / then drop the empty "" caused by the leading '/'
    // the function does this internally but we need to mimic
    const parts = data.definition.baseUri.split('/').slice(1);

    parts.forEach((path, index) => {
      it(`creates a resource ${path}`, () => {
        expect(spy.getCall(index).args[0]).to.equal(path);
      });

      it(`chains ${path} on to ${parts[index-1]}`, () => {
        const current = spy.getCall(index);
        const before = spy.getCall(index-1);

        if(before) { expect(current.calledAfter(before)).to.be.true; }
        else { expect(current).to.eql(spy.firstCall); }
      });
    });
  })
});
