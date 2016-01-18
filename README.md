# gateraid

Gateraid is a small toolchain for publishing and managing [API Gateway][1] interfaces as defined by [RAML][2] API definitions. The goal is simple generation of API Gateways using static configuration for easy maintainance and reproducibility of AWS infrastructure and to simplify the configuration format for easier human readability and creation.

We use the RAML spec currently (v0.8) as it is defined by the [RAML spec](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md).

## Install

`npm install gateraid -g`

## The `-h`

```
  Usage: gateraid [options] <NAME>


  Commands:

    create [options] <filename>  Create new API Gateway from a RAML file definition.
    rm [options]                 Destroy an API
    config [action] [args...]    Manage config settings

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -p, --profile [profile]  Select AWS credential profile to use [default].
```

## Example

Here's a very small API defining a session authorization endpoint:

```raml
#%RAML 0.8

title: Authentication API
version: v1
baseUri: https://api.example.com/v1/
mediaType: application/json
schemas:
  - SessionRequest: !include schemas/requests/session.json
  - Session: !include schemas/responses/session.json

/session:
  get:
    description:
      Retreives login session from _heyo_session_id
    headers:
      Accept-Language:
        description: The user's language.
        type: string
        required: true
        example: 'en-US'
    queryParameters:
      _heyo_session_id:
        description: Login session id.
        type: string
        required: true
    responses:
      200:
        body:
          application/json: {}
      404:
        body:
          application/json: {}

  post:
    description:
      User Login.
    body:
      application/x-www-form-urlencoded:
        formParameters:
          email:
            description: Email Address.
            type: string
          password:
            description: Password.
            type: string
      application/json:
        schema: SessionRequest
    responses:
      200:
        body:
          application/json:
            schema: Session
      401:
        body:
          application/json: {}
```

Optionally, Amazon requires additional information to build out an end-to-end integration with other AWS or external services, such as Lambda or acting as HTTP proxies. This secondary configuration specifies the AWS specific portions of the API. The currently supported integration types are:

- Lambda
- HTTP Proxy

An example config might look like the following:

```yaml
env: .env
endpoints:
  /session:
    get:
      type: http-proxy
      url: https://example.com/newToken
      http-method: GET
      params:
        integration.request.header.Authorization: method.request.querystring.session_id
      requests:
        form: templates/session/request/get.mustache
      responses:
        default:
          status-code: 200
          templates:
            json: templates/session/response/get.mustache
    post:
      type: lambda
      lambda-name: my-login-lambda
      iam-role: ExecLambdaRole
      requests:
        form: templates/session/request/post.mustache
        json: templates/session/request/post.mustache
      responses:
        'Unauthorized: Invalid .*':
          status-code: 400
          templates:
            json: {}
        default:
          status-code: 200
```

You will note in the config, there is a `.env` file listed. This will provide any secrets that you want to interpolate into the response folders, such as API keys or secret tokens. It should look like pairs of `KEY=VALUE`, one per line (a convention for `.env` files generally).

The mustache files can be anything you want to have as part of the response. For example, if you have a `.env` file similar to:

```
clientId=xxx
clientSecret=yyy
secretToken=zzz
```

Your response file might look like the following:

```mustache
{
  "client_id": "{{clientId}}",
  "client_secret": "{{clientSecret}}",
  "code": "$input.params('confirmationcode')",
  "token": "{{secretToken}}",
  "raw_string": "$input.path('$')"
}
```

Which when rendered as part of the request/response template in the API Gateway, will look like the following JSON:

```json
{
  "client_id": "xxx",
  "client_secret": "yyy",
  "code": "$input.params('confirmationcode')",
  "token": "zzz",
  "raw_string": "$input.path('$')"
}
```

[1]: https://aws.amazon.com/api-gateway/
[2]: http://raml.org/
