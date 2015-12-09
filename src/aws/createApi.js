export default function createApi(data) {
  const { gateway, options: { name }, definition } = data;

  return new Promise((resolve, reject) => {
    gateway.createRestApi({ name, description: definition.title }, (err, resp) => {
      if(err) { reject(err); }
      else {
        const { id } = resp;
        console.log(`ID: ${id}`);

        resolve(Object.assign({}, data, { apiId: id }));
      }
    });
  });
}
