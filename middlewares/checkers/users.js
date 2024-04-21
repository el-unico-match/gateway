const {check} = require('express-validator');
const {checkServiceIsActive} = require('../uncategorized');
const { SERVICES } = require('../../types/services');

/**
 * Verificar que el servicio de usuario se encuentre activo
 */
const checkUserServiceIsActive = (req, res = response, next) => {
    checkServiceIsActive(SERVICES.USERS);
    next();
}

module.exports = {
    checkUserServiceIsActive
}