const auth = {
  bot: `Bearer ${process.env.SLACK_BOT_USER_TOKEN}`,
  user: `Bearer ${process.env.SLACK_OAUTH_TOKEN}`,
  app: `Bearer ${process.env.SLACK_TOKEN}`
};

const axios = require("axios").create({
  baseURL: "https://slack.com/api/"
});

const Slack = {
  groups: (command, data) => {
    return axios.post(`groups.${command}`, data, {
      headers: { Authorization: auth.user }
    });
  },
  chat: (command, data) => {
    return axios.post(`chat.${command}`, data, {
      headers: { Authorization: auth.app }
    });
  },
  dialog: (command, message) => {
    return axios.post(`dialog.${command}`, message, {
      headers: { Authorization: auth.app }
    });
  },
  response: (response_url, data) => {
    return axios.post(response_url, data, {
      headers: { Authorization: auth.app }
    })
  }
};

module.exports = Slack;