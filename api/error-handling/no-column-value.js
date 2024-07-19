module.exports = (error, request, response, next) => {
    if (error.code === '23502') {
      response.status(400).send({message: "400 - Bad Request"})
    } else {
      next(error)
    }
  }