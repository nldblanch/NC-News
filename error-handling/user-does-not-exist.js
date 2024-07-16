module.exports = (error, request, response, next) => {
    if (error.code === '23503') {
      response.status(400).send({message: "400 - User does not exist"})
    } else {
      next(error)
    }
  }