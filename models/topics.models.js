const db = require("../db/connection");
const endpoints = require("../endpoints.json");
exports.fetchApi = () => {
  return Promise.resolve(endpoints)
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
