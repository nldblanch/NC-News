const format = require("pg-format");
const db = require("../../db/connection.js");
const { checkExists } = require("../utils/check-exists.js");
const { formatObject } = require("../utils/format-object-for-pg-format.js");
const { checkGreenlistKeys } = require("../utils/greenlist.js");

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

exports.postNewUser = (user) => {
  const greenlist = [
    "username",
    "name",
  ];
  return checkGreenlistKeys(greenlist, user)
    .then(() => {      
      return checkExists("users", "username", user.username);
    })

    .then(({ exists }) => {
      if (exists) {
        return Promise.reject({status: 200, message: "User already exists. Successful login."});
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      const userData = formatObject(user);
      let stringQuery = `INSERT INTO users (username, name) VALUES %L RETURNING *`;
      const query = format(stringQuery, [userData]);

      return db.query(query);
    })
    .then(({ rows }) => {
      const newlyPostedUser = rows[0];
      return { ...newlyPostedUser };
    });
}
