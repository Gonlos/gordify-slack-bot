const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ text: "Hello, world!" });
});
router.post("/auth", (req, res, next) => {
  const {challenge}=req.body
  res.json({challenge});
});
router.post("/event", (req, res, next) => {
  if(req.body.challenge) {
    res.json({challenge:req.body.challenge})
    return
  }
  const {event}=req.body
  res.json({text:`I'm received the ${event.type} event width this text :"${event.text}"`});
});
router.post("/start",(req,res,next)=>{
  console.log("/start")
  const {command} = req.body 
  res.json({text:`I'm received the /start command`})
})
router.post("/end",(req,res,next)=>{
  const {command} = req.body 
  res.json({text:`I'm received the /end command`})
})

module.exports = router;
