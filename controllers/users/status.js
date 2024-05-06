const {SERVICES} = require('../../types/services');
const {getServiceStatus} = require('../../servicesStatus/servicesStatus');
const {doGetAxios} = require('../../helpers/axiosHelper');

/**
 * 
 * @return retorna el resultado de consultar el estado del servicio
 * pudiendo lanzar excepciones.
 */
const getStatusUsers = async () => {
    const url = getServiceStatus(SERVICES.USERS).target;
    const body = {};
    const headers = {};
    const params = {};
    const endpoint = 'status';
    return await doGetAxios(url, headers, body, params, endpoint);
}

module.exports = {getStatusUsers}