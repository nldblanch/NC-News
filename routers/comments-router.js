const { deleteCommentController } = require("../controllers/controllers")

const commentsRouter = require("express").Router()

commentsRouter
.route("/:comment_id")
.delete(deleteCommentController)


module.exports = commentsRouter