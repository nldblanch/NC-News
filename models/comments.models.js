const db = require("../db/connection");
const { checkExists } = require("../utils/check-exists");

exports.deleteComment = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id).then(
    ({ exists }) => {
      if (!exists) {
        return Promise.reject({ status: 404, message: "404 - Not Found" });
      }

      const stringQuery = `
      DELETE FROM comments
      WHERE comment_id = $1
      `;
      return db.query(stringQuery, [comment_id]);
    }
  );
};
