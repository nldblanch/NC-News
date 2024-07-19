module.exports = (error, request, response, next) => {
    response.status(500).send({status: 500, message: "500 - Internal Server Error"})
  }