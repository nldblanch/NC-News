const {
  fetchApi,
  fetchTopics,
  fetchArticleById,
  fetchArticles
} = require("../models/topics.models");

exports.getApi = (request, response, next) => {
  fetchApi().then((endpoints) => {
    response.status(200).send({ endpoints });
  });
};

exports.getTopics = (request, response, next) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error)
    });
};

exports.getArticles = (request, response, next) => {
  fetchArticles()
  .then((articlesWithStringCommentCount) => {
    const articles = articlesWithStringCommentCount.map((article) => {
      const commentCount = Number(article.comment_count)
      return {...article, comment_count: commentCount }
    }) 
    response.status(200).send({articles})
  })
}
