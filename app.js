const express = require("express");
const { getApi, getTopics } = require("./controllers/topics.controllers");
const { invalidEndpoint, internalServerError } = require("./error-handling");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("*", invalidEndpoint);

app.use(internalServerError);

module.exports = app;
