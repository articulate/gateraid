import fetchSchemas from '../../src/utils/fetchSchemas'

describe('fetchSchemas', () => {

  context('with schemas present', () => {
    const raw = {
      "application/json": { schema: 'Session' },
      "application/x-www-form-encoded": { schema: 'SessionForm' },
    };

    it('generates a map of schemas keyed by associated mime type', () => {
      expect(fetchSchemas(raw)).to.eql({
        "application/json": 'Session',
        "application/x-www-form-encoded": 'SessionForm'
      });
    });
  });

  context('with empty schemas', () => {
    const raw = {
      "application/json": {}
    };

    it('returns an empty object', () => {
      expect(fetchSchemas(raw)).to.eql({});
    });
  });

  context('with no schemas', () => {
    const raw = {};

    it('returns an empty object', () => {
      expect(fetchSchemas(raw)).to.eql({});
    });
  });

  context('with undefined', () => {
    it('returns an empty object', () => {
      expect(fetchSchemas(undefined)).to.eql({});
    });
  })
});
