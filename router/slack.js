const express = require("express");
const router = express.Router();
// const botEscapedName = "<@UD3NJ1CKU>";
const Slack = require("../helpers/slackMethods");
const Gordify = require("../Gordify");
const { yesMessage, noMessage } = require("../helpers/messages");
const { shortDayToLong,daysOfWeek } = require("../helpers/util");

const gordify = new Gordify();
router.post("/", (req, res, next) => {
  /*  interactive_message
      dialog_cancellation
      dialog_submission
      message_action  */
  const { payload } = req.body;
  console.log(payload);
  const {
    type,
    token,
    team,
    user,
    channel,
    response_url,
    callback_id
  } = payload;
  console.log({ type, token, team, user, channel, response_url, callback_id });

  
  switch (type) {
    case "interactive_message": {
      res.status(200).end();
      if (payload.actions[0].name != "goLunch") return;
      let action = payload.actions[0].value;
      let error="a",message
      gordify
        .findOrCreateUser({ slackId: user.id, name: user.name })
        .then(userDB => {
          if (action == "no" || action == "notNow") {
            message = noMessage;
            error="You were not joined"
            return gordify.removeUserLunch(userDB.id,callback_id)
          }
          if (action == "yes" || action == "nowYes") {
            message = yesMessage;
            error="You were already joined"
            return gordify.addUserLunch(userDB.id,callback_id)
          }
        })
        .then(lunch => {
          if (lunch) {
            message.user = user.id;
            message.channel = user.id;
            message.attachments[0].callback_id = callback_id;

            if (action == "no" || action == "yes") {
              return Slack.chat("postMessage", message);
            } else if (action == "notNow" || action == "nowYes") {
              return Slack.response(response_url, message);
            }
          } else {
            console.log(error)
            return Promise.reject({error})
          }
        })
        .then(r => console.log("int_mess", r.data))
        .catch(e => next({user:user.id,channel:channel.id,text:e.error}))
        .then(e => console.log(e))
        .catch(e => console.log(e))
      break;
    }
    case "dialog_submission": {
      const { submission } = payload;
      let daysLong=[],error=false
      if(submission.days!="") {
        error=submission.days.split(',').some(d=>{
          day=shortDayToLong(d)
          if(day==""){
            return true
          }
          daysLong.push(day)
        })
      }
      console.log(error)
      if(error){
        res.json({errors:[{name:"days",error:"Some of the days is not right"}]})
        return
      }
      res.status(200).end();
      const config = {
        channel: submission.channel || "general",
        days: daysLong.toString() || "thursday"
        // ,
        // time: submission.time || "10:00",
        // duration: submission.duration || 2
      };
      Slack.response(response_url, {
        text: `You have set the robot on the channel <#${config.channel}> at 10:00 on the following days of the week: ${config.days}`
      });
      break;
    }
    case "dialog_cancellation": {
      res.status(200).end();
      Slack.response(response_url, {
        text: "Has cancelado la configuración"
      });
      break;
    }
    case "message_action":
      res.status(200).end();
      console.log(message_action);
      break;
    default:
      break;
  }
});

router.post("/event", (req, res, next) => {
  if (req.body.challenge) {
    res.json({ challenge: req.body.challenge });
    return;
  }

  const { event } = req.body;
  console.log(event);
  res.json({
    text: `I'm received the ${event.type} event width this text :"${
      event.text
    }"`
  });
});

router.post("/start", (req, res, next) => {
  console.log(req.body)
  const{channel_id,user_id}=req.body
  res.status(200).end();
  gordify
    .startLunch()
    .then(r => {
      console.log("gordify.startlunch", r.data);
      res.json({ text: `I'm received the /start command` });
    })
    .catch(e => next({text:e.error,channel:channel_id,user:user_id}));
});
router.post("/stop", (req, res, next) => {
  res.status(200).end();
  
  gordify.stopLunch()
  // const { command } = req.body;
  // res.json({ text: `I'm received the /stop command` });
});
router.post("/config", (req, res, next) => {
  console.log("/config");
  res.status(200).end();

  const { trigger_id } = req.body;
  let message = {
    trigger_id,
    dialog: {
      callback_id: "config",
      title: "Config bot",
      submit_label: "Request",
      notify_on_cancel: true,
      state: "Limo",
      elements: [
        {
          type: "select",
          label: "Channel",
          placeholder: "Choose channel",
          name: "channel",
          data_source: "channels"
        },
        {
          type: "text",
          label: "Days to go lunch",
          placeholder: "Days of the week separated by commas",
          name: "days",
          optional: true
         }
        //,
        // {
        //   type: "text",
        //   label: "Time",
        //   placeholder: "Launch time",
        //   name: "time",
        //   optional: true
        // },
        // {
        //   type: "text",
        //   label: "Duration",
        //   placeholder: "Time to join in hours",
        //   name: "duration",
        //   optional: true
        // }
      ]
    }
  };

  Slack.dialog("open", message)
    .then(r => {
      console.log("open dialog", r.data);
    })
    .catch(e => console.log("open dialog error", e.data));
});

module.exports = router;
