const { PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { dynamoDbClient, validateApiKey } = require("../utils/awsClients");
const { v4: uuidv4 } = require("uuid");
const { unmarshall } = require("@aws-sdk/util-dynamodb"); //use to make javascrpit object format

exports.main = async (event) => {
  try {
    await validateApiKey(event.headers);

    const body = JSON.parse(event.body);
    const val = {
      id: { S: uuidv4() },
      brand: { S: body.brand },
      type: { S: body.type },
      model: { S: body.model },
      color: { S: body.color},
      created_at: { S: new Date().toISOString() },
    };

    await dynamoDbClient.send(new PutItemCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: val
    }));

    const item = unmarshall(val)

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Item created", data: item }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};




// const { v4: uuidv4} = require("uuid");
// const dynamoDB = require('../utils/dynamoClient');

// const TABLE_NAME = process.env.DYNAMODB_TABLE

// module.exports.main = async (event) =>{
//     const data = JSON.parse(event.body);
//     const item = { id : uuidv4(), ...data};

//     await dynamoDB.put({
//         TableName : TABLE_NAME,
//         Item : item,
//     }).promise();

//     return {
//         statusCode : 201,
//         body: JSON.stringify(item)
//     }
// }