require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL, {useNewUrlParser: true})
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err)
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log("-------------------");
  console.log(req.originalUrl);
  if (req.body.payload) req.body.payload = JSON.parse(req.body.payload);
  next();
});

const slack = require("./router/slack");
app.use("/slack/", slack);

module.exports = app;
