const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbClient, validateApiKey } = require("../utils/awsClients");
const { unmarshall } = require("@aws-sdk/util-dynamodb"); //use to make javascrpit object format

exports.main = async (event) => {
  try {
    await validateApiKey(event.headers);

    const data = await dynamoDbClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE
    }));
    const items = data.Items.map(item => unmarshall(item));
    return {
      statusCode: 200,
      body: JSON.stringify((items || {})),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
