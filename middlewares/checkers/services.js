const {check} = require('express-validator');
const {validateFields} = require('../validateFields');
const {
    MSG_INVALID_SERVICE,
    MSG_SERVICE_REQUIRED,
    MSG_STATUS_REQUIRED} = require('../../messages/services');
const { isService } = require('../../types/services');

/**
 * @returns {object} Un arreglo de middlewares que checkean la
 * presencia de los parámetros service y active del body.
 * Además ser verifica el permiso de usuario.
 */
const checkUpdateServiceStatus = [
    check('service', MSG_SERVICE_REQUIRED).not().isEmpty(),
    check('service', MSG_INVALID_SERVICE)
        .custom( (service) => isService(service)),
    check('active', MSG_STATUS_REQUIRED).not().isEmpty(),    
    check('active', MSG_STATUS_REQUIRED).isBoolean(),
    validateFields
];

module.exports = {
    checkUpdateServiceStatus
}