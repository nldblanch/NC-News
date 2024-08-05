const apiRouter = require("./routers/api-router")
const errorFunctions = require("./error-handling");
const express = require("express");
const cors = require("cors")
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter)

app.all("*", errorFunctions.invalidEndpoint);

app.use(errorFunctions.customErrorHandler);

app.use(errorFunctions.userDoesNotExist)

app.use(errorFunctions.nullEnteredIntoColumn)

app.use(errorFunctions.queryInvalidDataType);

app.use(errorFunctions.insufficientDataProvided)


app.use(errorFunctions.internalServerError);


module.exports = app;
