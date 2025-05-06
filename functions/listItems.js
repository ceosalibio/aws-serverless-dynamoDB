const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbClient, validateApiKey } = require("../utils/awsClients");

exports.main = async (event) => {
  try {
    await validateApiKey(event.headers);

    const data = await dynamoDbClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items || []),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
