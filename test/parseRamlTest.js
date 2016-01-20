import parseRaml from '../src/parseRaml'

describe('ramlParser', () => {
  let parser = parseRaml('./test/fixtures/test.raml');

  it("adds parsed definition to data object", () => {
    return expect(parser({})).to.eventually.have.deep.property('definition.title', 'Test API');
  });
});
