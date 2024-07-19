module.exports = (error, request, response, next) => {
    if (error.code === '23503') {
      response.status(404).send({message: "404 - User not found"})
    } else {
      next(error)
    }
  }