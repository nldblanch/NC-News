module.exports = (error, request, response, next) => {
    if (error.code === "42601") {
        response.status(400).send({status: 400, message: "400 - Bad Request"})
    } else  {
        next(error)
    }
}