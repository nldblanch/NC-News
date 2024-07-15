const db = require("../db/connection");

exports.fetchTopics = () => {
  const stringQuery = `
  SELECT slug, description 
  FROM topics
  `;
  return db.query(stringQuery).then(({ rows }) => {
    return rows;
  });
};
