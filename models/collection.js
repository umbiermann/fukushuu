const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CollectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  cards: {
    type: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  logs: [
    {
      userName: {
        type: String,
      },
      cardName: {
        type: String,
      },
      original: {
        type: String,
      },
      success: {
        type: String,
        enum: ["bad", "avg", "good"],
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      comment: [
        {
          userName: {
            type: String,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Collection", CollectionSchema);
