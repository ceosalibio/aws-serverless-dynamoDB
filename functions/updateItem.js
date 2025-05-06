const { UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbClient, validateApiKey } = require("../utils/awsClients");

exports.main = async (event) => {
  try {
    await validateApiKey(event.headers);

    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required path parameter 'id'" }),
      };
    }

    const body = JSON.parse(event.body);
    const tableName = process.env.DYNAMODB_TABLE;

    const params = {
      TableName: tableName,
      Key: { id: { S: id } },
      UpdateExpression: "SET brand = :brand, #t = :type, model = :model, color = :color, updated_at = :updated_at",
      ExpressionAttributeValues: {
        ":brand": { S: body.brand },
        ":type": { S: body.type },
        ":model": { S: body.model },
        ":color": { S: body.color },
        ":updated_at": { S: new Date().toISOString() },
      },
      ExpressionAttributeNames: {
        "#t": "type" // Avoid reserved keyword
      },
      ReturnValues: "ALL_NEW"
    };

    const result = await dynamoDbClient.send(new UpdateItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item updated", data: result.Attributes }),
    };
  } catch (error) {
    console.error("Error updating item:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating item", error: error.message }),
    };
  }
};
