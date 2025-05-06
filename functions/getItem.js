const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbClient, validateApiKey } = require("../utils/awsClients");
const { unmarshall } = require("@aws-sdk/util-dynamodb"); //use to make javascrpit object format

exports.main = async (event) => {
  try {
    await validateApiKey(event.headers);
    const { id } = event.pathParameters;

    const data = await dynamoDbClient.send(new GetItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id: { S: id } }
    }));

    // Check if item exists
    if (!data.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Item not found" }),
        };
    }
    
    // Convert DynamoDB format to plain JS object
    const item = unmarshall(data.Item);

    

    return {
      statusCode: 200,
      body: JSON.stringify(item || {}),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
