const mongosse = require("mongoose");
const mongosse = require("mongoose");
const Schema = mongosse.Schema;
const User = require("./User");

const lunchSchema = new Schema(
  {
    name: String,
    channel: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    leader: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Lunch = mongosse.model("Lunch", lunchSchema);

module.exports = Lunch;