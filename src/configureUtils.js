import { merge, assoc } from 'ramda'
import lookupRole from './utils/lookupRole'
import lambdaLookup from './utils/lambdaLookup'

export default function configureUtils(data) {
  const { utils } = data;
  const withConfigured = merge(utils, {
    lookupRole: lookupRole(data),
    lambdaLookup: lambdaLookup(data),
  });

  return assoc('utils', withConfigured, data);
}
