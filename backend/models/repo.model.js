const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const repoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    content: [
      {
        type: String,
      },
    ],
    visibility: {
      type: Boolean, // visibility true mean's public
      default: "true",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
  },
  { Timestamp: true },
);

const Repository = mongoose.model("Repository", repoSchema);

module.exports = Repository;
