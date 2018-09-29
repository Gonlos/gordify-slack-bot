const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(req)
  res.json({ text: "Hello, world!" });
});
router.post("/auth", (req, res, next) => {
  const {challenge}=req.body
  console.log(req.body)
  res.json({challenge});
});
router.post("/event", (req, res, next) => {
  const {challenge}=req.body
  console.log(req.body)
  res.json({text:`I'm received the ${command} event`});
});
router.post("/command",(req,res,next)=>{
  const {command} = req.body 
  console.log(req.body)
  res.json({text:`I'm received the ${command} command`})
})

module.exports = router;
