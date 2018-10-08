const mongosse = require("mongoose");
const Schema = mongosse.Schema;
const User = require("./User");

const lunchSchema = new Schema(
  {
    callback_id: String,
    is_finished: { type: Boolean, default: false },
    duration: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groups:[{users:[{ type: Schema.Types.ObjectId, ref: "User" }],leader:{ type: Schema.Types.ObjectId, ref: "User" }}],
    response_url: String
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