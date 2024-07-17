const { getTopics } = require("../controllers/controllers")

const topicsRouter = require("express").Router()

topicsRouter.get("/", getTopics)


module.exports = topicsRouter