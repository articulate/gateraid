import R from 'ramda'

const {
  compose,
  filter,
  is,
  pluck,
  prop,
} = R;

const getSchema = pluck('schema');
const hasSchema = compose(is(String), prop('schema'));
const formatSchemas = compose(getSchema, filter(hasSchema));

export default formatSchemas;
