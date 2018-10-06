const express = require("express");
const router = express.Router();
const botEscapedName = "<@UD3NJ1CKU>";
const Slack = require('../helpers/slackMethods')

router.post("/", (req, res, next) => {
  const {payload} = req.body;
  console.log(payload)
  const {type,token,team,user,channel,response_url}=payload
  console.log({type,token,team,user,channel,response_url})
  Slack.groups("create",{name:"Prueba5",validate:false})
  .then((e)=>{
    console.log(e)
    if(e.data.ok){
      return Slack.groups('setPurpose',{channel:e.data.group.id,purpose:"Proposito del canal"})
    }
    throw e
  })
  .then()
  .catch(e=>console.log("create error",e.data))
  res.status(200).end()
  return

  /*
      interactive_message
      dialog_cancellation
      dialog_submission
      message_action

  */

  let action =""

  if(payload.type=="message" && payload.message.bot_id){
    console.log("bot message")
    return
  }
  if(payload.type=="message_action"){
    action=payload.callback_id
  }
  const username = `<@${payload.user.id}>`
  action = (payload.actions)?payload.actions[0].value:""
  console.log("payload ->",response_url)
  console.log(payload);
  let message ={
    attachments: [
      {
        fallback: "Ey! who is going to have lunch out today?",
        callback_id: "wo_go_lunch",
        color: "#3AA3E3",
        attachment_type: "default",
        actions:[]
      }
    ]
  }
  let text="Ey! who is going to have lunch out today?"
  if(action=="yes" ){
    text+=`\n:heavy_check_mark: ${username} te hemos apuntado.`
  }else if(action=="no"){
    text+=`\n:x: ${username} hoy no te apuntamos.`
    message.attachments[0].actions.push({
      name: "goLunch",
      text: "Now Yes",
      type: "button",
      value: "yes"
    })
  }else if(action=="join_me"){
    message.attachments.push()
  }
  message.attachments[0].text=text
  console.log("message",message)
  Slack.response(response_url, { ...message })
    .then(r => console.log("then", r.data))
    .catch(e => console.log("catch", e));
});

router.post("/event", (req, res, next) => {
  if (req.body.challenge) {
    res.json({ challenge: req.body.challenge });
    return;
  }

  const { event } = req.body;
  console.log(event)
  res.json({
    text: `I'm received the ${event.type} event width this text :"${
      event.text
    }"`
  });
});

router.post("/start", (req, res, next) => {
  console.log("/start");
  Slack.chat.postMessage({
      channel: "random",
      attachments: [
        {
          text: "<!channel> Ey! who is going to have lunch out today?",
          fallback: "Ey! who is going to have lunch out today?",
          callback_id: "wo_go_lunch",
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
    })
    .then(r =>{
       console.log("/start", r.data)
       res.json({ text: `I'm received the /start command` })
      })
    .catch(e => console.log("/start", e.data));
  
});
router.post("/end", (req, res, next) => {
  const { command } = req.body;
  res.json({ text: `I'm received the /end command` });
});
router.post("/config", (req, res, next) => {
  const { trigger_id } = req.body;
  let dialog = {
    callback_id: "ryde-46e2b0",
    title: "Request a Ride",
    submit_label: "Request",
    notify_on_cancel: true,
    state: "Limo",
    elements: [
      {
        type: "select",
        label: "Channel",
        placeholder:"Chose channel tu run",
        name: "chanel",
        data_source:"conversations"
      },
      {
        type: "text",
        label: "Date to start",
        placeholder:"Date to start YYYY-MM-DD - Default today",
        name: "date",
        optional:true
      }
    ]
  };
  let message = {
    trigger_id,
    dialog
  };
  console.log("/config");
  // axios
  //   .post("https://slack.com/api/chat.postMessage", {
  //     channel: "random",
  //     text: "Ey! who is going to have lunch out today?",
  //     attachments: [
  //       {
  //         fallback: "Ey! who is going to have lunch out today?",
  //         callback_id: "wo_go_lunch",
  //         color: "#3AA3E3",
  //         attachment_type: "default",
  //         actions: [
  //           {
  //             name: "goLunch",
  //             text: "Yes",
  //             type: "button",
  //             value: "yes"
  //           },
  //           {
  //             name: "goLunch",
  //             text: "No",
  //             type: "button",
  //             value: "no"
  //           }
  //         ]
  //       }
  //     ]
  // })
  Slack.dialog.open(message)
    .then(r => {
      console.log("/start", r.data);
      res.json({ text: `I'm received the /start command` });
    })
    .catch(e => console.log("/start", e.data));
});

module.exports = router;
