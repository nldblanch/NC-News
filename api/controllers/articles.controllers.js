const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertCommentOntoArticle,
  updateArticle,
  insertArticle,
  deleteArticle,
} = require("../models/articles.models");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  const { sort_by, order, topic, limit, p } = request.query;
  fetchArticles(sort_by, order, topic, limit, p)
    .then(([articles, total_count]) => {
      response.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { limit, p } = request.query;
  fetchCommentsByArticleId(article_id, limit, p)
    .then(([comments, total_count]) => {
      response.status(200).send({ comments, total_count });
    })
    .catch(next);
};

exports.postCommentToArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  insertCommentOntoArticle(article_id, username, body)
    .then((successfulComment) => {
      response.status(201).send({ comment: successfulComment });
    })
    .catch(next);
};

exports.patchArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  updateArticle(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (request, response, next) => {
  const article = request.body;
  insertArticle(article)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch(next);
};

exports.removeArticle = (request, response, next) => {
  const { article_id } = request.params;
  deleteArticle(article_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
