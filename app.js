require('dotenv').config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req,res,next)=>{
  console.log("-------------------")
  console.log("body -> ",req.body)
  console.log("params -> ",req.params)
  console.log("query -> ",req.query)
  next()
});
const slack = require("./router/slack");
app.use("/slack", slack);


module.exports = app;
