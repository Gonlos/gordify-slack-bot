const bodyParser = require("body-parser");
const express = require("express");
const app = express();


app.use(bodyParser.json());


const slack = require("./router/slack");
app.use("/slack", slack);


module.exports = app;
