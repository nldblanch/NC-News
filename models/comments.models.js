const db = require("../db/connection");
const { checkExists } = require("../utils/check-exists");

exports.deleteComment = (comment_id) => {
  return this.checkCommentExists(comment_id).then(() => {
    const stringQuery = `
    DELETE FROM comments
    WHERE comment_id = $1
    `;
    return db.query(stringQuery, [comment_id]);
  });
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  return this.checkCommentExists(comment_id)
  .then(() => {
    const stringQuery = `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *
    `
    return db.query(stringQuery, [inc_votes, comment_id])
    .then(({rows}) => {
      return rows[0]
    })
  })
};

exports.checkCommentExists = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id).then(
    ({ exists }) => {
      if (!exists) {
        return Promise.reject({ status: 404, message: "404 - Not Found" });
      }
    }
  );
};
