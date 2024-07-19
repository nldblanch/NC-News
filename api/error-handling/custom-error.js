module.exports = (error, request, response, next) => {
    if (error.status && error.message) {
      response.status(error.status).send(error)
    } else {
      next(error)
    }
  }