exports.invalidEndpoint = (request, response) => {
  response.status(404).send({status: 404, message: "404 - Not Found"})
}

exports.customErrorHandler = (error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send(error)
  } else {
    next(error)
  }
}

exports.queryInvalidDataType = (error, request, response, next) => {
  if (error.code === '22P02') {
    response.status(400).send({message: "400 - Bad Request"})
  } else {
    next(error)
  }
}

exports.internalServerError = (error, request, response, next) => {
  response.status(500).send({status: 500, message: "500 - Internal Server Error"})
}