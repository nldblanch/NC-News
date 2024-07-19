const db = require("../../db/connection.js");

exports.fetchUsers = () => {
  const stringQuery = `
    SELECT * 
    FROM USERS
    `;
  return db.query(stringQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserFromUsername = (username) => {
  const stringQuery = `
  SELECT * 
  FROM users
  WHERE username = $1
  `;
  return db.query(stringQuery, [username]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "404 - Not Found" });
    }
    return rows[0];
  });
};
