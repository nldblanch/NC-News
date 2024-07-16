const express = require("express");
const { getApi, getTopics, getArticleById, getArticles, getCommentsByArticleId } = require("./controllers/topics.controllers");
const { invalidEndpoint, customErrorHandler, queryInvalidDataType, internalServerError } = require("./error-handling");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)


app.all("*", invalidEndpoint);

app.use(customErrorHandler)

app.use(queryInvalidDataType)

app.use(internalServerError);

module.exports = app;
