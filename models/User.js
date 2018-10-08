const mongosse = require("mongoose");
const Schema = mongosse.Schema;
const Lunch = require("./Lunch");

const userSchema = new Schema(
  {
    slackId: String,
    name: String,
    lunches: [{ type: Schema.Types.ObjectId, ref: "Lunch" }],
    leadGroup: Number,
    leadGroupAvg: Number
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongosse.model("User", userSchema);

module.exports = User;