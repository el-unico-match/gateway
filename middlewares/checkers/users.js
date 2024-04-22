const {check} = require('express-validator');
const {createCheckServiceIsActive} = require('../uncategorized');
const { SERVICES } = require('../../types/services');

/**
 * Verificar que el servicio de usuario se encuentre activo
 */
const checkUserServiceIsActive = createCheckServiceIsActive(SERVICES.USERS);

module.exports = {
    checkUserServiceIsActive
}