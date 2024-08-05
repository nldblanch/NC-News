const express = require("express");
const cors = require("cors")
const app = express();
app.use(cors())
const apiRouter = require("./routers/api-router")
app.use(express.json());
app.use("/api", apiRouter)
const errorFunctions = require("./error-handling");

app.all("*", errorFunctions.invalidEndpoint);

app.use(errorFunctions.customErrorHandler);

app.use(errorFunctions.userDoesNotExist)

app.use(errorFunctions.nullEnteredIntoColumn)

app.use(errorFunctions.queryInvalidDataType);

app.use(errorFunctions.insufficientDataProvided)


app.use(errorFunctions.internalServerError);


module.exports = app;
