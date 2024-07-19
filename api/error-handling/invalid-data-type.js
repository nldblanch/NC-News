module.exports = (error, request, response, next) => {
    if (error.code === '22P02') {
      response.status(400).send({message: "400 - Bad Request"})
    } else {
      next(error)
    }
  }