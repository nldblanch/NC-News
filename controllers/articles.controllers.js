const {fetchArticleById,
    fetchArticles,
    fetchCommentsByArticleId,
    insertCommentOntoArticle,
    updateArticle,
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
    const {sort_by, order, topic} = request.query
    fetchArticles(sort_by, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next)
    ;
  };
  
  exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    fetchCommentsByArticleId(article_id)
      .then((comments) => {
        response.status(200).send({ comments });
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
      response.status(200).send({article})
    })
    .catch(next)
  }