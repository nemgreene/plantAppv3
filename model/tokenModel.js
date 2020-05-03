const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//refresh, access token model
const TokenModel = new Schema({
  refreshToken: {
    type: String,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TokenModel", TokenModel);
