const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbClient, validateApiKey } = require("../utils/awsClients");

exports.main = async (event) => {
  try {
    await validateApiKey(event.headers);
    const { id } = event.pathParameters;

    const data = await dynamoDbClient.send(new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id: { S: id } }
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item || {}),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
