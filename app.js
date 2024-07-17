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
const apiRouter = require("./routers/api-router")
app.use(express.json());
app.use("/api", apiRouter)

app.all("*", errorFunctions.invalidEndpoint);

app.use(errorFunctions.customErrorHandler);

app.use(errorFunctions.userDoesNotExist)

app.use(errorFunctions.nullEnteredIntoColumn)

app.use(errorFunctions.queryInvalidDataType);

app.use(errorFunctions.internalServerError);

module.exports = app;
