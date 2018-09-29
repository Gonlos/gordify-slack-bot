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
  console.log(req.body)
  const {event}=req.body
  res.json({text:`I'm received the ${event.type} event width this text :"${event.text}"`});
});
router.post("/command",(req,res,next)=>{
  console.log(req.body)
  const {command} = req.body 
  res.json({text:`I'm received the ${command} command`})
})

module.exports = router;
