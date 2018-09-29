const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({ text: "Hello, world!" });
});
router.post("/auth", (req, res, next) => {
  const {challenge}=req.body
  console.log(req.body)
  res.json({challenge});
});

module.exports = router;
