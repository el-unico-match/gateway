const {createCheckServiceIsActive} = require('../uncategorized');
const { SERVICES } = require('../../types/services');

/**
 * Verificar que el servicio de usuario se encuentre activo
 */
const checkUserServiceIsActive = createCheckServiceIsActive(SERVICES.USERS);

/**
 * 
 * @param {*} role Role a checkear
 * @returns En caso que el servicio usuario se encuentre activo retorna verdadero.
 * Si esta inactivo retornada verdadero únicamente si el rol es administrador.
 */
//const checkAccess = (req, res) => {
    /*
    if (!getServiceStatus(SERVICES.USERS).active) {
        return role === ROLES.ADMINISTRATOR
    } */       
  //  return true;
//}


module.exports = {
    checkUserServiceIsActive
}