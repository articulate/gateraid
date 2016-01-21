import renderTemplates from '../../src/utils/renderTemplates'

describe("renderTemplates", () => {
  let data;

  beforeEach(() => {
    data = {
      awsConfig: { renderTemplate: () => 'Rendered Content' },
      utils: {
        readFile: () => { return Promise.resolve('Hello World'); },
      }
    }
  });

  const templates = {
    form: "./test/fixtures/templates/demo.mustache",
    json: {},
  };

  it('renders each path with the given renderer', () => {
    const result = renderTemplates(templates, data);

    expect(result).to.eventually.eql(JSON.stringify({
      'application/x-www-form-urlencoded': "Rendered Content",
      'application/json': JSON.stringify({}),
    }));
  });

  it('passes thru non-template strings', () => {
    const expected = "{ 'test': 1 }";
    const result = renderTemplates({ json: expected }, data);

    return expect(result).to.eventually.have.property('application/json', expected);
  });

  it('passes thru objects', () => {
    const expected = { test: 1 };
    const result = renderTemplates({ form: expected }, data);

    return expect(result).to.eventually.have
      .property('application/x-www-form-urlencoded', JSON.stringify(expected));
  })
});
