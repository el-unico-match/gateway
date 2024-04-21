const {response} = require('express');
const {getServiceStatus} = require('../servicesStatus/servicesStatus');
const {HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_SERVICE_DISABLED} = require('../messages/services')

/**
 * Verificar que el servicio se encuentre activo
 */
const checkServiceIsActive = (req, res = response, next, service) => {
    if (!getServiceStatus(service).active) {
        return res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
            ok: false,
            msg: MSG_SERVICE_DISABLED
        })
    }     
    next();
}

module.exports = {
    checkServiceIsActive
}