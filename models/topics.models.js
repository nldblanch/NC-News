const db = require("../db/connection");
const endpoints = require("../endpoints.json");
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
