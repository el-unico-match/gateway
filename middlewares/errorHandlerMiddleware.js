const { HttpStatusCode } = require('axios');

class CustomError extends Error {

    constructor(message, statusCode){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }

}

const errorHandlerMiddleware = (err, req, res, next) => {

    const status = err?.statusCode ?? HttpStatusCode.InternalServerError

    const data = {
        ok: false,
        msg: err.message
    }

    return res
        .status(status)
        .json(data);
}

module.exports = {
    CustomError,
    errorHandlerMiddleware,
}