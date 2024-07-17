const {
  deleteCommentController,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").delete(deleteCommentController);

module.exports = commentsRouter;
