const db = require("../db/connection");
const format = require("pg-format");
const { formatObject } = require("../utils/format-object-for-pg-format");
const { checkGreenlist } = require("../utils/greenlist");

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
  const topicGreenlist = ["slug", "description"];
  return checkGreenlist(topicGreenlist, topic)
  .then(() => {
    if (!topic.description) topic.description = ""
    const topicData = formatObject(topic);
    const stringQuery = `INSERT INTO topics (slug, description) VALUES %L RETURNING *;`;
    const query = format(stringQuery, [topicData]);
    return db.query(query)
  })
  .then(({ rows }) => {
    return rows[0];
  });
};
