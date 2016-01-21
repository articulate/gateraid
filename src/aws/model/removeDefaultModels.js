import R from 'ramda'
import listModels from './listModels'
import deleteModel from './deleteModel'

const {
  map,
  pluck,
} = R;

export default function removeDefaultModels(data) {
  const { utils: { log }} = data;

  return listModels(data)
    .then(pluck('name'))
    .then(map(deleteModel))  // create delete functions for each name
    .then(map(fn => fn(data))) // apply data to each function
    .then(Promise.all.bind(Promise))  // synchronize
    .then(_ => data); // restore data chain
}
