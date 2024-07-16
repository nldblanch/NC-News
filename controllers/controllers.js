const {
  fetchApi,
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  insertCommentOntoArticle,
  updateArticle,
  deleteComment,
  fetchUsers
} = require("../models/models");

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
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  fetchArticles().then((articlesWithStringCommentCount) => {
    const articles = articlesWithStringCommentCount.map((article) => {
      const commentCount = Number(article.comment_count);
      return { ...article, comment_count: commentCount };
    });
    response.status(200).send({ articles });
  });
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

exports.deleteCommentController = (request, response, next) => {
  const {comment_id} = request.params
  deleteComment(comment_id)
  .then((result) => {
    response.status(204).send()
  })
  .catch(next)
}

exports.getUsers = (request, response, next) => {
  fetchUsers()
  .then((users) => {
    response.status(200).send({users})
  })
}
