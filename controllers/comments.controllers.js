const { deleteComment } = require("../models/comments.models");

exports.deleteCommentController = (request, response, next) => {
  const { comment_id } = request.params;
  deleteComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
