exports.invalidEndpoint = (request, response) => {
  response.status(404).send({status: 404, message: "404 - Not Found"})
}


exports.lastErrorHandler = (error, request, response, next) => {
  response.status(500).send({status: 500, message: "500 - Internal Server Error"})
}