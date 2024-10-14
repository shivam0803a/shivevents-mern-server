const mongooes = require("mongoose");
const connectMongooesDB = async () => {
  try {
    await mongooes.connect("mongodb://127.0.0.1:27017/shivevents-mern");
    console.log("Connection Successful to DB");
  } catch (error) {
    console.log("Error in connecting in DB " + error);
  }
};
module.exports = { connectMongooesDB };
