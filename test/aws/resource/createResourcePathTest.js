import sinon from 'sinon'
import createResourcePath from '../../../src/aws/resource/createResourcePath'

describe('createResourcePath', () => {
  let spy;
  let data = { definition: { baseUri: '/test/path/one/two/three' } };

  beforeEach(() => {
    spy = sinon.spy();
    data.lib = { createResource: spy };

    createResourcePath(data);
  });

  it("creates resources for each path segment", () => {
    expect(spy.callCount).to.equal(5);
  });

  context('ordering', () => {
    // split on / then drop the empty "" caused by the leading '/'
    // the function does this internally but we need to mimic
    const parts = data.definition.baseUri.split('/').slice(1);

    parts.forEach((path, index) => {
      it(`creates a resource ${path}`, () => {
        expect(spy.getCall(index).args[0]).to.equal(path);
      })

      it(`chains ${path} to ${parts[index-1]}`, () => {
        const current = spy.getCall(index);
        const before = spy.getCall(index-1);

        if(before) { expect(current.calledBefore(before)).to.beTrue; }
        else { expect(current).to.eql(spy.firstCall); }
      });
    });
  })

});
