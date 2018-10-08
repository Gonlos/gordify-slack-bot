const startMessage = {
  attachments: [
    {
      text: "<!channel> Ey! who is going to have lunch out today?",
      color: "#3AA3E3",
      attachment_type: "default",
      actions: [
        {
          name: "goLunch",
          text: "Yes",
          type: "button",
          value: "yes"
        },
        {
          name: "goLunch",
          text: "No",
          type: "button",
          value: "no"
        }
      ]
    }
  ]
};
const yesMessage = {
  attachments: [
    {
      text: ":heavy_check_mark: You are joined \nIn case you change your mind",
      color: "#00ae58",
      attachment_type: "default",
      actions: [
        {
          name: "goLunch",
          text: "No",
          type: "button",
          value: "notNow"
        }
      ]
    }
  ]
};
const noMessage = {
  attachments: [
    {
      text: ":x: Maybe next time.\nIn case you change your mind",
      color: "#e09e48",
      attachment_type: "default",
      actions: [
        {
          name: "goLunch",
          text: "Yes",
          type: "button",
          value: "nowYes"
        }
      ]
    }
  ]
};

module.exports = { startMessage, yesMessage, noMessage };