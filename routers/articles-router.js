const { getArticles, getArticleById, patchArticle, getCommentsByArticleId, postCommentToArticle } = require("../controllers/controllers")

const articlesRouter = require("express").Router()

articlesRouter.get("/", getArticles)

articlesRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticle)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentToArticle)

module.exports = articlesRouter