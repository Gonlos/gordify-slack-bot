require('dotenv').config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose =require('mongoose')
const Gordify = require('./Gordify')

mongoose
  .connect(process.env.DB_URL, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const gordify = new Gordify()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req,res,next)=>{
  console.log("-------------------")
  console.log(req.originalUrl)
  // console.log("body -> ");  console.log(req.body)
  // console.log("params -> ");  console.log(JSON.stringify(req.params,null,1))
  // console.log("query -> ");  console.log(JSON.stringify(req.query,null,1))
  if(req.body.payload) req.body.payload=JSON.parse(req.body.payload);
  next()
});
const slack = require("./router/slack");
app.use("/slack/", slack);


module.exports = app;
