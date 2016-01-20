import R from 'ramda'

const {
  merge
} = R;

export default function createApi(data) {
  const {
    gateway,
    options: { name },
    definition: { title },
  } = data;

  return new Promise((resolve, reject) => {
    gateway.createRestApi({ name, description: title }, (err, resp) => {
      if(err) { reject(err); }
      else {
        const { id } = resp;
        console.log(`Created API with ID: ${id}`);

        resolve(merge({ apiId: id }, data));
      }
    });
  });
}
