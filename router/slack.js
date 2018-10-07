const express = require("express");
const router = express.Router();
const botEscapedName = "<@UD3NJ1CKU>";
const Slack = require('../helpers/slackMethods')

router.post("/", (req, res, next) => {
  /*  interactive_message
      dialog_cancellation
      dialog_submission
      message_action  */
  const {payload} = req.body;
  console.log(payload)
  const {type,token,team,user,channel,response_url}=payload
  console.log({type,token,team,user,channel,response_url})
  
  res.status(200).end()
  switch (type) {
    case "interactive_message":console.log(interactive_message);break;
    case "dialog_submission":{
      const{submission}=payload
      const config={
        channel:submission.channel || 'general',
        days:submission.days || 'thursday',
        time:submission.time || '10:00',
        duration:submission.duration || 2
      }
      Slack.response(response_url,{
        text:`Has configurado el bot con <#${config.channel}> ${config.days} ${config.time}`
      })
      break;}
    case "dialog_cancellation":{
      Slack.response(response_url,{
        text:"Has cancelado la configuración"
      });
      break;
    }
    case "message_action":console.log(message_action);break;
    default:break;
  }
  return
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
  console.log("/config");
  res.status(200).end()
  
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
        },{
          type: "text",
          label: "Days to go lunch",
          placeholder: "Days of the week separated by commas",
          name: "days",
          optional: true
        },{
          type: "text",
          label: "Time",
          placeholder: "Launch time",
          name: "time",
          optional: true
        },{
          type: "text",
          label: "Duration",
          placeholder: "Time to join in hours",
          name: "duration",
          optional: true
        }
      ]
    }
  };
  
  Slack.dialog("open",message)
    .then(r => {
      console.log("open dialog", r.data);
    })
    .catch(e => console.log("open dialog error", e.data));
});

module.exports = router;
  
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

