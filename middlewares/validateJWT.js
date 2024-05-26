const { CustomError } = require("../middlewares/errorHandlerMiddleware") 
const jwt = require('jsonwebtoken');

const {MSG_NO_TOKEN, MSG_INVALID_TOKEN,MSG_USER_BLOCKED} = require('../messages/auth');
const { HttpStatusCode } = require('axios');

/**
 * Valida un token que viene por el header como "x-token" 
 */
const validateJWT = (req, res, next) => {
    const token = req.header('x-token');

    if (!token) {
        next( new CustomError(MSG_NO_TOKEN, HttpStatusCode.BadRequest));
    }

    const {isValid, isBlocked} = validateToken(req, token);

    if (isValid === false)
    {
        next( new CustomError(MSG_INVALID_TOKEN, HttpStatusCode.Unauthorized));
    }

    if (isBlocked === true)
    {
        next( new CustomError(MSG_USER_BLOCKED, HttpStatusCode.Forbidden));
    }

    next();
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
        return {isValid: false}
    }

}

module.exports = {
    validateJWT
}