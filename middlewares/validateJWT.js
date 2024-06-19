const { CustomError } = require("../middlewares/errorHandlerMiddleware") 
const jwt = require('jsonwebtoken');
const {logWarning} = require('../helpers/log/log');
const {MSG_INVALID_TOKEN,MSG_USER_BLOCKED} = require('../messages/auth');
const { HttpStatusCode } = require('axios');

/**
 * Valida un token que viene por el header como "x-token" 
 */
const validateJWT = (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        const message = {
            "x-token": {
                "type": "field",
                "msg": "Is a required header.",
                "path": "x-token",
                "location": "header"
            }
        }
        next( new CustomError(message, HttpStatusCode.BadRequest));
    }

    const {isValid, isBlocked} = validateToken(req, token);

    if (isValid === false)
    {
        next( new CustomError(MSG_INVALID_TOKEN, HttpStatusCode.Unauthorized));
    }

    else if (isBlocked === true)
    {
        next( new CustomError(MSG_USER_BLOCKED, HttpStatusCode.Forbidden));
    }

    else {
        next();
    }
}

/**
 * 
 * Válida el token del request.
 */
const validateToken = (req, token) =>  {

    try {
        const {uid, role, blocked} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
    
        req.tokenExtractedData = {
            uid,
            role,
            blocked
        };
    
        return {isValid: true, uid, role, isBlocked: blocked}
    }

    catch (error) {
        logWarning(`On validate Token: ${JSON.stringify(error)}`);
        return {isValid: false}
    }

}

module.exports = {
    validateJWT
}