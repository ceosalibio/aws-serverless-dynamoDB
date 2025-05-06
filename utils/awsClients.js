const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const dynamoDbClient = new DynamoDBClient({});
const secretsClient = new SecretsManagerClient({});
const secretName = "secret_key";

async function getSecretValue() {
  const data = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretName }));
  const secretString = data.SecretString || Buffer.from(data.SecretBinary, 'base64').toString('ascii');
  return JSON.parse(secretString);
}

async function validateApiKey(headers) {
  const secret = await getSecretValue();
  const apiKey = headers['x-api-key'];
  console.log(secret,'secret')
  if (!apiKey || apiKey !== secret.SECRET_KEY) {
    throw new Error("Forbidden: Invalid or missing API key");
  }
}

module.exports = {
  dynamoDbClient,
  getSecretValue,
  validateApiKey
};
