const {
  getArticles,
  getArticleById,
  patchArticle,
  getCommentsByArticleId,
  postCommentToArticle,
  postArticle,
} = require("../controllers/articles.controllers");

const articlesRouter = require("express").Router();

articlesRouter
.route("/")
.get(getArticles)
.post(postArticle)

articlesRouter.route("/:article_id").get(getArticleById).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentToArticle);

module.exports = articlesRouter;
