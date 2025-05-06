// exports.hello = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: "Go Serverless v4! Your function executed successfully!",
//     }),
//   };
// };
module.exports.createItem = require("./functions/createItem");
module.exports.getItem = require("./functions/getItem");
module.exports.updateItem = require("./functions/updateItem");
module.exports.deleteItem = require("./functions/deleteItem");
module.exports.listItems = require("./functions/listItems");
