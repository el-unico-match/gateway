const {response} = require('express');
const {validationResult} = require('express-validator');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes');

const validateFields = (req, res = response, next) => {
    const errors = validationResult(req);
    
    // error.type=='field'

    if(!errors.isEmpty()){
        return res
            .status(HTTP_CLIENT_ERROR_4XX.UNPROCESSABLE_CONTENT)
            .json({
                ok: false,
                msg: errors.mapped()
            });
    }

    next();
}

module.exports = {
    validateFields
}