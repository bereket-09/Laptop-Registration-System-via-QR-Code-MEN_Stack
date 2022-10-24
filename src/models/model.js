const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  IdNo: { type: String },
  userType: { type: String },
  dept: { type: String },
  year: { type: String },
  phone: { type: String },
  model: { type: String },
  serialNumber: { type: String, unique: true },
  color: { type: String },
  profile: { type: String, default: "profilepic" },
});

module.exports = mongoose.model("PCList", schema);
