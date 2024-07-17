const {
  deleteCommentController,
  patchCommentVotes
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id")
.patch(patchCommentVotes)
.delete(deleteCommentController);

module.exports = commentsRouter;
