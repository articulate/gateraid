import R from 'ramda'
import listModels from './listModels'
import deleteModel from './deleteModel'

const {
  __: _,
  map,
  pluck,
  curry,
} = R;

export default function removeDefaultModels(data) {
  const deleteWithData = curry(deleteModel)(_, data);

  return listModels(data)
    .then(pluck('name'))
    .then(map(deleteWithData))  // delete all models
    .then(Promise.all.bind(Promise))  // synchronize
    .then(_ => data); // restore data chain
}
