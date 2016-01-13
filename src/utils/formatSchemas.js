import R from 'ramda'

const {
  map,
  filter,
  compose,
} = R;

const hasSchema = (mimeType) => !!mimeType.schema;
const getSchema = (mimeType) => mimeType.schema;
const formatSchemas = compose(map(getSchema), filter(hasSchema));

export default formatSchemas;
