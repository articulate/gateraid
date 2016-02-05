import open from 'open'

const rootUri = 'https://console.aws.amazon.com/apigateway/home#/apis/';

export default function openAWSConsole(data) {
  const { config, options: { id } } = data;
  const apiId = id || config.get('api.id');

  if(!apiId) { console.log('API ID not found or provided. Please use --id flag to specify.'); }

  open(rootUri + `${apiId}/resources`);
}
