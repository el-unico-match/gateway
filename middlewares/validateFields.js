const {validationResult} = require('express-validator');
const { CustomError } = require("./errorHandlerMiddleware"); 
const { HttpStatusCode } = require('axios');

const validateFields = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty())
    {
        next()
    }

    else {
        next(new CustomError(errors.mapped(), HttpStatusCode.UnprocessableEntity))
    }  
}

module.exports = {
    validateFields,
}