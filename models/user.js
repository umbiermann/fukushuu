const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
  invitations: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
  cardProgress: [
    {
      cardId: {
        type: Schema.Types.ObjectId,
        ref: "Card",
        required: true,
      },
      level: {
        type: Number,
        default: 0,
      },
      lastDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  selectOptions: {
    filterCollection: {
      type: String,
      default: "",
    },
    sort: {
      type: String,
      default: "Newest",
    },
    cardType: {
      type: String,
      default: "Grammar",
    },
    addCollection: {
      type: String,
      default: "",
    },
  },
  exampleCollection: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("User", UserSchema);
