const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbClient, validateApiKey } = require("../utils/awsClients");

exports.main = async (event) => {
  try {
    await validateApiKey(event.headers);
    const { id } = event.pathParameters;

    await dynamoDbClient.send(new DeleteItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id: { S: id } }
    }));

    return { statusCode: 200, body: JSON.stringify({ message: "Item deleted" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
