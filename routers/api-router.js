const apiRouter = require("express").Router();
const { getApi } = require("../controllers/controllers");

const {articles, users, comments, topics} = require("./index")

apiRouter.use('/articles', articles)
apiRouter.use("/topics", topics)
apiRouter.use("/users", users)
apiRouter.use("/comments", comments)

apiRouter.get("/", getApi)

module.exports = apiRouter