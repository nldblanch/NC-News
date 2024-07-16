const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const { checkExists } = require("../utils/check-exists");
exports.fetchApi = () => {
  return Promise.resolve(endpoints);
};

exports.fetchTopics = () => {
  const stringQuery = `
  SELECT slug, description 
  FROM topics
  `;
  return db.query(stringQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  const stringQuery = `
    SELECT * 
    FROM articles 
    WHERE article_id = $1
  `;
  return db.query(stringQuery, [id]).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, message: "404 - Not Found" });
    return rows[0];
  });
};

exports.fetchArticles = () => {
  const stringQuery = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count
  FROM articles
  LEFT JOIN comments
    ON articles.article_id = comments.article_id
  GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
  ORDER BY articles.created_at DESC
  `;
  return db.query(stringQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByArticleId = (article_id) => {
  const stringQuery = `
  SELECT comment_id, votes, created_at, author, body, article_id
  FROM comments
  WHERE article_id = $1
  `;
  const promiseArray = [];
  promiseArray.push(db.query(stringQuery, [article_id]));
  promiseArray.push(checkExists("articles", "article_id", article_id));
  return Promise.all(promiseArray).then(([{ rows }, { exists }]) => {
    if (rows.length === 0 && !exists) {
      return Promise.reject({ status: 404, message: "404 - Not Found" });
    }
    return rows;
  });
};
