import R from 'ramda'

const {
  compose,
  defaultTo,
  filter,
  is,
  pluck,
  prop,
} = R;

const getSchema = pluck('schema');
const hasSchema = compose(is(String), prop('schema'));

// try to ensure we always get an object back
const fetchSchemas = compose(getSchema, filter(hasSchema), defaultTo({}));

export default fetchSchemas;
