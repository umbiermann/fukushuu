const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  info: {
    type: Map,
    of: String,
    default: {},
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Card", CardSchema);
