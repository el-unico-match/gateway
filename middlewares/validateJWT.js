const {response} = require('express');
const jwt = require('jsonwebtoken');
const {jwtDecode} = require('jwt-decode');
const {HTTP_CLIENT_ERROR_4XX} = require('../helpers/httpCodes')
const {MSG_NO_TOKEN, MSG_INVALID_TOKEN} = require('../messages/auth');

/**
 * Valida un token que viene por el header como "x-token" 
 */
const validateJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            msg: MSG_NO_TOKEN
        });
    }
    try {
        doValidateJWT(req, token);
    } catch (error) {
        return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
            ok: false,
            msg: MSG_INVALID_TOKEN
        })
    }
    next();
}

/**
 * 
 * Válida el token del request.
 */
const doValidateJWT = (req, token) =>  {
    const {uid, role, blocked} = jwt.verify(
        token,
        process.env.SECRET_JWT_SEED
    );
    req.tokenExtractedData = {
        uid,
        role,
        blocked
    };
}

/**
 * Decodifica un token que viene por el header como "x-token" 
 */
const decodeJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST).json({
            ok: false,
            msg: MSG_NO_TOKEN
        });
    }
    try {
        doDecodeJWT(req, token);
    } catch (error) {
        return res.status(HTTP_CLIENT_ERROR_4XX.UNAUTHORIZED).json({
            ok: false,
            msg: MSG_INVALID_TOKEN
        })
    }
    next();
}

/**
 * 
 * Decodifica el token del request.
 */
const doDecodeJWT = (req, token) =>  {
    const {uid, role, blocked} = jwtDecode(token);
    req.tokenExtractedData = {
        uid,
        role,
        blocked
    };
}

module.exports = {
    validateJWT,
    decodeJWT
}