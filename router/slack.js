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
router.post("/", (req, res, next) => {
  const {challenge}=req.body
  console.log(req.body)
  res.json({text:"algo recibo"});
});
router.post("/start",(req,res,next)=>{
  res.json({text:"Esto es para empezar"})
})

module.exports = router;
