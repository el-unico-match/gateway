const {response} = require('express');
const {getServiceStatus} = require('../servicesStatus/servicesStatus');
const {HTTP_SERVER_ERROR_5XX} = require('../helpers/httpCodes');
const {MSG_SERVICE_DISABLED} = require('../messages/services')

/**
 * 
 * @param {*} serviceName Nombre del servicio a checkear.
 * @returns Un middleware que checkea que el servicio parámetro se encuentre activo.
 */
const createCheckServiceIsActive = (serviceName) => {
    return  (req, res = response, next) => {
            if (!getServiceStatus(serviceName).active) {
                return res.status(HTTP_SERVER_ERROR_5XX.SERVICE_NOT_AVAILABLE).json({
                    ok: false,
                    msg: MSG_SERVICE_DISABLED
                })
            }     
            next();
        }
}

module.exports = {
    createCheckServiceIsActive
}