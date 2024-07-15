const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { invalidEndpoint, lastErrorHandler } = require("./errorHandling");

const app = express();

app.get('/api/topics', getTopics)

app.all('*' , invalidEndpoint)

app.use(lastErrorHandler)

module.exports = app;
