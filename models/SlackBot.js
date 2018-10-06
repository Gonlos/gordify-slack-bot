const mongosse = require("mongoose");
const Schema = mongosse.Schema;

const slackBotSchema = new Schema(
  {
    name: String,
    channel: String,
    days: String,
    time: String,
    duration: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const SlackBot = mongosse.model("SlackBot", slackBotSchema);

module.exports = SlackBot;