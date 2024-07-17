const { getUsers, getUserFromUsername } = require("../controllers/users.controllers")

const usersRouter = require("express").Router()

usersRouter.get("/", getUsers)
usersRouter.get("/:username", getUserFromUsername)

module.exports = usersRouter