const { deleteComment, updateCommentVotes } = require("../models/comments.models");

exports.deleteCommentController = (request, response, next) => {
  const { comment_id } = request.params;
  deleteComment(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};

exports.patchCommentVotes = (request, response, next) => {
  const {comment_id} = request.params
  const {inc_votes} = request.body
  updateCommentVotes(comment_id, inc_votes)
  .then((comment) => {
    response.status(200).send({comment})
  })
  .catch(next)
}
