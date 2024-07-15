const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { invalidEndpoint, internalServerError } = require("./errorHandling");

const app = express();

app.get('/api/topics', getTopics)

app.all('*' , invalidEndpoint)

app.use(internalServerError)

module.exports = app;
