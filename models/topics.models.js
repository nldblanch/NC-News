const db = require("../db/connection");
const format = require("pg-format");
const { formatObject } = require("../utils/format-object-for-pg-format");

exports.fetchTopics = () => {
  const stringQuery = `
    SELECT slug, description 
    FROM topics
    `;
  return db.query(stringQuery).then(({ rows }) => {
    return rows;
  });
};

exports.insertTopic = (topic) => {
  const allowedKeys = ["slug", "description"];
  const topicKeys = Object.keys(topic);
  for (let key of topicKeys) {
    if (!allowedKeys.includes(key)) {
      return Promise.reject({ status: 400, message: "400 - Bad Request" });
    }
  }
  
  if (!topic.description) topic.description = ""
  const topicData = formatObject(topic);
  const stringQuery = `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`;
  const query = format(stringQuery, [topicData]);
  return db.query(query).then(({ rows }) => {
    return rows[0];
  });
};
