const express = require("express");
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticle,
  deleteCommentController,
  getUsers
} = require("./controllers/controllers");
const errorFunctions = require("./error-handling");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.patch("/api/articles/:article_id", patchArticle)

app.delete("/api/comments/:comment_id", deleteCommentController)

app.all("*", errorFunctions.invalidEndpoint);

app.use(errorFunctions.customErrorHandler);

app.use(errorFunctions.userDoesNotExist)

app.use(errorFunctions.nullEnteredIntoColumn)

app.use(errorFunctions.queryInvalidDataType);

app.use(errorFunctions.internalServerError);

module.exports = app;
