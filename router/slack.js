const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(req)
  res.json({ text: "Hello, world!" });
});
router.post("/auth", (req, res, next) => {
  console.log(req.body)
  const {challenge}=req.body
  res.json({challenge});
});
router.post("/event", (req, res, next) => {
  if(req.query.challenge)res.json({challenge.req.query.challenge})
  console.log(req.body)
  const {event}=req.body
  res.json({text:`I'm received the ${event.type} event width this text :"${event.text}"`});
});
router.post("/start",(req,res,next)=>{
  console.log(req.body)
  const {command} = req.body 
  res.json({text:`I'm received the /start command`})
})
router.post("/end",(req,res,next)=>{
  console.log(req.body)
  const {command} = req.body 
  res.json({text:`I'm received the /end command`})
})

module.exports = router;
