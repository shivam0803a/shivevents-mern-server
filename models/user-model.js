const mongooes = require("mongoose");
const userschema = new mongooes.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isAdmin: {
      type: Boolean,
      require: false,
      default: false,
    },
    isActive: {
      type: Boolean,
      require: false,
      default: true,
    },
  },
  { timeStamp: true }
);
let users = mongooes.model("users", userschema);
module.exports = users;
